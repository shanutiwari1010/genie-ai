"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Search, Trash2, MessageCircle } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { useChatStore } from "@/lib/stores/chat-store";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ChatroomListProps {
  onChatroomSelect: (id: string) => void;
}

export function ChatroomList({ onChatroomSelect }: ChatroomListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { chatrooms, createChatroom, deleteChatroom } = useChatStore();
  const { toast } = useToast();

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleDeleteChatroom = (
    id: string,
    title: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    deleteChatroom(id);

    toast({
      title: "Chatroom Deleted",
      description: `"${title}" has been deleted.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4 px-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search chatrooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Chatroom List */}
      <div className="space-y-2">
        {filteredChatrooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No chatrooms found" : "No chatrooms yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm
                  ? "Try a different search term"
                  : "Create your first chatroom to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredChatrooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onChatroomSelect(room.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{room.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {room.messages.length} messages
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(room.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) =>
                      handleDeleteChatroom(room.id, room.title, e)
                    }
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
