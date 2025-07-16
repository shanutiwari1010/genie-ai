import React from "react";
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";

const RootChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedLayout>
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
    </ProtectedLayout>
  );
};

export default RootChatLayout;
