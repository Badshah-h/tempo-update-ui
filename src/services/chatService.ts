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
export const sendMessage = async (message: string, conversationId?: string, modelId?: string): Promise<Message> => {
    await delay(1000); // Simulate AI processing time

    // Generate a response based on the user's message
    // In a real implementation, this would use the modelId to select the appropriate AI model
    const response = generateMockResponse(message, modelId);

    return {
        id: `ai-${Date.now()}`,
        content: response,
        sender: "ai",
        timestamp: new Date(),
        modelId: modelId || 'default-model',
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

// Generate embed code for the widget
export const generateEmbedCode = async (config: {
    widgetId: string;
    embedType: 'iframe' | 'web-component' | 'script';
    theme: string;
    position: string;
    autoOpen: boolean;
    hideOnMobile: boolean;
    customDomain?: string;
    customWidth?: string;
    customHeight?: string;
    apiKey?: string;
}): Promise<string> => {
    await delay(100);
    
    const baseUrl = config.customDomain || "https://chat.example.com";
    
    switch (config.embedType) {
        case 'iframe':
            return `<!-- AI Chat Widget (iframe) -->\n<iframe \n  src="${baseUrl}/embed/${config.widgetId}?theme=${config.theme}&position=${config.position}${config.autoOpen ? "&autoOpen=true" : ""}${config.hideOnMobile ? "&hideOnMobile=true" : ""}${config.customWidth && config.customHeight ? `&width=${config.customWidth}&height=${config.customHeight}` : ""}" \n  style="position: fixed; ${config.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"} ${config.position.includes("right") ? "right: 20px;" : "left: 20px;"} border: none; width: 60px; height: 60px; z-index: 999; overflow: hidden;" \n  id="ai-chat-widget"\n  allow="microphone; camera"\n  title="AI Chat Assistant">\n</iframe>`;
            
        case 'web-component':
            return `<!-- AI Chat Widget (Web Component) -->\n<script type="module" src="${baseUrl}/embed/widget.js"></script>\n<ai-chat-widget \n  widget-id="${config.widgetId}" \n  theme="${config.theme}" \n  position="${config.position}"\n  ${config.autoOpen ? "auto-open" : ""}\n  ${config.hideOnMobile ? "hide-on-mobile" : ""}\n  ${config.customWidth && config.customHeight ? `width="${config.customWidth}" height="${config.customHeight}"` : ""}\n  api-key="${config.apiKey || ''}">\n</ai-chat-widget>`;
            
        case 'script':
            return `<!-- AI Chat Widget (Script) -->\n<script>\n  (function(w,d,s,o,f,js,fjs){\n    w['AI-Chat-Widget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};\n    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];\n    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);\n  }(window,document,'script','aiChat','${baseUrl}/embed/widget-loader.js'));\n  \n  aiChat('init', {\n    widgetId: '${config.widgetId}',\n    theme: '${config.theme}',\n    position: '${config.position}',\n    autoOpen: ${config.autoOpen},\n    hideOnMobile: ${config.hideOnMobile},\n    ${config.customWidth && config.customHeight ? `width: ${config.customWidth},\n    height: ${config.customHeight},` : ""}\n    apiKey: '${config.apiKey || ''}'\n  });\n</script>`;
            
        default:
            return `<!-- Invalid embed type selected -->`;
    }
};

// Get available AI models
export const getAIModels = async () => {
    await delay(300);
    
    return [
        {
            id: 'gemini-pro',
            name: 'Gemini Pro',
            provider: 'Google',
            type: 'text',
            capabilities: ['text-generation', 'chat', 'summarization'],
            contextTypes: ['general', 'technical', 'creative'],
            maxTokens: 8192,
            apiEndpoint: 'https://api.example.com/v1/gemini-pro'
        },
        {
            id: 'gemini-pro-vision',
            name: 'Gemini Pro Vision',
            provider: 'Google',
            type: 'multimodal',
            capabilities: ['text-generation', 'chat', 'image-understanding'],
            contextTypes: ['general', 'visual', 'technical'],
            maxTokens: 4096,
            apiEndpoint: 'https://api.example.com/v1/gemini-pro-vision'
        },
        {
            id: 'mistral-7b',
            name: 'Mistral 7B',
            provider: 'Hugging Face',
            type: 'text',
            capabilities: ['text-generation', 'chat', 'code-generation'],
            contextTypes: ['technical', 'code', 'general'],
            maxTokens: 8192,
            apiEndpoint: 'https://api.example.com/v1/mistral-7b'
        },
        {
            id: 'llama-3-70b',
            name: 'Llama 3 70B',
            provider: 'Hugging Face',
            type: 'text',
            capabilities: ['text-generation', 'chat', 'reasoning'],
            contextTypes: ['general', 'technical', 'creative', 'reasoning'],
            maxTokens: 8192,
            apiEndpoint: 'https://api.example.com/v1/llama-3-70b'
        }
    ];
};

// Get routing rules
export const getRoutingRules = async () => {
    await delay(300);
    
    return [
        {
            id: 'rule-1',
            name: 'Technical Questions',
            priority: 100,
            conditions: [
                {
                    type: 'keyword',
                    operator: 'contains',
                    value: 'code'
                },
                {
                    type: 'keyword',
                    operator: 'contains',
                    value: 'programming'
                }
            ],
            targetModel: 'mistral-7b',
            active: true
        },
        {
            id: 'rule-2',
            name: 'Visual Content',
            priority: 90,
            conditions: [
                {
                    type: 'keyword',
                    operator: 'contains',
                    value: 'image'
                }
            ],
            targetModel: 'gemini-pro-vision',
            active: true
        },
        {
            id: 'rule-3',
            name: 'Complex Reasoning',
            priority: 80,
            conditions: [
                {
                    type: 'length',
                    operator: 'greater_than',
                    value: 100
                }
            ],
            targetModel: 'llama-3-70b',
            active: true
        }
    ];
};

// Get default AI model
export const getDefaultAIModel = async () => {
    await delay(300);
    return 'mistral-7b';
};
