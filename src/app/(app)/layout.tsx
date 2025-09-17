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
        <div className="min-h-screen">
          <div className="parallax-container">
            <div className="parallax-background" />
            <AppSidebar />
            <SidebarInset>
              <div className="parallax-content">
                <Header />
                <div className="p-4 sm:p-6">{children}</div>
              </div>
            </SidebarInset>
            <ChatAssistant />
          </div>
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
