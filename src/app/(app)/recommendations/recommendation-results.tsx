'use client';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, Share2, MessageSquare, Smartphone } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

type RecommendationResultsProps = {
  results: GenerateCropRecommendationsOutput;
};

export function RecommendationResults({ results }: RecommendationResultsProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
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

  const shareMessage = t('recommendations.share_message', {
    crop: results.recommendedCrop,
    products: results.recommendedProducts,
    rationale: results.rationale
  });

  const handleShare = (platform: 'sms' | 'whatsapp') => {
    const encodedMessage = encodeURIComponent(shareMessage);
    let url = '';
    if (platform === 'sms') {
      // Note: This works best on mobile devices
      url = `sms:?body=${encodedMessage}`;
    } else {
      url = `https://wa.me/?text=${encodedMessage}`;
    }
    window.open(url, '_blank');
    toast({
        title: t('recommendations.toast_sharing_title'),
        description: t('recommendations.toast_sharing_description', { platform: platform.toUpperCase() })
    });
  }

  return (
    <Card className="mt-8 bg-secondary/50">
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-8 w-8 text-accent" />
              {t('recommendations.results_title')}
            </CardTitle>
            <CardDescription>{t('recommendations.results_subtitle')}</CardDescription>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => handleShare('sms')}>
                <Smartphone className="h-5 w-5" />
                <span className="sr-only">Share via SMS</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                 <span className="sr-only">Share via WhatsApp</span>
            </Button>
        </div>
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
