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
        <div className="relative min-h-screen w-full">
            <div className="absolute inset-0 -z-10 h-full w-full animate-gradient-bg bg-[length:400%_400%] bg-gradient-to-br from-background via-secondary/50 to-background"></div>
            <div className="absolute inset-0 -z-10 bg-black/30"></div>
            <div className="flex min-h-screen">
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col min-h-full">
                        <Header />
                        <main className="p-4 sm:p-6 flex-grow">{children}</main>
                        <footer className="border-t border-border/50 text-foreground/60 mt-auto">
                            <div className="container mx-auto py-6 px-4 sm:px-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-semibold text-foreground/80 mb-2">AgriAssist</h4>
                                        <ul className="space-y-1">
                                            <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                                            <li><Link href="/recommendations" className="hover:text-foreground">Crop Advice</Link></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground/80 mb-2">Resources</h4>
                                        <ul className="space-y-1">
                                            <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                                            <li><Link href="/news" className="hover:text-foreground">News</Link></li>
                                            <li><Link href="/loans" className="hover:text-foreground">Loan Schemes</Link></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground/80 mb-2">Legal</h4>
                                        <ul className="space-y-1">
                                            <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                                            <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-border/50 text-center text-xs">
                                    <p>&copy; {new Date().getFullYear()} AgriAssist. All rights reserved.</p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </SidebarInset>
            </div>
            <ChatAssistant />
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
