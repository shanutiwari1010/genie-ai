"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";

import type { Message } from "@/lib/stores/chat-store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThreadViewProps {
  parentMessage: Message;
  onReply: (content: string, image?: string) => void;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, reactionId: string) => void;
  disabled?: boolean;
}

export function ThreadView({
  parentMessage,
  onReply,
  onReactionAdd,
  onReactionRemove,
  disabled,
}: ThreadViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReply = (content: string, image?: string) => {
    onReply(content, image);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          {parentMessage.replies.length > 0
            ? `${parentMessage.replies.length} ${
                parentMessage.replies.length === 1 ? "reply" : "replies"
              }`
            : "Reply"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Thread</span>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {/* Parent message */}
              <div className="border-l-2 border-primary pl-4">
                <MessageBubble
                  message={parentMessage}
                  onReactionAdd={onReactionAdd}
                  onReactionRemove={onReactionRemove}
                  showThreadButton={false}
                />
              </div>

              {/* Replies */}
              {parentMessage.replies.map((reply) => (
                <div key={reply.id} className="ml-8">
                  <MessageBubble
                    message={reply}
                    onReactionAdd={onReactionAdd}
                    onReactionRemove={onReactionRemove}
                    showThreadButton={false}
                    isReply={true}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t mt-4 pt-4">
            <MessageInput
              onSendMessage={handleReply}
              disabled={disabled}
              placeholder="Reply to thread..."
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
