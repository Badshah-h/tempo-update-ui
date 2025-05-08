import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
}

interface MessageListProps {
  messages?: Message[];
  isLoading?: boolean;
}

const MessageList = ({
  messages = [],
  isLoading = false,
}: MessageListProps) => {
  // Auto scroll to bottom when new messages arrive
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Default messages if none provided
  const defaultMessages: Message[] = [
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      content: "I have a question about your services.",
      sender: "user",
      timestamp: new Date(Date.now() - 45000),
    },
    {
      id: "3",
      content:
        "Of course! I can provide information about our services. What specifically would you like to know?",
      sender: "ai",
      timestamp: new Date(Date.now() - 30000),
    },
  ];

  const displayMessages = messages.length > 0 ? messages : defaultMessages;

  return (
    <div className="w-full h-[380px] bg-background border rounded-md">
      <ScrollArea ref={scrollAreaRef} className="h-full p-4">
        <div className="flex flex-col space-y-4">
          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start gap-2 max-w-[80%]`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-assistant"
                      alt="AI"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                <Card
                  className={`p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">
                      {/* Support for markdown-like formatting */}
                      {message.content.split("\n").map((line, i) => {
                        // Handle bullet points
                        if (line.startsWith("* ")) {
                          return (
                            <div key={i} className="flex">
                              <span className="mr-2">•</span>
                              {line.substring(2)}
                            </div>
                          );
                        }
                        // Handle numbered lists
                        else if (/^\d+\.\s/.test(line)) {
                          return <div key={i}>{line}</div>;
                        }
                        // Handle headers
                        else if (line.startsWith("## ")) {
                          return (
                            <h3
                              key={i}
                              className="text-lg font-semibold mt-2 mb-1"
                            >
                              {line.substring(3)}
                            </h3>
                          );
                        } else if (line.startsWith("# ")) {
                          return (
                            <h2 key={i} className="text-xl font-bold mt-3 mb-2">
                              {line.substring(2)}
                            </h2>
                          );
                        }
                        // Handle links - basic support for [text](url)
                        else if (
                          line.includes("[") &&
                          line.includes("](") &&
                          line.includes(")")
                        ) {
                          const parts = [];
                          let currentText = line;
                          let linkMatch;
                          let index = 0;

                          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

                          while ((linkMatch = linkRegex.exec(line)) !== null) {
                            const beforeLink = line.substring(
                              index,
                              linkMatch.index,
                            );
                            if (beforeLink)
                              parts.push(
                                <span key={`text-${index}`}>{beforeLink}</span>,
                              );

                            parts.push(
                              <a
                                key={`link-${linkMatch.index}`}
                                href={linkMatch[2]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-500 hover:text-blue-700"
                              >
                                {linkMatch[1]}
                              </a>,
                            );

                            index = linkMatch.index + linkMatch[0].length;
                          }

                          const afterLinks = line.substring(index);
                          if (afterLinks)
                            parts.push(
                              <span key={`text-end`}>{afterLinks}</span>,
                            );

                          return <div key={i}>{parts}</div>;
                        }
                        // Regular text
                        return <div key={i}>{line}</div>;
                      })}
                    </div>
                  )}
                </Card>

                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                    />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai-assistant"
                    alt="AI"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <Card className="p-3 bg-muted">
                  <Skeleton className="h-4 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[170px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
