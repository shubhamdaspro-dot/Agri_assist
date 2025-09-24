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
import { useLanguage } from '@/hooks/use-language';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
  const { t } = useLanguage();
  const [soilPhoto, setSoilPhoto] = useState<string | null>(null);
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      weatherData: '',
      soilType: '',
      geographicRegion: '',
      historicalYields: '',
      marketDemand: '',
    },
  });
  
  const { isValid } = form.formState;

  useEffect(() => {
    if (location) {
      form.setValue('geographicRegion', `${location.latitude}, ${location.longitude}`, { shouldValidate: true });
      // In a real app, you'd use a weather API. For now, we'll use a placeholder.
      form.setValue('weatherData', t('recommendations.weather_placeholder', {lat: location.latitude, long: location.longitude}), { shouldValidate: true });
    }
  }, [location, form, t]);

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
          form.setValue('soilType', response.data.soilType, { shouldValidate: true });
          toast({
            title: t('recommendations.toast_soil_analysis_complete_title'),
            description: t('recommendations.toast_soil_analysis_complete_description', {soilType: response.data.soilType, analysis: response.data.analysis}),
          });
        } else {
          toast({
            variant: 'destructive',
            title: t('recommendations.toast_soil_analysis_failed_title'),
            description: response.error || t('recommendations.toast_soil_analysis_failed_description'),
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
        title: t('recommendations.toast_error_title'),
        description: response.error || t('recommendations.toast_error_description'),
      });
    }
    setIsLoading(false);
  }

  const soilTypes = ['Sandy', 'Clay', 'Loam', 'Silt', 'Peat', 'Chalky'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recommendations.form_title')}</CardTitle>
        <CardDescription>{t('recommendations.form_subtitle')}</CardDescription>
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
                    <FormLabel>{t('recommendations.form_region_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('recommendations.form_region_placeholder')} {...field} disabled={isLoading} />
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
                    <FormLabel>{t('recommendations.form_weather_label')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('recommendations.form_weather_placeholder')}
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
                    <FormLabel>{t('recommendations.form_soil_type_label')}</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value} value={field.value} disabled={isLoading || isAnalyzingSoil}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('recommendations.form_soil_type_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {soilTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>{t('recommendations.form_soil_photo_label')}</FormLabel>
              <div className="mt-2">
                {soilPhoto ? (
                  <div className="relative w-full max-w-xs">
                    <Image src={soilPhoto} alt="Soil sample" width={200} height={150} className="rounded-md object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7"
                      onClick={() => { setSoilPhoto(null); form.setValue('soilType', '', { shouldValidate: true }); }}
                      disabled={isLoading || isAnalyzingSoil}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {isAnalyzingSoil && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}
                  </div>
                ) : (
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isAnalyzingSoil}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isAnalyzingSoil ? t('recommendations.form_soil_photo_analyzing_button') : t('recommendations.form_soil_photo_upload_button')}
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
                <FormDescription className="mt-2">{t('recommendations.form_soil_photo_description')}</FormDescription>
              </div>
            </div>

            <Alert>
              <Paperclip className="h-4 w-4" />
              <AlertTitle>{t('recommendations.optional_details_title')}</AlertTitle>
              <AlertDescription>
                {t('recommendations.optional_details_description')}
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="historicalYields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('recommendations.form_yields_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('recommendations.form_yields_placeholder')} {...field} disabled={isLoading} />
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
                    <FormLabel>{t('recommendations.form_demand_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('recommendations.form_demand_placeholder')} {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || isAnalyzingSoil} 
              className={cn("w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground", {
                "animate-glow": isValid && !isLoading && !isAnalyzingSoil
              })}
            >
              {(isLoading || isAnalyzingSoil) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? t('recommendations.form_submit_analyzing_button') : isAnalyzingSoil ? t('recommendations.form_submit_analyzing_soil_button') : t('recommendations.form_submit_button')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
