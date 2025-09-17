'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Languages, ShoppingCart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

function getTitleKey(path: string): string {
  if (path.includes('/products/')) {
    return 'sidebar.products';
  }
  const pathName = path.split('/').pop() || 'dashboard';
   if (pathName === '') return 'sidebar.dashboard';
  return `sidebar.${pathName}`;
}

export default function Header() {
  const pathname = usePathname();
  const { t, setLanguage } = useLanguage();
  const titleKey = getTitleKey(pathname);
  const title = t(titleKey);
  const { cartCount, isCartLoaded } = useCart();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg sm:text-xl font-semibold truncate">{title}</h1>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {isCartLoaded && cartCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cartCount}
                    </span>
                )}
                <span className="sr-only">{t('sidebar.cart')}</span>
            </Link>
        </Button>
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
