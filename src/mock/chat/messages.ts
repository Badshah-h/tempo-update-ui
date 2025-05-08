import { Message } from "@/types/chat";

export const defaultMessages: Message[] = [
    {
        id: "1",
        content: "Hello! How can I help you today?",
        sender: "ai",
        timestamp: new Date(Date.now() - 60000),
    },
    {
        id: "2",
        content: "I have a question about your services.",
        sender: "user",
        timestamp: new Date(Date.now() - 45000),
    },
    {
        id: "3",
        content:
            "Of course! I can provide information about our services. What specifically would you like to know?",
        sender: "ai",
        timestamp: new Date(Date.now() - 30000),
    },
];

export const sampleResponses: string[] = [
    "I understand your question. Based on the information available, I can tell you that our service offers comprehensive solutions for businesses of all sizes.",
    "That's a great question! Our platform is designed to be user-friendly while providing powerful features for advanced users as well.",
    "Thank you for asking. Our pricing structure is flexible and scales with your needs, starting from just $19/month for the basic plan.",
    "I'd be happy to explain that in more detail. The feature you're asking about allows you to automate repetitive tasks and save valuable time.",
    "Based on what you've described, I would recommend our Professional plan which includes all the features you need for your use case.",
    "I'm sorry to hear you're experiencing that issue. Let me suggest a few troubleshooting steps that might help resolve it quickly.",
    "That's an interesting question! While I don't have the exact answer, I can connect you with one of our specialists who can provide more detailed information.",
    "Our AI chat widget can be integrated with virtually any website platform, including WordPress, Shopify, and custom-built sites.",
    "The implementation process typically takes less than 5 minutes. You simply need to copy the embed code and paste it into your website's HTML.",
    "Yes, all plans include 24/7 customer support through chat, email, and phone for urgent issues."
];

export const generateMockResponse = (userMessage: string): string => {
    // Simple keyword matching for more contextual responses
    if (userMessage.toLowerCase().includes("price") || userMessage.toLowerCase().includes("cost")) {
        return "Our pricing starts at $19/month for the Basic plan, $49/month for Professional, and $99/month for Enterprise. Each plan includes different features and support levels tailored to different business needs.";
    }

    if (userMessage.toLowerCase().includes("integrate") || userMessage.toLowerCase().includes("installation")) {
        return "Integration is simple! Just copy the embed code from your dashboard and paste it into your website's HTML. We support all major platforms including WordPress, Shopify, Wix, and custom sites. The widget automatically adapts to your site's design.";
    }

    if (userMessage.toLowerCase().includes("ai") || userMessage.toLowerCase().includes("model")) {
        return "We support multiple AI models including Gemini Pro from Google and various Hugging Face models. You can select which model powers your chat widget from the admin dashboard, or even create rules to use different models for different types of queries.";
    }

    // Default to a random response if no keywords match
    return sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
};
