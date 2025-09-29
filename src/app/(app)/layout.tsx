'use client';
import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import ChatAssistant from '@/components/chat/chat-assistant';
import { ChatProvider } from '@/hooks/use-chat';
import Link from 'next/link';

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex flex-col w-full">
            <Header />
            <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-4xl w-full">
                {children}
              </div>
            </main>
             <footer className="border-t mt-auto text-sm text-muted-foreground p-4">
                <div className="mx-auto max-w-4xl w-full text-center">
                    <p>&copy; {new Date().getFullYear()} AgriAssist. All rights reserved. | <Link href="/help" className="hover:text-primary">Help & Support</Link></p>
                </div>
            </footer>
          </div>
        </div>
        <ChatAssistant />
      </SidebarProvider>
    </ChatProvider>
  );
}
