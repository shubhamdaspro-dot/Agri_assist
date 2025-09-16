'use client';
import { useState, useEffect } from 'react';
import { RecommendationForm } from './recommendation-form';
import { RecommendationResults } from './recommendation-results';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useIsClient } from '@/hooks/use-is-client';


export default function RecommendationsPage() {
  const [results, setResults] = useState<GenerateCropRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && navigator.geolocation) {
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
    } else if (isClient) {
      setLocationError(t('recommendations.location_error_unsupported'));
    }
  }, [isClient, toast, t]);

  const handleNewRecommendation = () => {
    setResults(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('recommendations.page_title')}</h1>
        <p className="text-muted-foreground">
          {t('recommendations.page_subtitle')}
        </p>
      </div>

      {isClient && locationError && (
        <Alert variant="destructive">
          <MapPin className="h-4 w-4" />
          <AlertTitle>{t('recommendations.location_error_title')}</AlertTitle>
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {isClient ? (
        !results && !isLoading && (
            <RecommendationForm 
                setResults={setResults} 
                setIsLoading={setIsLoading} 
                isLoading={isLoading}
                location={location}
            />
        )
      ) : (
        <FormSkeleton />
      )}

      {isLoading ? <LoadingSkeleton /> : results ? <RecommendationResults results={results} onNewRecommendation={handleNewRecommendation} /> : null}
    </div>
  );
}

function FormSkeleton() {
  return (
     <Card>
      <CardHeader>
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
        </div>
         <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-10 w-44" />
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <Skeleton className="h-8 w-1/4 mb-2" />
        <div className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-1/2" />
        </div>
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
        <div>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
