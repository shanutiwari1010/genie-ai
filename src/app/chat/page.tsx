"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatGreeting from "@/components/chat/chat-greeting";
import { useChatroomActions } from "@/hooks/useChatroomActions";
import ChatBar from "@/components/chat/chat-bar";

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newChatroomTitle, setNewChatroomTitle] = useState("");

  const handleChatroomSelect = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const { handleCreateChatroom } = useChatroomActions();

  const handleCreate = () => {
    if (!newChatroomTitle.trim()) return;

    setIsCreating(true);
    setTimeout(() => {
      handleCreateChatroom(newChatroomTitle.trim(), (id) => {
        setNewChatroomTitle("");
        setIsCreating(false);
        handleChatroomSelect(id);
      });
    }, 500);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center gap-10 justify-center flex-col w-full">
      <ChatGreeting />
      <Card className="shadow-2xl rounded-3xl w-3/4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Create New Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Enter chatroom title..."
            value={newChatroomTitle}
            onChange={(e) => setNewChatroomTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button
            onClick={handleCreate}
            disabled={!newChatroomTitle.trim() || isCreating}
            className="w-full "
          >
            {isCreating ? "Creating..." : "Create Chatroom"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
