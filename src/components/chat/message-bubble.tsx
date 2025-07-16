"use client";

import { toast } from "sonner";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Copy, Check, User, Bot, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/stores/chat-store";
import { useAuthStore } from "@/lib/stores/auth-store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThreadView } from "./thread-view";
import { EmojiPicker } from "./emoji-picker";
import { Button } from "@/components/ui/button";
import { ReactionDisplay } from "./reaction-display";
import Image from "next/image";

interface MessageBubbleProps {
  message: Message;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, reactionId: string) => void;
  onReply?: (parentMessageId: string, content: string, image?: string) => void;
  showThreadButton?: boolean;
  isReply?: boolean;
}

export function MessageBubble({
  message,
  onReactionAdd,
  onReactionRemove,
  onReply,
  showThreadButton = true,
  isReply = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { user } = useAuthStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast.success("Copied!", {
        description: "Message copied to clipboard.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to copy message.",
      });
    }
  };

  const handleReactionAdd = (emoji: string) => {
    if (onReactionAdd && user) {
      onReactionAdd(message.id, emoji);
    }
  };

  const handleReactionRemove = (reactionId: string) => {
    if (onReactionRemove) {
      onReactionRemove(message.id, reactionId);
    }
  };

  const handleReply = (content: string, image?: string) => {
    if (onReply) {
      onReply(message.id, content, image);
    }
  };

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isUser ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      )}

      <div className={cn("flex flex-col max-w-[70%]", isUser && "items-end")}>
        <div
          className={cn(
            "relative rounded-lg px-4 py-2 break-words",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
            isReply && "border-l-2 border-primary/20 ml-2"
          )}
        >
          {message.image && (
            <div className="mb-2">
              <Image
                width={100}
                height={100}
                src={message.image || "/placeholder.svg"}
                alt="Uploaded image"
                className="max-w-full h-auto rounded-md"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}

          <p className="whitespace-pre-wrap">{message.content}</p>

          {/* Action buttons */}
          {showActions && (
            <div
              className={cn(
                "absolute -top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded-md shadow-sm p-1",
                isUser ? "-left-20" : "-right-20"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>

              <EmojiPicker
                onEmojiSelect={handleReactionAdd}
                trigger={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <span className="text-sm">😊</span>
                  </Button>
                }
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy message
                  </DropdownMenuItem>
                  {showThreadButton && onReply && (
                    <DropdownMenuItem onClick={() => {}}>
                      Reply in thread
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Reactions */}
        <ReactionDisplay
          reactions={message.reactions}
          onReactionClick={handleReactionAdd}
          onReactionRemove={handleReactionRemove}
        />

        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>

          {/* Thread button */}
          {showThreadButton && onReply && (
            <ThreadView
              parentMessage={message}
              onReply={handleReply}
              onReactionAdd={onReactionAdd || (() => {})}
              onReactionRemove={onReactionRemove || (() => {})}
            />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4 text-secondary-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}
