'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Leaf,
  ShoppingCart,
  Newspaper,
  Landmark,
  Github,
  CircleHelp,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
  { href: '/recommendations', icon: Leaf, labelKey: 'sidebar.recommendations' },
  { href: '/products', icon: ShoppingCart, labelKey: 'sidebar.products' },
  { href: '/news', icon: Newspaper, labelKey: 'sidebar.news' },
  { href: '/loans', icon: Landmark, labelKey: 'sidebar.loans' },
];

function AgriAssistLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2">
       <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <h1 className="text-2xl font-bold text-primary transition-opacity group-data-[collapsible=icon]:opacity-0">
        AgriAssist
      </h1>
    </Link>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  return (
    <Sidebar>
      <SidebarHeader>
        <AgriAssistLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={t(item.labelKey)}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('sidebar.help')}>
                <Link href="#">
                  <CircleHelp />
                  <span>{t('sidebar.help')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="GitHub">
                <Link href="https://github.com/firebase/firebase-genkit-samples/tree/main/nextjs-rag-app" target="_blank">
                  <Github />
                  <span>GitHub</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => {
                  signOut();
                  // A bit of a hack to get the toast to use the right language on sign out
                  setTimeout(() => {
                    const lang = localStorage.getItem('agriassist_language') || 'en';
                    const signOutText = lang === 'en' ? 'Sign Out' : 'साइन आउट';
                    const signedOutText = lang === 'en' ? 'You have been successfully signed out.' : 'आप सफलतापूर्वक साइन आउट हो गए हैं।';
                    
                  }, 100);
              }} tooltip={t('sidebar.sign_out')}>
                <LogOut />
                <span>{t('sidebar.sign_out')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
