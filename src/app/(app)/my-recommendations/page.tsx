'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { getMyRecommendations } from '@/lib/actions';
import type { SimplifiedRecommendation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Leaf, Calendar, MapPin, Wind, Droplets, Mountain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

export default function MyRecommendationsPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [recommendations, setRecommendations] = useState<SimplifiedRecommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getMyRecommendations(user.uid).then(result => {
                if (result.success && result.data) {
                    setRecommendations(result.data);
                }
                setLoading(false);
            });
        }
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <div className="space-y-4 mt-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        );
    }
    
    if (recommendations.length === 0) {
        return (
            <div className="text-center py-16">
                 <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">{t('my_recommendations.no_recommendations_title')}</h2>
                <p className="mt-2 text-muted-foreground">{t('my_recommendations.no_recommendations_description')}</p>
                <Button asChild className="mt-6">
                    <Link href="/recommendations">{t('my_recommendations.get_first_recommendation_button')}</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('my_recommendations.page_title')}</h1>
                <p className="text-muted-foreground">{t('my_recommendations.page_subtitle')}</p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {recommendations.map(rec => (
                    <AccordionItem value={rec.id} key={rec.id} className="border rounded-lg bg-card">
                        <AccordionTrigger className="p-4 hover:no-underline">
                             <div className="flex items-center gap-4">
                                <Image src={rec.topRecommendation.imageUrl} alt={rec.topRecommendation.cropName} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                                <div className="text-left">
                                    <h3 className="font-bold text-lg">{rec.topRecommendation.cropName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('my_recommendations.recommendation_date')}: {format(new Date((rec.createdAt as any).seconds * 1000), 'PPP')}
                                    </p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 border-t">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">{t('my_recommendations.inputs_title')}</h4>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> <strong>Location:</strong> {rec.location}</p>
                                        <p className="flex items-center gap-2"><Droplets className="h-4 w-4" /> <strong>Soil:</strong> {rec.soilType}</p>
                                        <p className="flex items-center gap-2"><Wind className="h-4 w-4" /> <strong>Water:</strong> {rec.waterSource}</p>
                                    </div>
                                </div>
                                 <Button asChild>
                                    <Link href={`/farming-guide/${rec.topRecommendation.cropName}`}>
                                        {t('sidebar.farming_guide')} for {rec.topRecommendation.cropName}
                                    </Link>
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
