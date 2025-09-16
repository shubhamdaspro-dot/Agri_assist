'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
            <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover" 
                data-ai-hint={`${product.category} product`}
            />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="text-primary font-bold text-lg mt-1">
            ₹{product.price.toFixed(2)}
        </CardDescription>
        <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => addToCart(product)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
