'use client';
import { products } from '@/lib/data';
import ProductCard from '@/components/product-card';
import { useLanguage } from '@/hooks/use-language';

export default function ProductsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('products.page_title')}</h1>
        <p className="text-muted-foreground">
          {t('products.page_subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
