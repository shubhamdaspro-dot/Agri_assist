'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, MapPin, Check, X, Droplets, Mountain, Wind, Sprout, Upload } from 'lucide-react';
import { saveRecommendation, getCropRecommendations, analyzeSoilFromPhotoAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/use-language';
import { useIsClient } from '@/hooks/use-is-client';
import type { SimplifiedRecommendation } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';

type RecommendationFormProps = {
  setResults: (results: SimplifiedRecommendation | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

const soilTypes = [
    { id: 'Dark and Crumbly', labelKey: 'recommendations.soil_dark', image: 'https://picsum.photos/seed/soil-dark/400/300' },
    { id: 'Red and Sticky', labelKey: 'recommendations.soil_red', image: 'https://picsum.photos/seed/soil-red/400/300' },
    { id: 'Light and Sandy', labelKey: 'recommendations.soil_light', image: 'https://picsum.photos/seed/soil-light/400/300' },
    { id: 'Black and Clayey', labelKey: 'recommendations.soil_black', image: 'https://picsum.photos/seed/soil-black/400/300' },
    { id: 'Brown and Silty', labelKey: 'recommendations.soil_silty', image: 'https://picsum.photos/seed/soil-silty/400/300' },
    { id: 'Alluvial', labelKey: 'recommendations.soil_alluvial', image: 'https://picsum.photos/seed/soil-alluvial/400/300' },
    { id: 'Laterite', labelKey: 'recommendations.soil_laterite', image: 'https://picsum.photos/seed/soil-laterite/400/300' },
];

const waterSources = [
    { id: 'Rain Only', labelKey: 'recommendations.water_rain', icon: Droplets },
    { id: 'Canal / River', labelKey: 'recommendations.water_canal', icon: Mountain },
    { id: 'Borewell / Tubewell', labelKey: 'recommendations.water_borewell', icon: Wind },
];

export function RecommendationForm({ setResults, setIsLoading, isLoading }: RecommendationFormProps) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isClient = useIsClient();

  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [selectedSoil, setSelectedSoil] = useState<string | null>(null);
  const [uploadedSoilPhoto, setUploadedSoilPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedWater, setSelectedWater] = useState<string | null>(null);
  
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUri = reader.result as string;
            setUploadedSoilPhoto(dataUri);
            setSelectedSoil(null); // Clear preset soil selection
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handleSoilSelection = (soilId: string) => {
      setSelectedSoil(soilId);
      setUploadedSoilPhoto(null);
      setStep(3);
  }

 const handleGetRecommendation = async () => {
    if (!location || (!selectedSoil && !uploadedSoilPhoto) || !selectedWater || !user) {
      toast({ variant: 'destructive', title: "Missing Information", description: "Please complete all steps." });
      return;
    }

    setIsLoading(true);
    setStep(4);

    let soilTypeForApi = selectedSoil;

    if (uploadedSoilPhoto) {
        const soilAnalysisResult = await analyzeSoilFromPhotoAction({ photoDataUri: uploadedSoilPhoto });
        if (soilAnalysisResult.success && soilAnalysisResult.data) {
            soilTypeForApi = soilAnalysisResult.data.soilType;
            toast({
              title: t('recommendations.toast_soil_analysis_complete_title'),
              description: t('recommendations.toast_soil_analysis_complete_description', { soilType: soilAnalysisResult.data.soilType, analysis: soilAnalysisResult.data.analysis }),
            });
        } else {
            toast({
                variant: 'destructive',
                title: t('recommendations.toast_soil_analysis_failed_title'),
                description: soilAnalysisResult.error || t('recommendations.toast_soil_analysis_failed_description'),
            });
            setIsLoading(false);
            setStep(2); // Go back to soil step on error
            return;
        }
    }
    
    if (!soilTypeForApi) {
        toast({ variant: 'destructive', title: "Soil type missing", description: "Could not determine soil type." });
        setIsLoading(false);
        setStep(2);
        return;
    }

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,precipitation,weather_code`);
    const weatherData = await weatherResponse.json();
    const weatherString = `Current weather: ${weatherData.current.temperature_2m}°C, ${weatherData.current.precipitation}mm precipitation.`;

    const aiResult = await getCropRecommendations({
      geographicRegion: `${location.latitude}, ${location.longitude}`,
      soilType: soilTypeForApi,
      weatherData: weatherString,
      historicalYields: '',
      marketDemand: '',
    });
    
    if (!aiResult.success || !aiResult.data) {
        toast({
            variant: 'destructive',
            title: t('recommendations.toast_error_title'),
            description: aiResult.error || t('recommendations.toast_error_description'),
        });
        setIsLoading(false);
        setStep(3); // Go back to the last step on error
        return;
    }
    
    const topRec = aiResult.data.recommendedCrops[0];

    const recommendationData: Omit<SimplifiedRecommendation, 'id' | 'userId' | 'createdAt'> = {
      location: `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`,
      soilType: soilTypeForApi,
      waterSource: selectedWater,
      topRecommendation: {
        cropName: topRec.name,
        cropNameLocal: topRec.name, // The AI should provide this in the future
        imageUrl: `https://picsum.photos/seed/${topRec.name.toLowerCase().replace(' ', '-')}/600/400`,
        imageHint: `${topRec.name.toLowerCase()} field`,
        profit: "High", // Placeholder
        waterNeeded: "Medium", // Placeholder
        timeToHarvest: "90-120 days", // Placeholder
        rationale: topRec.rationale,
      },
      secondaryOptions: aiResult.data.recommendedCrops.slice(1, 3).map(c => ({
          cropName: c.name,
          cropNameLocal: c.name
      })),
    };

    const saveResult = await saveRecommendation({ ...recommendationData, userId: user.uid });

    if (saveResult.success && saveResult.id) {
      setResults({ ...recommendationData, id: saveResult.id, userId: user.uid, createdAt: new Date() });
    } else {
      toast({
        variant: 'destructive',
        title: t('recommendations.toast_error_title'),
        description: saveResult.error || t('recommendations.toast_error_description'),
      });
      setStep(3);
    }

    setIsLoading(false);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {soilTypes.map(soil => (
                        <button key={soil.id} onClick={() => handleSoilSelection(soil.id)}
                            className={cn("border-2 rounded-lg p-2 text-center transition-all hover:border-primary",
                                selectedSoil === soil.id ? "border-primary" : "border-transparent"
                            )}
                        >
                            <Image src={soil.image} alt={t(soil.labelKey)} width={200} height={150} className="rounded-md w-full aspect-[4/3] object-cover" />
                            <p className="font-semibold mt-2">{t(soil.labelKey)}</p>
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-4">
                    <hr className="flex-grow border-t" />
                    <span className="text-muted-foreground text-sm">{t('disease_prevention.or_divider')}</span>
                    <hr className="flex-grow border-t" />
                </div>
                
                {uploadedSoilPhoto ? (
                    <div className="space-y-4">
                        <Image src={uploadedSoilPhoto} alt="Uploaded soil" width={200} height={150} className="rounded-md object-cover mx-auto" />
                        <Button onClick={() => setStep(3)} className="w-full">
                           <Check className="mr-2 h-4 w-4" />
                           {t('recommendations.confirm_photo_button')}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" />
                          {t('recommendations.form_soil_photo_upload_button')}
                        </Button>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                    </div>
                )}
            </CardContent>
        </>
      )}

      {step === 3 && (
         <>
            <CardHeader>
                <CardTitle>{t('recommendations.step_3_title')}</CardTitle>
                <CardDescription>{t('recommendations.step_3_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {waterSources.map(water => (
                        <Button key={water.id} variant={selectedWater === water.id ? 'default' : 'outline'} size="lg" className="h-24 flex-col gap-2 text-base"
                            onClick={() => setSelectedWater(water.id)}
                        >
                            <water.icon className="h-8 w-8" />
                            <span>{t(water.labelKey)}</span>
                        </Button>
                    ))}
                </div>
                <Button onClick={handleGetRecommendation} disabled={!selectedWater || isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Get My Recommendation
                </Button>
            </CardContent>
        </>
      )}
      
      {step === 4 && (
        <CardContent className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
            <Sprout className="h-16 w-16 text-primary animate-plant-grow mb-4" />
            <h2 className="text-2xl font-bold font-headline">{t('recommendations.processing_title')}</h2>
            <p className="text-muted-foreground max-w-sm mt-2">{t('recommendations.processing_subtitle')}</p>
        </CardContent>
      )}
    </Card>
  );
}
