"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Message } from "@/lib/stores/chat-store";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { ChevronDown } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, reactionId: string) => void;
  onReply: (parentMessageId: string, content: string, image?: string) => void;
}

export function MessageList({
  messages,
  isTyping,
  onLoadMore,
  hasMore,
  isLoading,
  onReactionAdd,
  onReactionRemove,
  onReply,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setIsNearBottom(isAtBottom);
    setShowScrollButton(!isAtBottom && messages.length > 5);

    // Reverse infinite scroll: load more when at top
    if (scrollTop === 0 && hasMore && !isLoading) {
      onLoadMore();
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, isNearBottom]);

  return (
    <div className="h-[calc(100vh_-_10rem)] flex-1 relative">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto chat-scroll p-4 space-y-4"
      >
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onReactionAdd={onReactionAdd}
            onReactionRemove={onReactionRemove}
            onReply={onReply}
          />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="sm"
          className="absolute bottom-4 right-4 rounded-full shadow-lg"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
