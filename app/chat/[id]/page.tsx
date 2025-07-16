"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useChatStore } from "@/lib/stores/chat-store";
import { generateAIResponse } from "@/lib/utils/ai-responses";
import { generateDummyMessages } from "@/lib/utils/generateDummyMessages";

import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";

export default function ChatPage() {
  const { isAuthenticated, user } = useAuthStore();
  const {
    getChatroom,
    addMessage,
    setTyping,
    isTyping,
    setCurrentChatroom,
    addReaction,
    removeReaction,
    addReply,
  } = useChatStore();

  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();

  const chatroomId = params.id as string;
  const chatroom = getChatroom(chatroomId);

  const [hasMounted, setHasMounted] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ✅ Client-only message seeding
  useEffect(() => {
    if (
      hasMounted &&
      process.env.NODE_ENV === "development" &&
      chatroom &&
      chatroom.messages.length === 0
    ) {
      const dummyMessages = generateDummyMessages(100);
      dummyMessages.forEach((msg) => {
        addMessage(chatroomId, {
          content: msg.content,
          role: msg.role,
          image: msg.image,
          reactions: msg.reactions,
          replies: msg.replies,
        });
      });
    }

    if (chatroom) setCurrentChatroom(chatroomId);
  }, [hasMounted, chatroomId, chatroom]);

  useEffect(() => {
    return () => {
      setCurrentChatroom(null);
    };
  }, [params.id]);

  const handleSendMessage = async (content: string, image?: string) => {
    if (!chatroom) return;

    addMessage(chatroomId, {
      content,
      role: "user",
      image,
      reactions: [],
      replies: [],
    });

    toast({ title: "Message sent", description: "Your message has been sent." });

    setTyping(true);
    try {
      const aiResponse = await generateAIResponse(content);
      addMessage(chatroomId, {
        content: aiResponse,
        role: "assistant",
        reactions: [],
        replies: [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response.",
        variant: "destructive",
      });
    } finally {
      setTyping(false);
    }
  };

  const handleReactionAdd = (messageId: string, emoji: string) => {
    if (!chatroom || !user) return;
    addReaction(chatroomId, messageId, emoji, user.id);
  };

  const handleReactionRemove = (messageId: string, reactionId: string) => {
    if (!chatroom) return;
    removeReaction(chatroomId, messageId, reactionId);
  };

  const handleReply = async (
    parentMessageId: string,
    content: string,
    image?: string
  ) => {
    if (!chatroom) return;

    addReply(chatroomId, parentMessageId, {
      content,
      role: "user",
      image,
    });

    toast({ title: "Reply sent", description: "Reply added to the thread." });

    setTyping(true);
    try {
      const aiResponse = await generateAIResponse(content);
      addReply(chatroomId, parentMessageId, {
        content: aiResponse,
        role: "assistant",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to get AI reply.",
        variant: "destructive",
      });
    } finally {
      setTyping(false);
    }
  };

  const handleLoadMore = () => {
    if (!chatroom || isLoadingMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedMessages((prev) => prev + 20);
      setIsLoadingMore(false);
    }, 1000);
  };


  if (!hasMounted || !isAuthenticated || !chatroom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const visibleMessages = chatroom.messages.slice(-displayedMessages);
  const hasMore = chatroom.messages.length > displayedMessages;

  return (
    <div className="flex-1">
      <MessageList
        messages={visibleMessages}
        isTyping={isTyping}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
        onReactionAdd={handleReactionAdd}
        onReactionRemove={handleReactionRemove}
        onReply={handleReply}
      />

      <div className="absolute bottom-0 inset-x-0">
        <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
