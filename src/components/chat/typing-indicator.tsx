"use client";

import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Genie is typing</span>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
