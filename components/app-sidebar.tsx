"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { useChatStore } from "@/lib/stores/chat-store";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ChatroomList } from "./dashboard/chatroom-list";
import { Sparkles } from "lucide-react";
import { Separator } from "./ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { toast } = useToast();
  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { chatrooms, createChatroom, deleteChatroom } = useChatStore();

  const handleChatroomSelect = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const handleCreateChatroom = () => {
    if (!newChatroomTitle.trim()) return;

    setIsCreating(true);
    setTimeout(() => {
      const id = createChatroom(newChatroomTitle.trim());
      setNewChatroomTitle("");
      setIsCreating(false);

      toast({
        title: "Chatroom Created",
        description: `"${newChatroomTitle}" has been created successfully.`,
      });

      handleChatroomSelect(id);
    }, 500);
  };

  return (
    <Sidebar {...props}>
      <SidebarContent className="py-3">
        <SidebarHeader>
          <div>
            <div className="flex items-center space-x-3 mb-[7px] px-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-gray-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-500">Always ready to help</p>
              </div>
            </div>
            <Separator />
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">Your Chatrooms</h2>
              <p className="text-muted-foreground text-xs border-b pb-4">
                Manage your conversations with Gemini AI
              </p>
            </div>
          </div>
        </SidebarHeader>
        <ChatroomList onChatroomSelect={handleChatroomSelect} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
