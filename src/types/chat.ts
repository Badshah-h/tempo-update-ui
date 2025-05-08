export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    isLoading?: boolean;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    userId: string;
}

export interface ChatWidgetConfig {
    title: string;
    subtitle: string;
    primaryColor: string;
    secondaryColor: string;
    position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    initiallyOpen: boolean;
    avatarUrl: string;
    welcomeMessage: string;
    suggestedQuestions: string[];
    fontFamily: string;
    borderRadius: number;
    spacing: "compact" | "comfortable" | "spacious";
}
