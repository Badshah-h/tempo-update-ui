import { ChatWidgetConfig } from "@/types/chat";

export const defaultWidgetConfig: ChatWidgetConfig = {
  title: "AI Assistant",
  subtitle: "Ask me anything!",
  primaryColor: "#D39931",
  secondaryColor: "#F6F7FA",
  position: "bottom-right",
  initiallyOpen: false,
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  welcomeMessage: "Hello! How can I help you today?",
  suggestedQuestions: [
    "How can I integrate this chat widget?",
    "What AI models do you support?",
    "Can I customize the appearance?",
  ],
  fontFamily: "Inter",
  borderRadius: 8,
  spacing: "comfortable",
  bubbleStyle: "rounded",
  theme: "system",
  soundEnabled: true,
  autoOpenTriggers: {
    timeDelay: 5000,
    scrollPercentage: 50,
    exitIntent: false,
  },
  offlineMessage:
    "You're currently offline. Messages will be sent when you reconnect.",
  accessibilityOptions: {
    highContrast: false,
    largeText: false,
    screenReaderOptimized: false,
  },
  crossDomainOptions: {
    allowedOrigins: [],
    secureMessaging: true,
  },
};

export const widgetThemes = [
  {
    id: "modern-clean",
    name: "Modern Clean",
    config: {
      ...defaultWidgetConfig,
      primaryColor: "#D39931",
      secondaryColor: "#F6F7FA",
      borderRadius: 8,
      fontFamily: "Inter",
    },
  },
  {
    id: "glass-effect",
    name: "Glass Effect",
    config: {
      ...defaultWidgetConfig,
      primaryColor: "rgba(211, 153, 49, 0.8)", // #D39931 with opacity
      secondaryColor: "rgba(246, 247, 250, 0.7)", // #F6F7FA with opacity
      borderRadius: 12,
      fontFamily: "SF Pro",
    },
  },
  {
    id: "dark-mode",
    name: "Dark Mode",
    config: {
      ...defaultWidgetConfig,
      primaryColor: "#D39931",
      secondaryColor: "#020817",
      borderRadius: 4,
      fontFamily: "Roboto",
    },
  },
  {
    id: "soft-rounded",
    name: "Soft Rounded",
    config: {
      ...defaultWidgetConfig,
      primaryColor: "#D39931",
      secondaryColor: "#F6F7FA",
      borderRadius: 16,
      fontFamily: "System UI",
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    config: {
      ...defaultWidgetConfig,
      primaryColor: "#D39931",
      secondaryColor: "#FFFFFF",
      borderRadius: 0,
      fontFamily: "Arial",
    },
  },
];
