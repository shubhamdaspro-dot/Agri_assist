'use client';
import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import ChatAssistant from '@/components/chat/chat-assistant';
import { ChatProvider } from '@/hooks/use-chat';

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col relative bg-background">
          <div className="absolute inset-0 -z-10 h-full w-full animate-gradient-bg bg-[length:400%_400%] bg-gradient-to-br from-background via-secondary/50 to-background"></div>
          <div className="absolute inset-0 -z-10 bg-black/30"></div>
          <AppSidebar />
          <SidebarInset>
              <div className="flex flex-col min-h-full">
                <Header />
                <div className="p-4 sm:p-6 flex-grow">{children}</div>
              </div>
          </SidebarInset>
          <ChatAssistant />
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
