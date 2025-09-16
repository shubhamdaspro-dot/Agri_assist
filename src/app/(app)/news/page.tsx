'use client';

import { useEffect, useState } from 'react';
import { getLatestNews } from '@/lib/actions';
import type { NewsArticle } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

export default function NewsPage() {
  const { t, language } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const result = await getLatestNews(language);
      if (result.success && result.data) {
        setNews(result.data.articles);
      }
      setLoading(false);
    }
    loadNews();
  }, [language]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('news.page_title')}</h1>
        <p className="text-muted-foreground">
          {t('news.page_subtitle')}
        </p>
      </div>
      <div className="space-y-6">
        {loading ? (
          <>
            <NewsSkeleton />
            <NewsSkeleton />
            <NewsSkeleton />
          </>
        ) : (
          news.map(article => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle className="text-xl">{article.headline}</CardTitle>
                <CardDescription>{article.date} - {article.source}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{article.summary}</p>
                <p className="text-sm whitespace-pre-line">{article.fullStory}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function NewsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    )
}
