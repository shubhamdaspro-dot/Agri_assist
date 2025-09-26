'use client';
import AppSidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar';
import ChatAssistant from '@/components/chat/chat-assistant';
import { ChatProvider } from '@/hooks/use-chat';
import { Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

function AppFooter() {
  return (
    <footer className="bg-transparent mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">AgriAssist</h3>
            <p className="text-sm text-muted-foreground">AI-powered assistance for modern farming.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="https://github.com/Firebase-Studio-Apps/Agri_assist" target="_blank" className="text-muted-foreground hover:text-primary">
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AgriAssist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}


export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <ChatProvider>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col">
          <AppSidebar />
          <SidebarInset>
              <div className="flex flex-col min-h-full">
                <Header />
                <div className="p-4 sm:p-6 flex-grow">{children}</div>
                <AppFooter />
              </div>
          </SidebarInset>
          <ChatAssistant />
        </div>
      </SidebarProvider>
    </ChatProvider>
  );
}
