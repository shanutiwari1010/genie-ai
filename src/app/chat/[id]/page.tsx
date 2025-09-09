"use client";

import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useChatStore } from "@/lib/stores/chat-store";
import { generateAIResponse } from "@/lib/utils/ai-responses";
import { generateDummyMessages } from "@/lib/utils/generateDummyMessages";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";

export default function ChatPage() {
  const { user } = useAuthStore();
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

  const params = useParams<{ id: string }>();
  const chatroomId = params.id as string;
  const chatroom = getChatroom(chatroomId);

  const [displayedMessages, setDisplayedMessages] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Only seed messages once per chatroom
  const seededRef = useRef(false);

  useEffect(() => {
    if (chatroom && chatroom.messages.length === 0 && !seededRef.current) {
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
      seededRef.current = true;
    }
    if (chatroom) setCurrentChatroom(chatroomId);
  }, [chatroom, chatroomId, addMessage, setCurrentChatroom]);

  useEffect(() => {
    return () => {
      setCurrentChatroom(null);
    };
  }, [setCurrentChatroom]);

  const handleSendMessage = useCallback(
    async (content: string, image?: string) => {
      if (!chatroom) return;
      addMessage(chatroomId, {
        content,
        role: "user",
        image,
        reactions: [],
        replies: [],
      });
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
        console.error(error);
        toast.error("Error", {
          description: "Failed to get AI response.",
        });
      } finally {
        setTyping(false);
      }
    },
    [chatroom, chatroomId, addMessage, setTyping]
  );

  const handleReactionAdd = useCallback(
    (messageId: string, emoji: string) => {
      if (!chatroom || !user) return;
      addReaction(chatroomId, messageId, emoji, user.id);
    },
    [chatroom, chatroomId, addReaction, user]
  );

  const handleReactionRemove = useCallback(
    (messageId: string, reactionId: string) => {
      if (!chatroom) return;
      removeReaction(chatroomId, messageId, reactionId);
    },
    [chatroom, chatroomId, removeReaction]
  );

  const handleReply = useCallback(
    async (parentMessageId: string, content: string, image?: string) => {
      if (!chatroom) return;
      addReply(chatroomId, parentMessageId, {
        content,
        role: "user",
        image,
      });
      toast.success("Reply sent", {
        description: "Reply added to the thread.",
      });
      setTyping(true);
      try {
        const aiResponse = await generateAIResponse(content);
        addReply(chatroomId, parentMessageId, {
          content: aiResponse,
          role: "assistant",
        });
      } catch {
        toast.error("Error", {
          description: "Failed to get AI reply.",
        });
      } finally {
        setTyping(false);
      }
    },
    [chatroom, chatroomId, addReply, setTyping]
  );

  const handleLoadMore = useCallback(() => {
    if (!chatroom || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedMessages((prev) => prev + 20);
      setIsLoadingMore(false);
    }, 1000);
  }, [chatroom, isLoadingMore]);

  // Memoize visible messages and hasMore
  const visibleMessages = useMemo(
    () => (chatroom ? chatroom.messages.slice(-displayedMessages) : []),
    [chatroom, displayedMessages]
  );
  const hasMore = useMemo(
    () => (chatroom ? chatroom.messages.length > displayedMessages : false),
    [chatroom, displayedMessages]
  );

  if (!chatroom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
