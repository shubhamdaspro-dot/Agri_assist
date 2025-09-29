'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight, TrendingUp, Droplets, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import type { SimplifiedRecommendation } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type RecommendationResultsProps = {
  results: SimplifiedRecommendation;
  onNewRecommendation: () => void;
};

export function RecommendationResults({ results, onNewRecommendation }: RecommendationResultsProps) {
  const { t } = useLanguage();

  const getBadgeVariant = (level: 'High' | 'Medium' | 'Low') => {
    if (level === 'High') return 'success';
    if (level === 'Medium') return 'warning';
    return 'destructive';
  }

  const { topRecommendation, secondaryOptions } = results;

  return (
    <div className="space-y-6">
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>{t('recommendations.top_recommendation')}</CardTitle>
                <CardDescription>{t('recommendations.results_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image src={topRecommendation.imageUrl} alt={topRecommendation.cropName} layout="fill" objectFit="cover" data-ai-hint={topRecommendation.imageHint} />
                </div>
                
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline">{topRecommendation.cropName} ({topRecommendation.cropNameLocal})</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <Card className="bg-muted/50 p-4">
                        <TrendingUp className="h-7 w-7 text-primary mx-auto mb-2"/>
                        <p className="text-sm text-muted-foreground">{t('recommendations.profit_label')}</p>
                        <p className="font-bold text-lg">{t(`recommendations.profit_${topRecommendation.profit.toLowerCase()}`)}</p>
                    </Card>
                     <Card className="bg-muted/50 p-4">
                        <Droplets className="h-7 w-7 text-primary mx-auto mb-2"/>
                        <p className="text-sm text-muted-foreground">{t('recommendations.water_label')}</p>
                        <p className="font-bold text-lg">{t(`recommendations.water_${topRecommendation.waterNeeded.toLowerCase()}`)}</p>
                    </Card>
                     <Card className="bg-muted/50 p-4">
                        <CalendarDays className="h-7 w-7 text-primary mx-auto mb-2"/>
                        <p className="text-sm text-muted-foreground">{t('recommendations.harvest_label')}</p>
                        <p className="font-bold text-lg">{topRecommendation.timeToHarvest}</p>
                    </Card>
                </div>
                
                <div>
                    <h3 className="font-semibold">{t('recommendations.rationale_label')}:</h3>
                    <p className="text-muted-foreground mt-1">{topRecommendation.rationale}</p>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t('recommendations.secondary_options_label')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondaryOptions.map(option => (
                    <div key={option.cropName} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-semibold text-lg">{option.cropName} ({option.cropNameLocal})</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={onNewRecommendation} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('recommendations.start_over_button')}
            </Button>
            <Button asChild>
                <Link href={`/farming-guide/${topRecommendation.cropName}`}>
                    {t('recommendations.next_step_button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    </div>
  );
}
