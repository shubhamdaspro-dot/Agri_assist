'use client';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Smartphone, RefreshCw, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type RecommendationResultsProps = {
  results: GenerateCropRecommendationsOutput;
  onNewRecommendation: () => void;
};

export function RecommendationResults({ results, onNewRecommendation }: RecommendationResultsProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);

  const recommendedProductsList = results.recommendedProducts.split(',').map(p => p.trim());

  const shareMessage = t('recommendations.share_message', {
    crop: results.recommendedCrop,
    products: results.recommendedProducts,
    rationale: results.rationale
  });

  const handleShare = () => {
    if (!phoneNumber) {
        toast({
            variant: 'destructive',
            title: t('recommendations.toast_phone_missing_title'),
            description: t('recommendations.toast_phone_missing_description'),
        });
        return;
    }

    const encodedMessage = encodeURIComponent(shareMessage);
    let url = `sms:${phoneNumber}?body=${encodedMessage}`;
    
    window.open(url, '_blank');
    setIsSent(true);
    toast({
        title: t('recommendations.toast_sharing_title'),
        description: t('recommendations.toast_sharing_description', { platform: 'SMS' })
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
              </li>
            ))}
          </ul>
        </div>
         <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('recommendations.results_stores')}:
          </h3>
          <ul className="space-y-2 mt-2">
             {results.nearestStores.map((store, index) => (
              <li key={index} className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-muted/50 transition-colors">
                <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-muted-foreground">{store.address}</p>
                </div>
                <Button asChild variant="ghost" size="icon">
                    <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`} target="_blank">
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-lg">{t('recommendations.share_title')}</h3>
           <p className="text-sm text-muted-foreground">{t('recommendations.share_subtitle_sms')}</p>
          <div className="flex gap-2">
            <Input 
              type="tel"
              placeholder={t('auth.phone_label')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="max-w-xs"
              disabled={isSent}
            />
            <Button onClick={handleShare} title={t('recommendations.share_sms_button_title')} disabled={isSent}>
                <Smartphone className="h-5 w-5" />
                <span>{t('recommendations.share_sms_button')}</span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className={cn(!isSent && "hidden")}>
          <Button onClick={onNewRecommendation} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('recommendations.new_recommendation_button')}
          </Button>
      </CardFooter>
    </Card>
  );
}
