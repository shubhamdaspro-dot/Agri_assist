'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Languages } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';

function getTitleKey(path: string): string {
  const pathName = path.split('/').pop() || 'dashboard';
  return `sidebar.${pathName}`;
}

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { t, setLanguage } = useLanguage();
  const titleKey = getTitleKey(pathname);
  const title = t(titleKey);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
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
            <DropdownMenuItem onClick={() => setLanguage('ta')}>{t('header.tamil')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('te')}>{t('header.telugu')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('mr')}>{t('header.marathi')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button asChild variant="ghost" size="icon">
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
            <span className="sr-only">{t('header.shopping_cart')}</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
