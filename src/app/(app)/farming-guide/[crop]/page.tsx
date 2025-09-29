'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Leaf } from 'lucide-react';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

type FarmingGuide = {
  cropName: string;
  introduction: string;
  soilPreparation: string[];
  sowing: string[];
  fertilizers: string[];
  irrigation: string[];
  weedControl: string[];
  harvesting: string[];
};

const FarmingGuideSchema = z.object({
    cropName: z.string(),
    introduction: z.string().describe("A brief introduction to growing this crop."),
    soilPreparation: z.array(z.string()).describe("Steps for preparing the soil."),
    sowing: z.array(z.string()).describe("Instructions for sowing seeds."),
    fertilizers: z.array(z.string()).describe("Guidance on fertilizer application."),
    irrigation: z.array(z.string()).describe("Instructions on watering the crop."),
    weedControl: z.array(z.string()).describe("Methods for controlling weeds."),
    harvesting: z.array(z.string()).describe("Guidance on when and how to harvest."),
});

const generateFarmingGuideFlow = ai.defineFlow(
  {
    name: 'generateFarmingGuideFlow',
    inputSchema: z.object({ cropName: z.string(), language: z.string() }),
    outputSchema: FarmingGuideSchema,
  },
  async ({ cropName, language }) => {
    const prompt = `Generate a detailed, step-by-step farming guide for ${cropName}. The guide should be easy for a beginner farmer to understand. Provide practical, actionable steps for each stage of cultivation. The response must be in the ${language} language.`;
    const { output } = await ai.generate({
        prompt,
        model: 'googleai/gemini-2.5-flash',
        output: { schema: FarmingGuideSchema },
    });
    return output!;
  }
);


export default function FarmingGuidePage() {
  const params = useParams();
  const { t, language } = useLanguage();
  const cropName = params.crop as string;
  
  const [guide, setGuide] = useState<FarmingGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cropName) {
      const fetchGuide = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await generateFarmingGuideFlow({ cropName: decodeURIComponent(cropName), language });
          setGuide(result);
        } catch (e) {
          console.error(e);
          setError("Failed to load the farming guide. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchGuide();
    }
  }, [cropName, language]);

  const renderSection = (title: string, steps: string[]) => (
    <div>
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-primary"/>
            {title}
        </h3>
        <ul className="list-disc list-inside space-y-2 pl-4 text-muted-foreground">
            {steps.map((step, index) => <li key={index}>{step}</li>)}
        </ul>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('sidebar.farming_guide')} for {decodeURIComponent(cropName)}</h1>
        <p className="text-muted-foreground">
          A step-by-step guide to help you grow a successful harvest.
        </p>
      </div>
      
      {loading && <GuideSkeleton />}
      
      {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {guide && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    Introduction to Growing {guide.cropName}
                </CardTitle>
                <CardDescription>{guide.introduction}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {renderSection("Soil Preparation", guide.soilPreparation)}
                {renderSection("Sowing", guide.sowing)}
                {renderSection("Fertilizer Application", guide.fertilizers)}
                {renderSection("Irrigation", guide.irrigation)}
                {renderSection("Weed Control", guide.weedControl)}
                {renderSection("Harvesting", guide.harvesting)}
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function GuideSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i}>
                        <Skeleton className="h-6 w-1/4 mb-4" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
