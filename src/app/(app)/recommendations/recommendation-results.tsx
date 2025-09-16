'use client';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';

type RecommendationResultsProps = {
  results: GenerateCropRecommendationsOutput;
};

export function RecommendationResults({ results }: RecommendationResultsProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const recommendedProductsList = results.recommendedProducts.split(',').map(p => p.trim());

  const handleAddToCart = (productName: string) => {
    // This is a simple simulation. In a real app, you'd match productName to an actual product ID.
    const productToAdd = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase().split(" ")[1]));
    if (productToAdd) {
      addToCart(productToAdd);
    } else {
      // If not found, add a mock product
      addToCart({
        id: `custom_${productName.replace(/\s+/g, '_')}`,
        name: productName,
        price: 1499.00, // Default price in INR
        description: t('recommendations.ai_recommended_product'),
        image: 'https://picsum.photos/seed/mock/400/300',
        category: 'Fertilizers'
      });
    }
  };

  return (
    <Card className="mt-8 bg-secondary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CheckCircle className="h-8 w-8 text-accent" />
          {t('recommendations.results_title')}
        </CardTitle>
        <CardDescription>{t('recommendations.results_subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg">{t('recommendations.results_crop')}:</h3>
          <p className="text-2xl font-bold text-primary">{results.recommendedCrop}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{t('recommendations.results_rationale')}:</h3>
          <p className="text-muted-foreground">{results.rationale}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{t('recommendations.results_products')}:</h3>
          <ul className="space-y-2 mt-2">
            {recommendedProductsList.map((product, index) => (
              <li key={index} className="flex items-center justify-between p-2 rounded-md bg-background">
                <span>{product}</span>
                <Button size="sm" variant="outline" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t('cart.add_to_cart_button')}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
