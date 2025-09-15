import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ChatAssistant from '@/components/chat/chat-assistant';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
        <ChatAssistant />
      </div>
    </SidebarProvider>
  );
}
