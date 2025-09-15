'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { getCropRecommendations } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  weatherData: z.string().min(10, 'Please describe the current weather conditions.'),
  soilType: z.string().min(3, 'Please specify the soil type.'),
  geographicRegion: z.string().min(3, 'Please specify your geographic region.'),
  historicalYields: z.string().optional(),
  marketDemand: z.string().optional(),
});

type RecommendationFormProps = {
  setResults: (results: GenerateCropRecommendationsOutput | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
};

export function RecommendationForm({ setResults, setIsLoading, isLoading }: RecommendationFormProps) {
  const { toast } = useToast();
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResults(null);
    const response = await getCropRecommendations(values);
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
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="geographicRegion"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Geographic Region</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Punjab, India" {...field} />
                    </FormControl>
                    <FormDescription>Your state, province, or general area.</FormDescription>
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
                        <Input placeholder="e.g., Sandy Loam, Clay" {...field} />
                    </FormControl>
                    <FormDescription>The dominant type of soil on your farm.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="weatherData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weather Conditions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the current and forecasted weather. e.g., 'Hot and humid, 35°C, with chances of rain next week.'" {...field} />
                  </FormControl>
                  <FormDescription>Temperature, rainfall, humidity, etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="historicalYields"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Historical Yields (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Last year's wheat yield was 2 tons/acre" {...field} />
                    </FormControl>
                    <FormDescription>Past performance of crops in your area.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="marketDemand"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Market Demand (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., High demand for organic vegetables" {...field} />
                    </FormControl>
                    <FormDescription>Current market trends for various crops.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyzing...' : 'Get Recommendations'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
