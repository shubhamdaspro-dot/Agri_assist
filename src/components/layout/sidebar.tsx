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
  MessageCircle,
  ShieldAlert,
  TestTube,
  BarChart2,
  Flower2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { useChat } from '@/hooks/use-chat';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
  { href: '/recommendations', icon: Leaf, labelKey: 'sidebar.recommendations' },
  { href: '/soil-analysis', icon: TestTube, labelKey: 'sidebar.soil_analysis' },
  { href: '/disease-prevention', icon: ShieldAlert, labelKey: 'sidebar.disease_prevention' },
  { href: '/market-analysis', icon: BarChart2, labelKey: 'sidebar.market_analysis' },
  { href: '/news', icon: Newspaper, labelKey: 'sidebar.news' },
  { href: '/loans', icon: Landmark, labelKey: 'sidebar.loans' },
];

function AgriAssistLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 px-2">
      <div className="p-1 bg-white/20 rounded-lg flex items-center justify-center w-10 h-10">
        <Flower2 className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white transition-opacity group-data-[collapsible=icon]:opacity-0">
          AgriAssist
        </h1>
      </div>
    </Link>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { setIsOpen } = useChat();

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
                variant="outline"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsOpen(true)} tooltip={t('sidebar.ai_assistant')} variant="outline">
                    <MessageCircle />
                    <span>{t('sidebar.ai_assistant')}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('sidebar.help')} variant="outline" isActive={pathname === '/help'}>
                <Link href="/help">
                  <CircleHelp />
                  <span>{t('sidebar.help')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={t('sidebar.github')} variant="outline">
                <Link href="https://github.com/shubhamdaspro-dot/Agri_assist" target="_blank">
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
