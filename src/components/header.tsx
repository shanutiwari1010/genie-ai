"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import { Moon, Sun, LogOut, Bell, History } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { useChatStore } from "@/lib/stores/chat-store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const params = useParams<{ id: string }>();

  const { logout, user } = useAuthStore();
  const { getChatroom } = useChatStore();
  const chatroom = getChatroom(params.id);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("chat-storage");
    router.replace("/auth");
    router.refresh();
  };

  const handleRoutetoHistory = () => {
    router.push("/chat/history");
  };

  const handleRoutetoNotifications = () => {
    router.push("/chat/notifications");
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/chat">Chat</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="max-w-72">
              <BreadcrumbPage className="truncate">
                {chatroom?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex ml-auto h-14 items-center px-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="justify-start"
          onClick={handleRoutetoHistory}
        >
          <History />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="justify-start"
          onClick={handleRoutetoNotifications}
        >
          <Bell />
        </Button>
        {user && (
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
            <LogOut className="h-2 w-2" />
          </Button>
        )}
      </div>
    </header>
  );
}
