'use client';
import { useState } from 'react';
import { RecommendationForm } from './recommendation-form';
import { RecommendationResults } from './recommendation-results';
import type { GenerateCropRecommendationsOutput } from '@/ai/flows/generate-crop-recommendations';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
  const [results, setResults] = useState<GenerateCropRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">AI Crop & Product Recommendations</h1>
        <p className="text-muted-foreground">
          Fill in the details below to get a personalized recommendation from our AI assistant.
        </p>
      </div>

      <RecommendationForm setResults={setResults} setIsLoading={setIsLoading} isLoading={isLoading} />

      {isLoading && <LoadingSkeleton />}
      {results && <RecommendationResults results={results} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-4 pt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
