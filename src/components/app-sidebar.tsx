"use client";

import Link from "next/link";
import { Search, Sparkles, SquarePen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavChat } from "./nav-chat";
import { Input } from "./ui/input";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

// const data = {
//   user: {
//     name: ``,
//     email: "emily@example.com",
//     avatar: "/emily.avif",
//   },
// };

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isMobile, setOpenMobile } = useSidebar();

  const { user } = useUser();

  const handleNewChatClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarContent className="p-1">
        <SidebarHeader>
          <SidebarMenu className="pt-1">
            <SidebarMenuItem className="hover">
              <SidebarMenuButton className="w-fit px-1.5 ">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded-md w-8 h-8 bg-gradient-to-br from-teal-500 to-gray-600">
                  <Sparkles className="size-4 text-white" />
                </div>
                <div>
                  <h1 className="truncate font-medium">GenieAI</h1>
                  <p className="text-xs text-muted-foreground">
                    Always ready to help
                  </p>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu className="mt-2">
            <SidebarMenuButton asChild>
              <Link href="/chat" onClick={handleNewChatClick}>
                <SquarePen />
                New chat
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
              <div>
                <Search />
                <Input
                  placeholder="Search chats"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-0 border-none  outline-none ring-white focus:ring-0 focus-within:ring-0 focus:border-none focus:outline-none focus-within:ring-white dark:bg-transparent"
                  style={{ boxShadow: "none" }}
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarHeader>
        <NavChat searchTerm={searchTerm} />
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: user.fullName || user.firstName || "User",
              email: user.primaryEmailAddress?.emailAddress || "",
              avatar: user.imageUrl || "",
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}