import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { socketService } from '@/services/socket-service';
import { aiService, AIConfig } from '@/services/ai-service';

interface UseChatOptions {
  conversationId?: string;
  initialMessages?: Message[];
  aiConfig?: Partial<AIConfig>;
  useSocketIO?: boolean;
  offlineSupport?: boolean;
}

interface UseChatResult {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  isOnline: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  updateAIConfig: (config: Partial<AIConfig>) => void;
}

/**
 * Hook for managing chat interactions
 */
export function useChat({
  conversationId = uuidv4(),
  initialMessages = [],
  aiConfig,
  useSocketIO = true,
  offlineSupport = true
}: UseChatOptions = {}): UseChatResult {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const offlineQueue = useRef<Message[]>([]);
  
  // Initialize AI service with config if provided
  useEffect(() => {
    if (aiConfig) {
      aiService.updateConfig(aiConfig);
    }
  }, []);
  
  // Initialize socket service if enabled
  useEffect(() => {
    if (useSocketIO) {
      socketService.initialize();
      
      // Listen for incoming messages
      const unsubscribeMessage = socketService.onMessage((message) => {
        setMessages(prev => [...prev, message]);
        setIsLoading(false);
      });
      
      // Listen for typing indicators
      const unsubscribeTyping = socketService.onTypingIndicator((isTyping) => {
        setIsTyping(isTyping);
      });
      
      // Listen for connection status changes
      const unsubscribeStatus = socketService.onStatusChange((status) => {
        setIsOnline(status === 'connected');
        
        // Process offline queue when reconnected
        if (status === 'connected' && offlineQueue.current.length > 0) {
          processOfflineQueue();
        }
      });
      
      return () => {
        unsubscribeMessage();
        unsubscribeTyping();
        unsubscribeStatus();
      };
    }
  }, [useSocketIO]);
  
  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Process messages in the offline queue
  const processOfflineQueue = useCallback(() => {
    if (offlineQueue.current.length > 0) {
      console.log(`Processing offline queue (${offlineQueue.current.length} messages)`);
      
      const queue = [...offlineQueue.current];
      offlineQueue.current = [];
      
      queue.forEach(message => {
        if (useSocketIO) {
          socketService.sendMessage(message);
        } else {
          processMessageWithAI(message.content);
        }
      });
    }
  }, [useSocketIO]);
  
  // Process message with AI service
  const processMessageWithAI = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      setIsTyping(true);
      
      // Get AI response
      const response = await aiService.processMessage(content, messages);
      
      // Create AI message
      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setIsLoading(false);
      
      return aiMessage;
    } catch (error) {
      console.error('Error processing message with AI:', error);
      setIsTyping(false);
      setIsLoading(false);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          type: 'text',
          source: 'error'
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return errorMessage;
    }
  }, [messages]);
  
  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    
    // Handle message based on connection status
    if (!isOnline && offlineSupport) {
      console.log('Device is offline, queueing message');
      offlineQueue.current.push(userMessage);
      
      // Add a pending message to indicate offline status
      const pendingMessage: Message = {
        id: uuidv4(),
        content: 'Your message will be sent when you reconnect.',
        sender: 'ai',
        timestamp: new Date(),
        metadata: {
          type: 'text',
          source: 'offline'
        }
      };
      
      setMessages(prev => [...prev, pendingMessage]);
      return;
    }
    
    // Process message
    if (useSocketIO) {
      setIsLoading(true);
      socketService.sendMessage(userMessage);
    } else {
      await processMessageWithAI(content);
    }
  }, [isOnline, useSocketIO, offlineSupport, processMessageWithAI]);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Update AI configuration
  const updateAIConfig = useCallback((config: Partial<AIConfig>) => {
    aiService.updateConfig(config);
  }, []);
  
  return {
    messages,
    isLoading,
    isTyping,
    isOnline,
    sendMessage,
    clearMessages,
    updateAIConfig
  };
}
