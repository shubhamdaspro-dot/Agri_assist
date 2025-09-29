'use client';

import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X, TestTube2, Camera } from 'lucide-react';
import { analyzeSoilFromPhotoAction } from '@/lib/actions';
import type { AnalyzeSoilFromPhotoOutput } from '@/ai/flows/analyze-soil-from-photo';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SoilAnalysisPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AnalyzeSoilFromPhotoOutput | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setUploadedPhoto(dataUri);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetAnalysis = async () => {
        if (!uploadedPhoto) {
            toast({
                variant: 'destructive',
                title: t('disease_prevention.toast_input_required_title'),
                description: t('recommendations.form_soil_photo_upload_button'),
            });
            return;
        }

        setIsLoading(true);
        setResults(null);

        const response = await analyzeSoilFromPhotoAction({ photoDataUri: uploadedPhoto });

        if (response.success && response.data) {
            setResults(response.data);
        } else {
            toast({
                variant: 'destructive',
                title: t('soil_analysis.toast_analysis_failed_title'),
                description: response.error || t('soil_analysis.toast_analysis_failed_description'),
            });
        }

        setIsLoading(false);
    };
    
    const handleNewAnalysis = () => {
        setResults(null);
        setUploadedPhoto(null);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">{t('soil_analysis.page_title')}</h1>
                <p className="text-muted-foreground">
                    {t('soil_analysis.page_subtitle_photo')}
                </p>
            </div>

            {!results ? (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('soil_analysis.form_title_photo')}</CardTitle>
                        <CardDescription>{t('soil_analysis.form_subtitle_photo')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                          <div className="mt-2">
                            {uploadedPhoto ? (
                              <div className="relative w-full max-w-sm mx-auto">
                                <Image src={uploadedPhoto} alt="Uploaded soil" width={400} height={300} className="rounded-md object-cover" />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8"
                                  onClick={() => setUploadedPhoto(null)}
                                  disabled={isLoading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className='flex justify-center'>
                                <Button type="button" variant="outline" className="h-32 w-full max-w-sm border-dashed border-2 flex-col gap-2" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                    <span className="text-muted-foreground">{t('recommendations.form_soil_photo_upload_button')}</span>
                                </Button>
                              </div>
                            )}
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                              disabled={isLoading}
                            />
                          </div>
                        </div>

                        <Button onClick={handleGetAnalysis} disabled={isLoading || !uploadedPhoto} className="w-full md:w-auto">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? t('soil_analysis.analyzing_button') : t('soil_analysis.get_analysis_button')}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <AnalysisResults results={results} onNewAnalysis={handleNewAnalysis} />
            )}
        </div>
    );
}

type AnalysisResultsProps = {
  results: AnalyzeSoilFromPhotoOutput;
  onNewAnalysis: () => void;
};

function AnalysisResults({ results, onNewAnalysis }: AnalysisResultsProps) {
    const { t } = useLanguage();
    
    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <TestTube2 className="h-8 w-8 text-primary" />
                        {t('soil_analysis.results_title')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <AlertTitle className="text-lg font-bold">{results.soilType}</AlertTitle>
                        <AlertDescription className="mt-1">
                            {results.analysis}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <Button onClick={onNewAnalysis} className="w-full md:w-auto">
                {t('soil_analysis.new_analysis_button')}
            </Button>
        </div>
    )
}
