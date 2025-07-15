"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Header } from "@/components/layout/header"
import { ChatroomList } from "@/components/dashboard/chatroom-list"

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  const handleChatroomSelect = (id: string) => {
    router.push(`/chat/${id}`)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={`Welcome, ${user?.name || "User"}`} />

      <main className="container mx-auto p-4 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Your Chatrooms</h2>
          <p className="text-muted-foreground">Manage your conversations with Gemini AI</p>
        </div>

        <ChatroomList onChatroomSelect={handleChatroomSelect} />
      </main>
    </div>
  )
}
