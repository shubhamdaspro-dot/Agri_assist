'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';

function getTitleKey(path: string): string {
  if (path.includes('/products/')) {
    return 'sidebar.products';
  }
  const pathName = path.split('/').pop() || 'dashboard';
   if (pathName === 'app') return 'sidebar.dashboard';
  return `sidebar.${pathName}`;
}

export default function Header() {
  const pathname = usePathname();
  const { t, setLanguage } = useLanguage();
  const titleKey = getTitleKey(pathname);
  const title = t(titleKey);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger />
      <h1 className="text-lg sm:text-xl font-semibold truncate">{title}</h1>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
              <span className="sr-only">{t('header.change_language')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')}>{t('header.english')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('hi')}>{t('header.hindi')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('bn')}>{t('header.bengali')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('te')}>{t('header.telugu')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('mr')}>{t('header.marathi')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ta')}>{t('header.tamil')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
