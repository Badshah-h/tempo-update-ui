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
    widgetId: string;
    theme: "light" | "dark" | "system";
    autoOpen: boolean;
    hideOnMobile: boolean;
    width: string;
    height: string;
    apiKey: string;
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
    customWidth: string;
    customHeight: string;
    spacing: "compact" | "comfortable" | "spacious";
}

export interface ChatWidgetTheme {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
}