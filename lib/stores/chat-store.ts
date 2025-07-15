import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Reaction {
  id: string
  emoji: string
  userId: string
  timestamp: Date
}

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  image?: string
  reactions: Reaction[]
  threadId?: string // ID of the message this is replying to
  replies: Message[] // Nested replies to this message
}

export interface Chatroom {
  id: string
  title: string
  createdAt: Date
  messages: Message[]
}

interface ChatState {
  chatrooms: Chatroom[]
  currentChatroom: string | null
  isTyping: boolean
  createChatroom: (title: string) => string
  deleteChatroom: (id: string) => void
  setCurrentChatroom: (id: string | null) => void
  addMessage: (chatroomId: string, message: Omit<Message, "id" | "timestamp">) => void
  setTyping: (typing: boolean) => void
  getChatroom: (id: string) => Chatroom | undefined
  addReaction: (chatroomId: string, messageId: string, emoji: string, userId: string) => void
  removeReaction: (chatroomId: string, messageId: string, reactionId: string) => void
  addReply: (
    chatroomId: string,
    parentMessageId: string,
    reply: Omit<Message, "id" | "timestamp" | "reactions" | "replies">,
  ) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      isTyping: false,

      createChatroom: (title) => {
        const id = `chatroom-${Date.now()}`
        const newChatroom: Chatroom = {
          id,
          title,
          createdAt: new Date(),
          messages: [],
        }
        set((state) => ({
          chatrooms: [...state.chatrooms, newChatroom],
        }))
        return id
      },

      deleteChatroom: (id) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          currentChatroom: state.currentChatroom === id ? null : state.currentChatroom,
        }))
      },

      setCurrentChatroom: (id) => {
        set({ currentChatroom: id })
      },

      addMessage: (chatroomId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          reactions: [],
          replies: [],
        }

        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId ? { ...room, messages: [...room.messages, newMessage] } : room,
          ),
        }))
      },

      setTyping: (typing) => {
        set({ isTyping: typing })
      },

      getChatroom: (id) => {
        return get().chatrooms.find((room) => room.id === id)
      },

      addReaction: (chatroomId, messageId, emoji, userId) => {
        const reaction: Reaction = {
          id: `reaction-${Date.now()}-${Math.random()}`,
          emoji,
          userId,
          timestamp: new Date(),
        }

        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: updateMessageReactions(room.messages, messageId, reaction, "add"),
                }
              : room,
          ),
        }))
      },

      removeReaction: (chatroomId, messageId, reactionId) => {
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: updateMessageReactions(room.messages, messageId, { id: reactionId } as Reaction, "remove"),
                }
              : room,
          ),
        }))
      },

      addReply: (chatroomId, parentMessageId, reply) => {
        const newReply: Message = {
          ...reply,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          reactions: [],
          replies: [],
          threadId: parentMessageId,
        }

        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: addReplyToMessage(room.messages, parentMessageId, newReply),
                }
              : room,
          ),
        }))
      },
    }),
    {
      name: "chat-storage",
    },
  ),
)

function updateMessageReactions(
  messages: Message[],
  messageId: string,
  reaction: Reaction,
  action: "add" | "remove",
): Message[] {
  return messages.map((message) => {
    if (message.id === messageId) {
      if (action === "add") {
        // Remove existing reaction from same user with same emoji
        const filteredReactions = message.reactions.filter(
          (r) => !(r.userId === reaction.userId && r.emoji === reaction.emoji),
        )
        return {
          ...message,
          reactions: [...filteredReactions, reaction],
        }
      } else {
        return {
          ...message,
          reactions: message.reactions.filter((r) => r.id !== reaction.id),
        }
      }
    }

    // Also check replies
    if (message.replies.length > 0) {
      return {
        ...message,
        replies: updateMessageReactions(message.replies, messageId, reaction, action),
      }
    }

    return message
  })
}

function addReplyToMessage(messages: Message[], parentMessageId: string, reply: Message): Message[] {
  return messages.map((message) => {
    if (message.id === parentMessageId) {
      return {
        ...message,
        replies: [...message.replies, reply],
      }
    }

    // Also check nested replies
    if (message.replies.length > 0) {
      return {
        ...message,
        replies: addReplyToMessage(message.replies, parentMessageId, reply),
      }
    }

    return message
  })
}
