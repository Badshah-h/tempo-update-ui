import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, PlusIcon, MicIcon, SmileIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  isOffline?: boolean;
  suggestedQuestions?: string[];
  onSuggestedQuestionClick?: (question: string) => void;
  placeholder?: string;
  onAttachmentUpload?: (file: File) => void;
  onVoiceRecording?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage = () => {},
  isLoading = false,
  isOffline = false,
  suggestedQuestions = [
    "How can I integrate this chat widget?",
    "What AI models do you support?",
    "Can I customize the appearance?",
  ],
  onSuggestedQuestionClick = () => {},
  placeholder = "Type your message...",
  onVoiceRecording,
}) => {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }
      setRecordingTime(0);

      // Call the voice recording handler
      if (onVoiceRecording) {
        onVoiceRecording();
      }
    } else {
      // Start recording
      setIsRecording(true);
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Format recording time as MM:SS
  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    // Focus input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Clean up interval on unmount
    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, []);

  return (
    <div className="bg-background border-t p-4 rounded-b-lg">
      {showSuggestions && suggestedQuestions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors bg-accent/50 border-accent-foreground/10 hover:bg-accent hover:border-accent-foreground/20 rounded-full px-3"
              onClick={() => {
                onSuggestedQuestionClick(question);
                setShowSuggestions(false);
              }}
            >
              {question}
            </Button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full flex-shrink-0 hover:bg-accent/50"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>Show suggestions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={
              isLoading
                ? "AI is responding..."
                : isRecording
                  ? "Recording..."
                  : isOffline
                    ? "You're offline. Message will be sent when online."
                    : placeholder
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isRecording}
            className="flex-1 bg-background border-muted focus-visible:ring-primary rounded-full px-4 shadow-inner-soft"
          />
          {isRecording && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-red-500 animate-pulse">
              <span className="text-xs font-medium">
                {formatRecordingTime()}
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
            </div>
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant={isRecording ? "destructive" : "ghost"}
                className="rounded-full flex-shrink-0 hover:bg-accent/50"
                disabled={isLoading}
                onClick={handleVoiceRecording}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>{isRecording ? "Stop recording" : "Voice input"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          type="submit"
          size="icon"
          disabled={(!message.trim() && !isRecording) || isLoading}
          className="rounded-full flex-shrink-0 shadow-sm transition-all duration-300"
          style={{
            background:
              message.trim() && !isLoading
                ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.85))"
                : undefined,
            transform:
              message.trim() && !isLoading ? "scale(1.05)" : "scale(1)",
            boxShadow:
              message.trim() && !isLoading
                ? "0 0 15px rgba(var(--primary), 0.3)"
                : undefined,
          }}
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
