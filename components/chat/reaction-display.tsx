"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Reaction } from "@/lib/stores/chat-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { formatDistanceToNow } from "date-fns"

interface ReactionDisplayProps {
  reactions: Reaction[]
  onReactionClick: (emoji: string) => void
  onReactionRemove: (reactionId: string) => void
}

export function ReactionDisplay({ reactions, onReactionClick, onReactionRemove }: ReactionDisplayProps) {
  const { user } = useAuthStore()

  // Group reactions by emoji
  const groupedReactions = reactions.reduce(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction)
      return acc
    },
    {} as Record<string, Reaction[]>,
  )

  if (Object.keys(groupedReactions).length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {Object.entries(groupedReactions).map(([emoji, emojiReactions]) => {
        const userReaction = emojiReactions.find((r) => r.userId === user?.id)
        const count = emojiReactions.length

        return (
          <TooltipProvider key={emoji}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={userReaction ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (userReaction) {
                      onReactionRemove(userReaction.id)
                    } else {
                      onReactionClick(emoji)
                    }
                  }}
                  className="h-7 px-2 text-xs gap-1"
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-48">
                  {emojiReactions.map((reaction, index) => (
                    <div key={reaction.id} className="text-xs">
                      {reaction.userId === user?.id ? "You" : `User ${reaction.userId.slice(-4)}`}
                      {index < emojiReactions.length - 1 && ", "}
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(emojiReactions[0].timestamp, { addSuffix: true })}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      })}
    </div>
  )
}
