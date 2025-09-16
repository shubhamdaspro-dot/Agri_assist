'use client';
import CartContents from "./cart-contents";
import { useLanguage } from "@/hooks/use-language";
import { useIsClient } from "@/hooks/use-is-client";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { t } = useLanguage();
  const isClient = useIsClient();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('cart.page_title')}</h1>
        <p className="text-muted-foreground">{t('cart.page_subtitle')}</p>
      </div>
      {isClient ? <CartContents /> : <CartLoadingSkeleton />}
    </div>
  );
}

function CartLoadingSkeleton() {
  return (
    <div className="text-center py-20">
      <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
      <h2 className="mt-4 text-2xl font-semibold"><Skeleton className="h-8 w-48 mx-auto" /></h2>
      <p className="mt-2 text-muted-foreground"><Skeleton className="h-5 w-64 mx-auto" /></p>
      <Skeleton className="h-11 w-40 mx-auto mt-6" />
    </div>
  )
}