"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { useDebounce } from "@/hooks/use-debounce";
import { useChatroomActions } from "@/hooks/useChatroomActions";
import { useChatStore } from "@/lib/stores/chat-store";
import { formatDistanceToNow } from "date-fns";
import { Search, Trash2, MessageCircle, SquarePen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ChatHistory = () => {
  const router = useRouter();
  const { chatrooms } = useChatStore();
  const { handleDeleteChatroom } = useChatroomActions();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleDeleteChat = (id: string, title: string, e: React.MouseEvent) => {
    handleDeleteChatroom(id, title, e);
    router.push(`/chat`);
  };

  const handleChatRouting = (id: string) => {
    router.push(`/chat/${id}`);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  return (
    <div className="m-4 md:px-0 flex flex-col gap-8 flex-wrap">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-5xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold">
            Chat History
          </h1>
          <p className="text-muted-foreground">
            Access and review your past conversations
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search chatrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {loading && <Loading />}

      <div className="space-y-2 flex flex-col overflow-auto h-[calc(100vh_-13rem)]">
        {!loading && filteredChatrooms.length === 0 ? (
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <img
              src="/timer.gif"
              alt="No conversations"
              className="w-[100px] h-[100px] rounded-2xl overflow-hidden"
            />
            <h3 className="text-lg font-normal mt-4">You're All Caught Up</h3>
            <p className="text-muted-foreground mt-2">
              Feel free to explore the platform or check back later for fresh
              conversations. Stay Tuned!
            </p>
          </div>
        ) : (
          !loading &&
          filteredChatrooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleChatRouting(room.id)}
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
                    onClick={(e) => {
                      handleDeleteChat(room.id, room.title, e);
                    }}
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
};

export default ChatHistory;
