import React from "react";
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const RootChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background relative flex">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="relative h-[calc(100vh_-64px)] overflow-hidden">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default RootChatLayout;
