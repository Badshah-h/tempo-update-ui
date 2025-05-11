export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
  isRead?: boolean;
  metadata?: {
    type?: "text" | "image" | "file" | "structured";
    structuredData?: any;
    source?: string;
    confidence?: number;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type ChatBubbleStyle = "rounded" | "square" | "soft" | "modern" | "pill";

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
  bubbleStyle?: ChatBubbleStyle;
  theme?: "light" | "dark" | "system";
  soundEnabled?: boolean;
  autoOpenTriggers?: {
    timeDelay?: number; // in milliseconds
    scrollPercentage?: number; // 0-100
    exitIntent?: boolean;
  };
  offlineMessage?: string;
  accessibilityOptions?: {
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
  };
  crossDomainOptions?: {
    allowedOrigins: string[];
    secureMessaging: boolean;
  };
}

export interface EmbedOptions {
  type: "iframe" | "web-component" | "script";
  lightweightLoader: boolean;
  asyncLoading: boolean;
  preconnect: boolean;
  crossOrigin: "anonymous" | "use-credentials" | "";
  integrity: string;
  deferScripts: boolean;
  lazyLoad: boolean;
  accessibilityCompliance: "A" | "AA" | "AAA";
}
