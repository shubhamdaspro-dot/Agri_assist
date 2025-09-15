'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

function getTitleFromPath(path: string): string {
  const pathName = path.split('/').pop() || 'dashboard';
  if (pathName === 'recommendations') return 'AI Recommendations';
  return pathName.charAt(0).toUpperCase() + pathName.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const title = getTitleFromPath(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="ml-auto">
        <Button asChild variant="ghost" size="icon">
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Shopping Cart</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
