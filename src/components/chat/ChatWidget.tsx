import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChat } from "@/hooks";
import { ChatWidgetConfig } from "@/types/chat";
import { defaultWidgetConfig } from "@/mock/chat/config";

interface ChatWidgetProps extends Partial<ChatWidgetConfig> {
  conversationId?: string;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const ChatWidget = ({
  title = defaultWidgetConfig.title,
  subtitle = defaultWidgetConfig.subtitle,
  primaryColor = defaultWidgetConfig.primaryColor,
  secondaryColor = defaultWidgetConfig.secondaryColor,
  position = defaultWidgetConfig.position,
  initiallyOpen = defaultWidgetConfig.initiallyOpen,
  avatarUrl = defaultWidgetConfig.avatarUrl,
  welcomeMessage = defaultWidgetConfig.welcomeMessage,
  conversationId,
  onSendMessage,
  onClose,
  onMinimize,
  onMaximize,
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isMaximized, setIsMaximized] = useState(false);

  // Use the chat hook to manage messages and sending
  const { messages, isLoading, sendMessage } = useChat({
    conversationId,
    initialMessages: isOpen
      ? [
          {
            id: "welcome",
            content: welcomeMessage,
            sender: "ai",
            timestamp: new Date(),
          },
        ]
      : [],
  });

  // Position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

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

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Call the onSendMessage prop if provided
    onSendMessage?.(message);

    // Use the sendMessage function from the hook
    await sendMessage(message);
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
              className="h-14 w-14 rounded-full shadow-medium hover:shadow-glow transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                border: "2px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <MessageCircle className="h-6 w-6 text-white drop-shadow-sm" />
              </motion.div>
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
            <Card className="flex flex-col h-full overflow-hidden shadow-premium border bg-background rounded-xl">
              {/* Chat Header */}
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                  borderTopLeftRadius: "calc(var(--radius) - 2px)",
                  borderTopRightRadius: "calc(var(--radius) - 2px)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-white/10 border-2 border-white/20 shadow-sm">
                    <img
                      src={avatarUrl}
                      alt="AI Assistant"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white drop-shadow-sm">
                      {title}
                    </h3>
                    <p className="text-xs text-white/90">{subtitle}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleMaximize}
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
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
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-hidden">
                <MessageList messages={messages} isLoading={isLoading} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-background">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  suggestedQuestions={defaultWidgetConfig.suggestedQuestions}
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
