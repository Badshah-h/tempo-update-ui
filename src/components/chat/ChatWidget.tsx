import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ChatWidgetProps {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  initiallyOpen?: boolean;
  avatarUrl?: string;
  welcomeMessage?: string;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const ChatWidget = ({
  title = "AI Assistant",
  subtitle = "Ask me anything!",
  primaryColor = "#4f46e5",
  secondaryColor = "#f3f4f6",
  position = "bottom-right",
  initiallyOpen = false,
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=assistant",
  welcomeMessage = "Hello! How can I help you today?",
  onSendMessage,
  onClose,
  onMinimize,
  onMaximize,
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      content: string;
      sender: "user" | "ai";
      timestamp: Date;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  useEffect(() => {
    // Add welcome message when widget first opens
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: welcomeMessage,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, welcomeMessage, messages.length]);

  const handleToggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMaximized(false);
    }
  };

  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMaximized) {
      onMinimize?.();
    } else {
      onMaximize?.();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Call the onSendMessage prop if provided
    onSendMessage?.(message);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: `ai-${Date.now()}`,
        content: `I received your message: "${message}". This is a placeholder response. In a real implementation, this would be replaced with an actual AI response from the backend.`,
        sender: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Button
              onClick={handleToggleWidget}
              className="h-14 w-14 rounded-full shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col ${isMaximized ? "fixed inset-4 sm:inset-10 md:inset-20" : "w-[350px] h-[500px]"}`}
          >
            <Card className="flex flex-col h-full overflow-hidden shadow-xl border bg-background">
              {/* Chat Header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-white/10">
                    <img
                      src={avatarUrl}
                      alt="AI Assistant"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{title}</h3>
                    <p className="text-xs text-white/80">{subtitle}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleMaximize}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isMaximized ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  aiAvatar={avatarUrl}
                />
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-background">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  primaryColor={primaryColor}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;
