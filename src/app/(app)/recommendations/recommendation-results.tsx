'use client';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Smartphone, RefreshCw, MapPin, ArrowRight, Leaf, Share2, Download, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toJpeg } from 'html-to-image';

type RecommendationResultsProps = {
  results: GenerateCropRecommendationsOutput;
  onNewRecommendation: () => void;
};

export function RecommendationResults({ results, onNewRecommendation }: RecommendationResultsProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSent, setIsSent] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);


  const recommendedProductsList = results.recommendedProducts.split(',').map(p => p.trim());
  const cropsText = results.recommendedCrops.map(c => c.name).join(', ');

  const shareMessage = t('recommendations.share_message', {
    crop: cropsText,
    products: results.recommendedProducts,
    rationale: results.rationale
  });

  const handleShareSMS = () => {
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

  const handleShareWhatsApp = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const url = `https://wa.me/?text=${encodedMessage}`;
    window.open(url, '_blank');
     toast({
        title: t('recommendations.toast_sharing_title'),
        description: t('recommendations.toast_sharing_description', { platform: 'WhatsApp' })
    });
  }

  const handleDownloadImage = async () => {
    if (!resultCardRef.current) {
        toast({
            variant: 'destructive',
            title: t('recommendations.toast_download_error_title'),
            description: t('recommendations.toast_download_error_description'),
        });
        return;
    }
    setIsDownloading(true);
    try {
        const dataUrl = await toJpeg(resultCardRef.current, { quality: 0.95, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'agriassist-recommendation.jpg';
        link.href = dataUrl;
        link.click();
        toast({
            title: t('recommendations.toast_download_success_title'),
        });
    } catch(err) {
        console.error(err);
        toast({
            variant: 'destructive',
            title: t('recommendations.toast_download_error_title'),
            description: t('recommendations.toast_download_error_description'),
        });
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="mt-8 space-y-8">
        <Card className="bg-secondary/50" ref={resultCardRef}>
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
                    <div className="grid gap-4 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                        {results.recommendedCrops.map((crop, index) => (
                            <Card key={index} className="bg-background">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5 text-primary"/>{crop.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{crop.rationale}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
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
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-6 w-6" />
                    {t('recommendations.share_title')}
                    </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold">{t('recommendations.share_subtitle_sms')}</h3>
                    <div className="flex gap-2 mt-2">
                        <Input 
                        type="tel"
                        placeholder={t('auth.phone_label')}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="max-w-xs"
                        disabled={isSent}
                        />
                        <Button onClick={handleShareSMS} title={t('recommendations.share_sms_button_title')} disabled={isSent}>
                            <Smartphone className="h-5 w-5" />
                            <span>{t('recommendations.share_sms_button')}</span>
                        </Button>
                    </div>
                </div>
                 <div className='flex items-center gap-4'>
                    <Button onClick={handleShareWhatsApp} variant="outline">
                        <MessageSquare className="h-5 w-5" />
                        {t('recommendations.share_whatsapp_button')}
                    </Button>
                    <Button onClick={handleDownloadImage} variant="outline" disabled={isDownloading}>
                        <Download className="h-5 w-5" />
                        {isDownloading ? t('recommendations.downloading_button') : t('recommendations.download_jpg_button')}
                    </Button>
                </div>
            </CardContent>
        </Card>
        <CardFooter>
            <Button onClick={onNewRecommendation} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('recommendations.new_recommendation_button')}
            </Button>
        </CardFooter>
    </div>
  );
}
