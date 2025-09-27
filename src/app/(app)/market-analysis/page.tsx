'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, BarChart2, TrendingUp, Store, AlertCircle } from 'lucide-react';
import { getMarketAnalysis } from '@/lib/actions';
import type { AnalyzeMarketPricesOutput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';


const formSchema = z.object({
  cropName: z.string().min(2, 'Please enter a valid crop name.'),
  geographicRegion: z.string().min(3, 'Please enter a region.'),
});

export default function MarketAnalysisPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AnalyzeMarketPricesOutput | null>(null);
    const [location, setLocation] = useState<{ latitude: number; longitude: number; } | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cropName: '',
            geographicRegion: '',
        },
    });
    
    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              form.setValue('geographicRegion', `${position.coords.latitude}, ${position.coords.longitude}`, { shouldValidate: true });
            },
            (error) => {
              console.error(`Geolocation error: ${error.message}`);
            }
          );
        }
    }, [form]);

    const handleGetAnalysis = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setResults(null);

        const response = await getMarketAnalysis(values);

        if (response.success && response.data) {
            setResults(response.data);
        } else {
            toast({
                variant: 'destructive',
                title: t('market_analysis.toast_error_title'),
                description: response.error || t('market_analysis.toast_error_description'),
            });
        }
        setIsLoading(false);
    };
    
    const handleNewAnalysis = () => {
        setResults(null);
        form.reset();
        if(location) {
            form.setValue('geographicRegion', `${location.latitude}, ${location.longitude}`);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('market_analysis.page_title')}</h1>
                <p className="text-muted-foreground">
                    {t('market_analysis.page_subtitle')}
                </p>
            </div>

            {!results ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('market_analysis.form_title')}</CardTitle>
                        <CardDescription>{t('market_analysis.form_subtitle')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleGetAnalysis)} className="space-y-6">
                                 <FormField
                                    control={form.control}
                                    name="cropName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('market_analysis.crop_name_label')}</FormLabel>
                                        <FormControl>
                                        <Input placeholder={t('market_analysis.crop_name_placeholder')} {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="geographicRegion"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('market_analysis.region_label')}</FormLabel>
                                        <FormControl>
                                        <Input placeholder={t('market_analysis.region_placeholder')} {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormDescription>{t('market_analysis.region_description')}</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? t('market_analysis.loading_button') : t('market_analysis.submit_button')}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            ) : (
                <AnalysisResults results={results} onNewAnalysis={handleNewAnalysis} />
            )}
        </div>
    );
}

type AnalysisResultsProps = {
  results: AnalyzeMarketPricesOutput;
  onNewAnalysis: () => void;
};

function AnalysisResults({ results, onNewAnalysis }: AnalysisResultsProps) {
    const { t } = useLanguage();

    const getTrendIcon = () => {
        switch (results.priceTrend) {
            case 'Rising': return <TrendingUp className="h-5 w-5 text-green-500" />;
            case 'Falling': return <TrendingUp className="h-5 w-5 text-red-500 transform rotate-90" />;
            default: return <TrendingUp className="h-5 w-5 text-gray-500 transform -rotate-45" />;
        }
    };
    
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <BarChart2 className="h-8 w-8 text-primary" />
                        {t('market_analysis.results_title', { cropName: results.cropName })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="bg-secondary/30">
                            <CardHeader>
                                <CardTitle className="text-lg">{t('market_analysis.current_price')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{results.currentPrice}</p>
                            </CardContent>
                        </Card>
                         <Card className="bg-secondary/30">
                            <CardHeader>
                                <CardTitle className="text-lg">{t('market_analysis.price_trend')}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-2">
                                {getTrendIcon()}
                                <p className="text-2xl font-semibold">{results.priceTrend}</p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                            <Store className="h-5 w-5 text-green-500"/>
                            {t('market_analysis.selling_suggestions')}
                        </h3>
                        <div className="space-y-4">
                            {results.sellingSuggestions.map((suggestion, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-background">
                                    <h4 className="font-bold">{suggestion.location}</h4>
                                    <p className="text-muted-foreground text-sm mt-1">{suggestion.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button onClick={onNewAnalysis} className="w-full md:w-auto">
                {t('market_analysis.new_analysis_button')}
            </Button>
        </div>
    )
}
