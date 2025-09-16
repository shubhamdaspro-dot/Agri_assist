'use client';
import CartContents from "./cart-contents";
import { useLanguage } from "@/hooks/use-language";

export default function CartPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('cart.page_title')}</h1>
        <p className="text-muted-foreground">{t('cart.page_subtitle')}</p>
      </div>
      <CartContents />
    </div>
  );
}
