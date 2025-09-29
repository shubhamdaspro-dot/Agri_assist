'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MapPin, Check, Sprout, TestTube2 } from 'lucide-react';
import { saveRecommendation, getCropRecommendations } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/use-language';
import { useIsClient } from '@/hooks/use-is-client';
import type { SimplifiedRecommendation } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

type RecommendationFormProps = {
  setResults: (results: SimplifiedRecommendation | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

const soilTypes = [
    { id: 'Dark and Crumbly', labelKey: 'recommendations.soil_dark' },
    { id: 'Red and Sticky', labelKey: 'recommendations.soil_red' },
    { id: 'Light and Sandy', labelKey: 'recommendations.soil_light' },
    { id: 'Black and Clayey', labelKey: 'recommendations.soil_black' },
    { id: 'Brown and Silty', labelKey: 'recommendations.soil_silty' },
    { id: 'Alluvial', labelKey: 'recommendations.soil_alluvial' },
    { id: 'Laterite', labelKey: 'recommendations.soil_laterite' },
];


export function RecommendationForm({ setResults, setIsLoading, isLoading }: RecommendationFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isClient = useIsClient();

  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  
  useEffect(() => {
    if (isClient && step === 1) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(t('recommendations.location_error_manual'));
          console.error(`Geolocation error: ${error.message} (Code: ${error.code})`);
        }
      );
    }
  }, [isClient, t, step]);


 const handleGetRecommendation = async () => {
    if (!location || !selectedSoil || !user) {
      toast({ variant: 'destructive', title: "Missing Information", description: "Please complete all steps." });
      return;
    }

    setIsLoading(true);
    setStep(3); // Change to processing step

    try {
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,precipitation,weather_code`);
        const weatherData = await weatherResponse.json();
        const weatherString = `Current weather: ${weatherData.current.temperature_2m}°C, ${weatherData.current.precipitation}mm precipitation.`;
    
        const aiResult = await getCropRecommendations({
          geographicRegion: `${location.latitude}, ${location.longitude}`,
          soilType: selectedSoil,
          weatherData: weatherString,
        });
        
        if (!aiResult.success || !aiResult.data) {
            throw new Error(aiResult.error || t('recommendations.toast_error_description'));
        }
        
        const topRec = aiResult.data.recommendedCrops[0];
    
        const recommendationData: Omit<SimplifiedRecommendation, 'id' | 'createdAt'> = {
          userId: user.uid,
          location: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
          soilType: selectedSoil,
          waterSource: "Not Specified", // Default value
          topRecommendation: {
            cropName: topRec.name,
            cropNameLocal: topRec.name, // Assuming same for now
            imageUrl: `https://picsum.photos/seed/${topRec.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}/600/400`,
            imageHint: `${topRec.name.toLowerCase()} field`,
            profit: "High", // Placeholder
            waterNeeded: topRec.waterRequirement,
            timeToHarvest: `${topRec.sowingSeason} - ${topRec.harvestingSeason}`,
            rationale: topRec.rationale,
          },
          secondaryOptions: aiResult.data.recommendedCrops.slice(1, 3).map(c => ({
              cropName: c.name,
              cropNameLocal: c.name
          })),
        };
    
        const saveResult = await saveRecommendation(recommendationData);
    
        if (saveResult.success && saveResult.id) {
          setResults({ ...recommendationData, id: saveResult.id, createdAt: new Date() });
        } else {
          throw new Error(saveResult.error || 'Failed to save recommendation.');
        }

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: t('recommendations.toast_error_title'),
            description: error.message,
        });
        setStep(2); // Go back to the soil step on error
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!isClient) return <Card><CardContent><Loader2 className="mx-auto my-12 h-8 w-8 animate-spin text-primary"/></CardContent></Card>

  return (
    <Card>
      {step === 1 && (
        <>
            <CardHeader>
                <CardTitle>{t('recommendations.step_1_title')}</CardTitle>
                <CardDescription>{t('recommendations.step_1_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {location && (
                    <div className="rounded-lg overflow-hidden border">
                        <iframe
                            width="100%"
                            height="250"
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01}%2C${location.latitude-0.01}%2C${location.longitude+0.01}%2C${location.latitude+0.01}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`}
                        >
                        </iframe>
                    </div>
                )}
                {locationError && (
                    <Alert variant="destructive">
                      <MapPin className="h-4 w-4" />
                      <AlertTitle>{t('recommendations.location_error_title')}</AlertTitle>
                      <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                )}
                <Button onClick={() => setStep(2)} disabled={!location} className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    {t('recommendations.confirm_location_yes')}
                </Button>
            </CardContent>
        </>
      )}

      {step === 2 && (
         <>
            <CardHeader>
                <CardTitle>{t('recommendations.step_2_title')}</CardTitle>
                <CardDescription>{t('recommendations.step_2_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Select onValueChange={(value) => { setSelectedSoil(value); }} value={selectedSoil || ''}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('recommendations.form_soil_type_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {soilTypes.map(soil => (
                            <SelectItem key={soil.id} value={soil.id}>{t(soil.labelKey)}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <div className="flex items-center gap-4">
                    <hr className="flex-grow border-t" />
                    <span className="text-muted-foreground text-sm">{t('disease_prevention.or_divider')}</span>
                    <hr className="flex-grow border-t" />
                </div>

                <Alert>
                    <TestTube2 className="h-4 w-4" />
                    <AlertTitle>{t('soil_analysis.unknown_levels_title')}</AlertTitle>
                    <AlertDescription>
                        {t('soil_analysis.unknown_levels_description')}
                    </AlertDescription>
                    <Button asChild variant="link" className="p-0 h-auto mt-2">
                        <Link href="/soil-analysis">{t('soil_analysis.use_photo_analysis')}</Link>
                    </Button>
                </Alert>
                
                 <Button onClick={handleGetRecommendation} disabled={!selectedSoil || isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Get My Recommendation
                </Button>

            </CardContent>
        </>
      )}

      {step === 3 && (
        <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
            <Sprout className="h-16 w-16 text-primary animate-plant-grow mb-4" />
            <h2 className="text-2xl font-bold font-headline">{t('recommendations.processing_title')}</h2>
            <p className="text-muted-foreground max-w-sm mt-2">{t('recommendations.processing_subtitle')}</p>
        </CardContent>
      )}
    </Card>
  );
}
