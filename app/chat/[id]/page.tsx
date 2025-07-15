"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useChatStore } from "@/lib/stores/chat-store"
import { Header } from "@/components/layout/header"
import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { generateAIResponse } from "@/lib/utils/ai-responses"
import { useToast } from "@/hooks/use-toast"

export default function ChatPage() {
  const { isAuthenticated, user } = useAuthStore()
  const { getChatroom, addMessage, setTyping, isTyping, setCurrentChatroom, addReaction, removeReaction, addReply } =
    useChatStore()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const chatroomId = params.id as string
  const chatroom = getChatroom(chatroomId)

  const [displayedMessages, setDisplayedMessages] = useState(20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    if (!chatroom) {
      router.push("/dashboard")
      return
    }

    setCurrentChatroom(chatroomId)
  }, [isAuthenticated, chatroom, chatroomId, router, setCurrentChatroom])

  const handleSendMessage = async (content: string, image?: string) => {
    if (!chatroom) return

    // Add user message
    addMessage(chatroomId, {
      content,
      role: "user",
      image,
    })

    toast({
      title: "Message sent",
      description: "Your message has been sent to Gemini.",
    })

    // Simulate AI response
    setTyping(true)

    try {
      const aiResponse = await generateAIResponse(content)

      addMessage(chatroomId, {
        content: aiResponse,
        role: "assistant",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTyping(false)
    }
  }

  const handleReactionAdd = (messageId: string, emoji: string) => {
    if (!chatroom || !user) return

    addReaction(chatroomId, messageId, emoji, user.id)

    toast({
      title: "Reaction added",
      description: `You reacted with ${emoji}`,
    })
  }

  const handleReactionRemove = (messageId: string, reactionId: string) => {
    if (!chatroom) return

    removeReaction(chatroomId, messageId, reactionId)
  }

  const handleReply = async (parentMessageId: string, content: string, image?: string) => {
    if (!chatroom) return

    // Add user reply
    addReply(chatroomId, parentMessageId, {
      content,
      role: "user",
      image,
    })

    toast({
      title: "Reply sent",
      description: "Your reply has been added to the thread.",
    })

    // Simulate AI response to the thread
    setTyping(true)

    try {
      const aiResponse = await generateAIResponse(content)

      addReply(chatroomId, parentMessageId, {
        content: aiResponse,
        role: "assistant",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTyping(false)
    }
  }

  const handleLoadMore = () => {
    if (!chatroom || isLoadingMore) return

    setIsLoadingMore(true)

    // Simulate loading delay
    setTimeout(() => {
      setDisplayedMessages((prev) => prev + 20)
      setIsLoadingMore(false)
    }, 1000)
  }

  const handleBack = () => {
    setCurrentChatroom(null)
    router.push("/dashboard")
  }

  if (!isAuthenticated || !chatroom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const visibleMessages = chatroom.messages.slice(-displayedMessages)
  const hasMore = chatroom.messages.length > displayedMessages

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title={chatroom.title} showBack onBack={handleBack} />

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

      <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}
