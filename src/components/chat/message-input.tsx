"use client";

import type React from "react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X, Mic } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, image?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSendMessage,
  disabled,
  placeholder = "Type your message...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !selectedImage) return;

    onSendMessage(message.trim() || "Image", selectedImage || undefined);
    setMessage("");
    setSelectedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File too large", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Selected"
            className="max-h-20 rounded-md"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex items-center w-full justify-between relative shadow-sm ring-2 rounded-lg ring-gray-200 dark:ring-gray-600 p-2">
          <Textarea
            value={message}
            rows={2}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[44px] flex-1 max-h-32 resize-none ring-white dark:ring-gray-600 border-none outline-none focus:ring-0 active:ring-0 focus:border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-white dark:focus-visible:ring-gray-600 focus-visible:outline-none focus-visible:border-none active:border-none active:outline-none"
            disabled={disabled}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-lg cursor-not-allowed"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={(!message.trim() && !selectedImage) || disabled}
              className="rounded-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
    </div>
  );
}
