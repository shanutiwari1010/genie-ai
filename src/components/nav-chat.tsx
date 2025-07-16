"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/lib/stores/chat-store";
import { useChatroomActions } from "@/hooks/useChatroomActions";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent } from "./ui/card";

export function NavChat({ searchTerm }: { searchTerm: string }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { chatrooms } = useChatStore();
  const { handleDeleteChatroom } = useChatroomActions();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleDeleteChat = (id: string, title: string, e: React.MouseEvent) => {
    handleDeleteChatroom(id, title, e);
    router.push(`/chat`);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      {filteredChatrooms.length === 0 && (
        <Card className="ml-1">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-md">
              {searchTerm ? "No Chatrooms found" : "No chatrooms yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchTerm
                ? "Try a different search term"
                : "Create your first chatroom to get started"}
            </p>
          </CardContent>
        </Card>
      )}
      <SidebarMenu className="max-h-[calc(100vh_-17rem)] overflow-hidden overflow-y-auto">
        {filteredChatrooms.map((item) => (
          <SidebarMenuItem key={item?.id}>
            <SidebarMenuButton asChild>
              <Link href={`/chat/${item.id}`}>
                <span className="truncate">{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    handleDeleteChat(item?.id, item.title, e);
                  }}
                >
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
