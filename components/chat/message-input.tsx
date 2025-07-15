"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Send, ImageIcon, X } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (content: string, image?: string) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ onSendMessage, disabled, placeholder = "Type your message..." }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && !selectedImage) return

    onSendMessage(message.trim() || "Image", selectedImage || undefined)
    setMessage("")
    setSelectedImage(null)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t bg-background p-4">
      {selectedImage && (
        <div className="mb-3 relative inline-block">
          <img src={selectedImage || "/placeholder.svg"} alt="Selected" className="max-h-20 rounded-md" />
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
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[44px] max-h-32 resize-none pr-12"
            disabled={disabled}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-2 top-2 h-8 w-8 p-0"
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        <Button type="submit" disabled={(!message.trim() && !selectedImage) || disabled} className="h-11">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
    </div>
  )
}
