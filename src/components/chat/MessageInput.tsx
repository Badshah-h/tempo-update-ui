import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, PlusIcon, MicIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  suggestedQuestions?: string[];
  onSuggestedQuestionClick?: (question: string) => void;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage = () => {},
  isLoading = false,
  suggestedQuestions = [
    "How can I integrate this chat widget?",
    "What AI models do you support?",
    "Can I customize the appearance?",
  ],
  onSuggestedQuestionClick = () => {},
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    // Focus input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

        <Input
          ref={inputRef}
          type="text"
          placeholder={isLoading ? "AI is responding..." : placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="flex-1 bg-background border-muted focus-visible:ring-primary rounded-full px-4 shadow-inner-soft"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full flex-shrink-0 hover:bg-accent/50"
                disabled={isLoading}
              >
                <MicIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>Voice input (coming soon)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
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
