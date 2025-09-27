'use client';

import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TestTube2, Building, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SoilAnalysisPage() {
    const { t } = useLanguage();

    // In a real app, you would have form handling (e.g., with react-hook-form)
    // and a state for the analysis result.
    const handleGetAnalysis = () => {
        // This would trigger the AI flow with the form data.
        alert('Analysis feature coming soon!');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('soil_analysis.page_title')}</h1>
                <p className="text-muted-foreground">
                    {t('soil_analysis.page_subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('soil_analysis.form_title')}</CardTitle>
                            <CardDescription>{t('soil_analysis.form_subtitle')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nitrogen">{t('soil_analysis.nitrogen_label')}</Label>
                                    <Input id="nitrogen" placeholder={t('soil_analysis.nitrogen_placeholder')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phosphorus">{t('soil_analysis.phosphorus_label')}</Label>
                                    <Input id="phosphorus" placeholder={t('soil_analysis.phosphorus_placeholder')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="potassium">{t('soil_analysis.potassium_label')}</Label>
                                    <Input id="potassium" placeholder={t('soil_analysis.potassium_placeholder')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ph">{t('soil_analysis.ph_label')}</Label>
                                    <Input id="ph" type="number" step="0.1" placeholder={t('soil_analysis.ph_placeholder')} />
                                </div>
                            </div>
                            <Button onClick={handleGetAnalysis}>
                                <TestTube2 className="mr-2 h-4 w-4" />
                                {t('soil_analysis.get_analysis_button')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-4">
                     <Card className="bg-secondary/30">
                        <CardHeader>
                            <CardTitle>{t('soil_analysis.unknown_levels_title')}</CardTitle>
                             <CardDescription>{t('soil_analysis.unknown_levels_description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="https://www.google.com/maps/search/?api=1&query=soil+testing+lab" target="_blank">
                                    <Building className="mr-2 h-4 w-4" />
                                    {t('soil_analysis.find_lab_button')}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
