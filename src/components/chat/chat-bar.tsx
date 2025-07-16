"use client";

import { useState } from "react";
import { SendHorizonal, Mic, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatBar({
  onSendMessage,
  disabled = false,
}: {
  onSendMessage: (msg: string) => void;
  disabled?: boolean;
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="sticky bottom-0 w-full bg-background px-4 py-3 border-t border-muted/50">
      <div className="max-w-3xl mx-auto flex items-center gap-2 bg-muted px-4 py-2 rounded-full shadow-sm">
        <button className="text-muted-foreground hover:text-foreground">
          <Paperclip size={20} />
        </button>
        <Input
          className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={disabled}
        />
        {message ? (
          <Button
            size="icon"
            className="rounded-full"
            onClick={handleSend}
            disabled={disabled}
          >
            <SendHorizonal size={18} />
          </Button>
        ) : (
          <button className="text-muted-foreground hover:text-foreground">
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
