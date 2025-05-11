import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const messageSound = React.useRef<HTMLAudioElement | null>(null);
  const notificationSound = React.useRef<HTMLAudioElement | null>(null);

  // Initialize sound effects
  useEffect(() => {
    messageSound.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3",
    );
    notificationSound.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/1518/1518-preview.mp3",
    );
    return () => {
      messageSound.current = null;
      notificationSound.current = null;
    };
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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

  // Play sound when new message arrives
  useEffect(() => {
    if (
      messages.length > 0 &&
      !isOpen &&
      messages[messages.length - 1].sender === "ai"
    ) {
      setHasUnreadMessages(true);
      if (isSoundEnabled && notificationSound.current) {
        notificationSound.current
          .play()
          .catch((e) => console.error("Error playing notification sound:", e));
      }
    }
  }, [messages, isOpen, isSoundEnabled]);

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
      setHasUnreadMessages(false);
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

    // Play sound effect when sending message
    if (isSoundEnabled && messageSound.current) {
      messageSound.current
        .play()
        .catch((e) => console.error("Error playing message sound:", e));
    }

    // Simulate typing indicator
    setIsTyping(true);

    // Use the sendMessage function from the hook
    await sendMessage(message);

    // Hide typing indicator after response
    setTimeout(() => setIsTyping(false), 500);
  };

  const handleToggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
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
              className={`h-14 w-14 rounded-full shadow-medium hover:shadow-glow transition-all duration-300 ${hasUnreadMessages ? "animate-pulse" : ""}`}
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
              {hasUnreadMessages && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
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
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-white/90">{subtitle}</p>
                      {isOnline ? (
                        <Wifi className="h-3 w-3 text-green-300" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-red-300" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleToggleSound}
                          className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        >
                          {isSoundEnabled ? (
                            <Volume2 className="h-4 w-4" />
                          ) : (
                            <VolumeX className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>
                          {isSoundEnabled ? "Mute sounds" : "Enable sounds"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{isMaximized ? "Minimize" : "Maximize"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleClose}
                          className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Close</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-hidden">
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  isTyping={isTyping}
                />
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-background">
                {!isOnline && (
                  <div className="mb-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs rounded-md flex items-center gap-1.5">
                    <WifiOff className="h-3.5 w-3.5" />
                    <span>
                      You're offline. Messages will be sent when you reconnect.
                    </span>
                  </div>
                )}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  isOffline={!isOnline}
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
