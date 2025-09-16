'use client';
import { useState, useEffect } from 'react';
import { RecommendationForm } from './recommendation-form';
import { RecommendationResults } from './recommendation-results';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function RecommendationsPage() {
  const [results, setResults] = useState<GenerateCropRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: t('recommendations.toast_location_accessed_title'),
            description: t('recommendations.toast_location_accessed_description'),
          })
        },
        (error) => {
          setLocationError(t('recommendations.location_error_manual'));
          console.error(`Geolocation error: ${error.message} (Code: ${error.code})`);
        }
      );
    } else {
      setLocationError(t('recommendations.location_error_unsupported'));
    }
  }, [toast, t]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('recommendations.page_title')}</h1>
        <p className="text-muted-foreground">
          {t('recommendations.page_subtitle')}
        </p>
      </div>

      {locationError && (
        <Alert variant="destructive">
          <MapPin className="h-4 w-4" />
          <AlertTitle>{t('recommendations.location_error_title')}</AlertTitle>
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      <RecommendationForm 
        setResults={setResults} 
        setIsLoading={setIsLoading} 
        isLoading={isLoading}
        location={location}
      />

      {isLoading && <LoadingSkeleton />}
      {results && !isLoading && <RecommendationResults results={results} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-8 w-1/4" />
                </CardTitle>
                <CardDescription>
                    <Skeleton className="h-4 w-1/2" />
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-8 w-1/2" />
                </div>
                <div>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                </div>
                <div>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
