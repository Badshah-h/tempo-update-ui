import { Message, Conversation, ChatWidgetConfig } from "@/types/chat";
import { defaultMessages, generateMockResponse } from "@/mock/chat/messages";
import { mockConversations } from "@/mock/chat/conversations";
import { defaultWidgetConfig, widgetThemes } from "@/mock/chat/config";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get messages for a conversation
export const getMessages = async (conversationId?: string): Promise<Message[]> => {
    await delay(300); // Simulate network delay

    if (!conversationId) {
        return defaultMessages;
    }

    const conversation = mockConversations.find(conv => conv.id === conversationId);
    return conversation ? conversation.messages : defaultMessages;
};

// Send a message and get a response
export const sendMessage = async (message: string, conversationId?: string): Promise<Message> => {
    await delay(1000); // Simulate AI processing time

    // Generate a response based on the user's message
    const response = generateMockResponse(message);

    return {
        id: `ai-${Date.now()}`,
        content: response,
        sender: "ai",
        timestamp: new Date(),
    };
};

// Get all conversations for a user
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    await delay(300);
    return mockConversations.filter(conv => conv.userId === userId);
};

// Create a new conversation
export const createConversation = async (userId: string, initialMessage?: string): Promise<Conversation> => {
    await delay(300);

    const messages: Message[] = [];

    // Add welcome message
    messages.push({
        id: `welcome-${Date.now()}`,
        content: defaultWidgetConfig.welcomeMessage,
        sender: "ai",
        timestamp: new Date(),
    });

    // Add initial message if provided
    if (initialMessage) {
        messages.push({
            id: `user-${Date.now()}`,
            content: initialMessage,
            sender: "user",
            timestamp: new Date(),
        });

        // Generate AI response to initial message
        const response = await sendMessage(initialMessage);
        messages.push(response);
    }

    const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: initialMessage ? initialMessage.substring(0, 30) + "..." : "New Conversation",
        messages,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
    };

    return newConversation;
};

// Get widget configuration
export const getWidgetConfig = async (): Promise<ChatWidgetConfig> => {
    await delay(200);
    return defaultWidgetConfig;
};

// Update widget configuration
export const updateWidgetConfig = async (config: Partial<ChatWidgetConfig>): Promise<ChatWidgetConfig> => {
    await delay(300);

    // In a real implementation, this would update the config in the database
    const updatedConfig = { ...defaultWidgetConfig, ...config };

    return updatedConfig;
};

// Get available widget themes
export const getWidgetThemes = async () => {
    await delay(200);
    return widgetThemes;
};
