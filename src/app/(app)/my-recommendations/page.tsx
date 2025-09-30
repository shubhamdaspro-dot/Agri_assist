'use client';

import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function MyRecommendationsPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('my_recommendations.page_title')}</h1>
                <p className="text-muted-foreground">{t('my_recommendations.page_subtitle')}</p>
            </div>
            <div className="text-center py-16">
                 <Leaf className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">{t('my_recommendations.no_recommendations_title')}</h2>
                <p className="mt-2 text-muted-foreground">{"Recommendation history is currently not available. Please get a new recommendation."}</p>
                <Button asChild className="mt-6">
                    <Link href="/recommendations">{t('my_recommendations.get_first_recommendation_button')}</Link>
                </Button>
            </div>
        </div>
    );
}
