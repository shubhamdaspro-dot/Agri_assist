'use client';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, MessageSquare, Smartphone, RefreshCw } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { products } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

type RecommendationResultsProps = {
  results: GenerateCropRecommendationsOutput;
  onNewRecommendation: () => void;
};

export function RecommendationResults({ results, onNewRecommendation }: RecommendationResultsProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);

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
        imageHint: 'product box',
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
    if (!phoneNumber) {
        toast({
            variant: 'destructive',
            title: t('recommendations.toast_phone_missing_title'),
            description: t('recommendations.toast_phone_missing_description'),
        });
        return;
    }

    const encodedMessage = encodeURIComponent(shareMessage);
    let url = '';
    if (platform === 'sms') {
      // Note: This works best on mobile devices
      url = `sms:${phoneNumber}?body=${encodedMessage}`;
    } else {
      // The phone number needs to be in international format without '+' or '00'
      const whatsappNumber = phoneNumber.startsWith('+') ? phoneNumber.substring(1) : phoneNumber;
      url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }
    window.open(url, '_blank');
    setIsSent(true);
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
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-lg">{t('recommendations.share_title')}</h3>
           <p className="text-sm text-muted-foreground">{t('recommendations.share_subtitle')}</p>
          <div className="flex gap-2">
            <Input 
              type="tel"
              placeholder={t('auth.phone_label')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="max-w-xs"
              disabled={isSent}
            />
            <Button variant="outline" size="icon" onClick={() => handleShare('sms')} title={t('recommendations.share_sms_title')} disabled={isSent}>
                <Smartphone className="h-5 w-5" />
                <span className="sr-only">Share via SMS</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} title={t('recommendations.share_whatsapp_title')} disabled={isSent}>
                 <MessageSquare className="h-5 w-5" />
                 <span className="sr-only">Share via WhatsApp</span>
            </Button>
          </div>
        </div>
      </CardContent>
      {isSent && (
        <CardFooter>
            <Button onClick={onNewRecommendation} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('recommendations.new_recommendation_button')}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}

