export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
  isRead?: boolean;
  conversationId?: string;
  metadata?: {
    type?: "text" | "image" | "file" | "structured";
    structuredData?: any;
    source?: string;
    confidence?: number;
    modelId?: string;
    processingTime?: number;
    tokens?: {
      prompt?: number;
      completion?: number;
      total?: number;
    };
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  widgetId?: string;
  metadata?: Record<string, any>;
  tags?: string[];
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
    urlPattern?: string; // regex pattern for URL matching
    pageViews?: number; // number of page views before showing
  };
  offlineMessage?: string;
  accessibilityOptions?: {
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
    reducedMotion: boolean;
  };
  crossDomainOptions?: {
    allowedOrigins: string[];
    secureMessaging: boolean;
  };
  aiOptions?: {
    defaultModelId?: string;
    contextLength?: number;
    systemPrompt?: string;
    temperature?: number;
    streamResponses?: boolean;
  };
  analyticsOptions?: {
    trackEvents?: boolean;
    anonymizeIp?: boolean;
    sessionTimeout?: number;
    customDimensions?: Record<string, string>;
  };
  privacyOptions?: {
    dataRetentionDays?: number;
    allowTranscriptDownload?: boolean;
    showPrivacyPolicy?: boolean;
    privacyPolicyUrl?: string;
    requireConsent?: boolean;
    consentText?: string;
  };
  customizationOptions?: {
    css?: string;
    headerTemplate?: string;
    footerTemplate?: string;
    messageTemplate?: string;
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
  containerSelector?: string;
  shadowDOM?: boolean;
  isolateStyles?: boolean;
  loadStrategy?: "eager" | "lazy" | "on-interaction" | "on-visible";
  fallbackBehavior?: "hide" | "placeholder" | "error-message";
  errorReporting?: boolean;
  performanceTracking?: boolean;
}

export interface WidgetInstance {
  id: string;
  name: string;
  config: ChatWidgetConfig;
  embedOptions: EmbedOptions;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  status: "active" | "inactive" | "draft";
  domains: string[];
  analytics: {
    totalConversations: number;
    totalMessages: number;
    averageRating: number;
    activeUsers: number;
  };
}
