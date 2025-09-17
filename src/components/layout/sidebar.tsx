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
  Newspaper,
  Landmark,
  Github,
  CircleHelp,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
  { href: '/recommendations', icon: Leaf, labelKey: 'sidebar.recommendations' },
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
        <path d="M11 20A7 7 0 0 1 7 6a7 7 0 0 1 4-2 7 7 0 0 1 4 2 7 7 0 0 1-4 14Z" />
        <path d="M11 20V14" />
        <path d="m11 4 3 4" />
        <path d="m8 8 3-4" />
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
              <SidebarMenuButton asChild tooltip={t('sidebar.github')}>
                <Link href="https://github.com/firebase/firebase-genkit-samples/tree/main/nextjs-rag-app" target="_blank">
                  <Github />
                  <span>{t('sidebar.github')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
