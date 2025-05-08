import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';
import { getMessages, sendMessage } from '@/services';

interface UseChatProps {
  conversationId?: string;
  initialMessages?: Message[];
}

export const useChat = ({ conversationId, initialMessages = [] }: UseChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (initialMessages.length > 0) return;
      
      try {
        setIsLoading(true);
        const loadedMessages = await getMessages(conversationId);
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
  }, [conversationId, initialMessages]);

  // Send a message and get a response
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
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

      // Get AI response
      const aiResponse = await sendMessage(content, conversationId);

      // Replace loading message with actual response
      setMessages((prev) => 
        prev.filter(msg => !msg.isLoading).concat(aiResponse)
      );
      
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
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: handleSendMessage,
  };
};
