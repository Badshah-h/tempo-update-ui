import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/types/chat';
import { getMessages, sendMessage, createConversation } from '@/services';
import socketService from '@/services/socketService';
import aiRoutingService from '@/services/aiRoutingService';

interface UseChatProps {
  conversationId?: string;
  initialMessages?: Message[];
  userId?: string;
  useWebSocket?: boolean;
  persistHistory?: boolean;
  enableTypingIndicator?: boolean;
}

export const useChat = ({
  conversationId,
  initialMessages = [],
  userId,
  useWebSocket = false,
  persistHistory = true,
  enableTypingIndicator = true
}: UseChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUserId, setTypingUserId] = useState<string | undefined>(undefined);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketConnectedRef = useRef<boolean>(false);
  
  // Initialize WebSocket connection if enabled
  useEffect(() => {
    if (!useWebSocket) return;
    
    // Initialize socket connection
    socketService.init();
    
    // Set up message handler
    const messageUnsubscribe = socketService.onMessage((message) => {
      setMessages((prev) => [...prev.filter(msg => !msg.isLoading), message]);
      setIsLoading(false);
    });
    
    // Set up typing indicator handler
    const typingUnsubscribe = socketService.onTyping((isTyping, userId) => {
      setIsTyping(isTyping);
      setTypingUserId(userId);
    });
    
    // Set up connection status handler
    const connectionUnsubscribe = socketService.onConnectionChange((status) => {
      socketConnectedRef.current = status === 'connected';
      
      if (status === 'connected' && activeConversationId) {
        socketService.joinConversation(activeConversationId);
      }
    });
    
    // Join conversation room if ID is available
    if (activeConversationId && socketService.isConnected()) {
      socketService.joinConversation(activeConversationId);
    }
    
    // Clean up on unmount
    return () => {
      messageUnsubscribe();
      typingUnsubscribe();
      connectionUnsubscribe();
      
      if (activeConversationId) {
        socketService.leaveConversation(activeConversationId);
      }
    };
  }, [useWebSocket, activeConversationId]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (initialMessages.length > 0 || !persistHistory) return;
      
      try {
        setIsLoading(true);
        const loadedMessages = await getMessages(activeConversationId);
        setMessages(loadedMessages);
        setError(null);
      } catch (err) {
        setError('Failed to load messages');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [activeConversationId, initialMessages, persistHistory]);

  // Handle typing indicator
  const handleTypingIndicator = useCallback((isTyping: boolean) => {
    if (!enableTypingIndicator || !useWebSocket) return;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    // Send typing indicator via socket
    if (socketConnectedRef.current) {
      socketService.sendTyping(isTyping, activeConversationId);
      
      // Automatically clear typing indicator after 3 seconds
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          socketService.sendTyping(false, activeConversationId);
        }, 3000);
      }
    }
  }, [activeConversationId, enableTypingIndicator, useWebSocket]);

  // Create a new conversation
  const createNewConversation = useCallback(async (initialMessage?: string) => {
    if (!userId) return null;
    
    try {
      setIsLoading(true);
      const newConversation = await createConversation(userId, initialMessage);
      setActiveConversationId(newConversation.id);
      setMessages(newConversation.messages);
      
      // Join the new conversation room if using WebSockets
      if (useWebSocket && socketConnectedRef.current) {
        socketService.joinConversation(newConversation.id);
      }
      
      return newConversation;
    } catch (err) {
      setError('Failed to create conversation');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, useWebSocket]);

  // Send a message and get a response
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      // Create a new conversation if needed
      if (!activeConversationId && userId) {
        await createNewConversation(content);
        return; // The response will come through the WebSocket or the createConversation function
      }
      
      // Add user message to the chat
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      
      // Show loading indicator
      const loadingMessage: Message = {
        id: `loading-${Date.now()}`,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
        isLoading: true,
      };
      
      setMessages((prev) => [...prev, loadingMessage]);
      setIsLoading(true);

      // Use AI routing service to determine the appropriate model
      const routingContext = {
        message: content,
        conversationId: activeConversationId,
        userId,
        previousMessages: messages.map(msg => ({
          content: msg.content,
          sender: msg.sender
        }))
      };
      
      const routingResult = aiRoutingService.routeMessage(routingContext);
      
      let aiResponse;
      
      // If using WebSockets, send through socket
      if (useWebSocket && socketConnectedRef.current) {
        socketService.sendMessage(content, activeConversationId);
        // The response will come through the WebSocket message handler
        return null;
      } else {
        // Otherwise use HTTP API
        aiResponse = await sendMessage(content, activeConversationId, routingResult.modelId);

        // Replace loading message with actual response
        setMessages((prev) => 
          prev.filter(msg => !msg.isLoading).concat(aiResponse)
        );
      }
      
      setError(null);
      return aiResponse;
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
      
      // Remove loading message on error
      setMessages((prev) => prev.filter(msg => !msg.isLoading));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, createNewConversation, messages, userId, useWebSocket]);

  return {
    messages,
    isLoading,
    error,
    isTyping,
    typingUserId,
    conversationId: activeConversationId,
    sendMessage: handleSendMessage,
    createConversation: createNewConversation,
    setTypingIndicator: handleTypingIndicator,
  };
};
