'use client';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, Newspaper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import { getLatestNews } from '@/lib/actions';
import type { NewsArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setLoadingNews(true);
      const result = await getLatestNews(language);
      if (result.success && result.data) {
        setLatestNews(result.data.articles.slice(0, 3));
      }
      setLoadingNews(false);
    }
    loadNews();
  }, [language]);

  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t('dashboard.welcome_title')}</h1>
            <p className="text-muted-foreground mb-6 text-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {t('dashboard.welcome_subtitle')}
            </p>
            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/recommendations">
                  <Leaf className="mr-2 h-5 w-5" />
                  {t('dashboard.get_recommendation_button')}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-full min-h-[250px]">
            <Image
              src="https://picsum.photos/seed/agriculture/1200/600"
              alt="Farmer working in a lush green field"
              fill
              className="object-cover"
              data-ai-hint="farmer field"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.card_recommendations_title')}</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('dashboard.card_recommendations_heading')}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.card_recommendations_subheading')}
            </p>
            <Button asChild variant="link" className="px-0">
                <Link href="/recommendations">
                    {t('dashboard.start_now_button')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.card_news_title')}</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('dashboard.card_news_heading')}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.card_news_subheading')}
            </p>
            <Button asChild variant="link" className="px-0">
                <Link href="/news">
                    {t('dashboard.read_news_button')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-2xl font-bold font-headline mb-4">{t('dashboard.latest_news_title')}</h2>
        <div className="grid gap-4 md:grid-cols-3">
            {loadingNews ? (
              <>
                <NewsCardSkeleton />
                <NewsCardSkeleton />
                <NewsCardSkeleton />
              </>
            ) : (
              latestNews.map(article => (
                  <Card key={article.id}>
                      <CardHeader>
                          <CardTitle className="text-lg">{article.headline}</CardTitle>
                          <CardDescription>{article.date} - {article.source}</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">{article.summary}</p>
                      </CardContent>
                  </Card>
              ))
            )}
        </div>
      </div>
    </div>
  );
}

function NewsCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  )
}
