'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import ChatAssistant from '@/components/chat/chat-assistant';
import {useAuth} from '@/hooks/use-auth';
import {Loader2} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppLayout({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <div className="fixed inset-0 bg-background-image opacity-10" />
        <div className="parallax-container">
          <AppSidebar />
          <SidebarInset>
            <div className="parallax-content">
              <Header />
              <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </div>
          </SidebarInset>
          <ChatAssistant />
        </div>
      </div>
    </SidebarProvider>
  );
}
