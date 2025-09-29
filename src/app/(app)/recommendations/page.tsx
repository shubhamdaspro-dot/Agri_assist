'use client';
import { useState } from 'react';
import { RecommendationForm } from './recommendation-form';
import { RecommendationResults } from './recommendation-results';
import type { SimplifiedRecommendation } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

export default function RecommendationsPage() {
  const [results, setResults] = useState<SimplifiedRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

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
      
      {!results ? (
          <RecommendationForm 
              setResults={setResults} 
              setIsLoading={setIsLoading} 
              isLoading={isLoading}
          />
      ) : (
        <RecommendationResults 
          results={results} 
          onNewRecommendation={handleNewRecommendation}
        />
      )}

    </div>
  );
}
