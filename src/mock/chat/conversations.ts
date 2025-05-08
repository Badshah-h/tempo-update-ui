import { Conversation } from "@/types/chat";
import { defaultMessages } from "./messages";

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Website Integration Help",
    messages: [
      {
        id: "msg-1-1",
        content: "Hello! How can I help you today?",
        sender: "ai",
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
      {
        id: "msg-1-2",
        content: "I'm trying to add the chat widget to my WordPress site but having some issues.",
        sender: "user",
        timestamp: new Date(Date.now() - 86400000 * 2 + 60000),
      },
      {
        id: "msg-1-3",
        content: "I'd be happy to help with that! Could you tell me what specific issue you're encountering with the WordPress integration?",
        sender: "ai",
        timestamp: new Date(Date.now() - 86400000 * 2 + 120000),
      },
      {
        id: "msg-1-4",
        content: "The widget loads but it's not showing up in the right position on mobile devices.",
        sender: "user",
        timestamp: new Date(Date.now() - 86400000 * 2 + 180000),
      },
      {
        id: "msg-1-5",
        content: "That's likely a CSS conflict with your WordPress theme. Try adding the 'force-position' attribute to your embed code like this: data-force-position=true. This will override any conflicting styles from your theme.",
        sender: "ai",
        timestamp: new Date(Date.now() - 86400000 * 2 + 240000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2 + 240000),
    userId: "user-1",
  },
  {
    id: "conv-2",
    title: "Pricing Questions",
    messages: [
      {
        id: "msg-2-1",
        content: "Hello! How can I help you today?",
        sender: "ai",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "msg-2-2",
        content: "What's your pricing structure? Do you offer a free plan?",
        sender: "user",
        timestamp: new Date(Date.now() - 86400000 + 60000),
      },
      {
        id: "msg-2-3",
        content: "We offer several pricing tiers to accommodate different needs. Our Basic plan starts at $19/month, Professional at $49/month, and Enterprise at $99/month. We do offer a 14-day free trial on all plans, but we don't have a permanent free tier. Each paid plan includes different message limits and features. Would you like me to explain the specific features included in each plan?",
        sender: "ai",
        timestamp: new Date(Date.now() - 86400000 + 120000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000 + 120000),
    userId: "user-2",
  },
  {
    id: "conv-3",
    title: "Current Conversation",
    messages: defaultMessages,
    createdAt: new Date(Date.now() - 60000),
    updatedAt: new Date(Date.now() - 30000),
    userId: "user-1",
  },
];
