import { products } from '@/lib/data';
import ProductCard from '@/components/product-card';

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Product Marketplace</h1>
        <p className="text-muted-foreground">
          Browse our curated selection of high-quality agricultural products.
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
