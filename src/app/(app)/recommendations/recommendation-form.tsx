'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Paperclip, Upload, X } from 'lucide-react';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { getCropRecommendations, analyzeSoilFromPhotoAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  weatherData: z.string().min(10, 'Please describe the current weather conditions.'),
  soilType: z.string().min(3, 'Please specify the soil type.'),
  geographicRegion: z.string().min(3, 'Please specify your geographic region.'),
  historicalYields: z.string().optional(),
  marketDemand: z.string().optional(),
  soilPhoto: z.string().optional(),
});

type RecommendationFormProps = {
  setResults: (results: GenerateCropRecommendationsOutput | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  location: { latitude: number; longitude: number } | null;
};

export function RecommendationForm({ setResults, setIsLoading, isLoading, location }: RecommendationFormProps) {
  const { toast } = useToast();
  const [soilPhoto, setSoilPhoto] = useState<string | null>(null);
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weatherData: '',
      soilType: '',
      geographicRegion: '',
      historicalYields: '',
      marketDemand: '',
    },
  });

  useEffect(() => {
    if (location) {
      form.setValue('geographicRegion', `${location.latitude}, ${location.longitude}`);
      // In a real app, you'd use a weather API. For now, we'll use a placeholder.
      form.setValue('weatherData', `Current weather at ${location.latitude}, ${location.longitude}. Temperature: 28°C, Humidity: 70%, No immediate rain forecasted.`);
    }
  }, [location, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setSoilPhoto(dataUri);
        setIsAnalyzingSoil(true);
        const response = await analyzeSoilFromPhotoAction({ photoDataUri: dataUri });
        if (response.success && response.data) {
          form.setValue('soilType', response.data.soilType);
          toast({
            title: 'Soil Analysis Complete',
            description: `Identified as ${response.data.soilType}. ${response.data.analysis}`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Soil Analysis Failed',
            description: response.error || 'Could not analyze the soil photo.',
          });
        }
        setIsAnalyzingSoil(false);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    const response = await getCropRecommendations({...values, soilPhoto: soilPhoto || undefined});
    if (response.success && response.data) {
      setResults(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error || 'Failed to get recommendations.',
      });
    }
    setIsLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Your Farm's Details</CardTitle>
        <CardDescription>Provide details about your farm for a personalized AI recommendation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="geographicRegion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geographic Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Punjab, India" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Conditions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Hot and humid, 35°C, with chances of rain next week.'"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <FormControl>
                        <Input placeholder="Upload a photo or enter manually" {...field} disabled={isLoading || isAnalyzingSoil} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Soil Photo (Optional)</FormLabel>
              <div className="mt-2">
                {soilPhoto ? (
                  <div className="relative w-full max-w-xs">
                    <Image src={soilPhoto} alt="Soil sample" width={200} height={150} className="rounded-md object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7"
                      onClick={() => { setSoilPhoto(null); form.setValue('soilType', ''); }}
                      disabled={isLoading || isAnalyzingSoil}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {isAnalyzingSoil && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                  </div>
                ) : (
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isAnalyzingSoil}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isAnalyzingSoil ? 'Analyzing...' : 'Upload Soil Photo'}
                  </Button>
                )}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isLoading || isAnalyzingSoil}
                />
                <FormDescription className="mt-2">Get AI-powered soil type analysis by uploading a photo.</FormDescription>
              </div>
            </div>

            <Alert>
              <Paperclip className="h-4 w-4" />
              <AlertTitle>Optional Details</AlertTitle>
              <AlertDescription>
                Providing the following details will improve the accuracy of your recommendation.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="historicalYields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Yields</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Last year's wheat yield was 2 tons/acre" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketDemand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Demand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., High demand for organic vegetables" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isLoading || isAnalyzingSoil} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {(isLoading || isAnalyzingSoil) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : isAnalyzingSoil ? 'Analyzing Soil...' : 'Get Recommendations'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
