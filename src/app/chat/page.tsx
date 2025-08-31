"use client";

import React, {  useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatGreeting from "@/components/chat/chat-greeting";
import { useChatroomActions } from "@/hooks/useChatroomActions";

export default function ChatPage() {
  const router = useRouter();

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
