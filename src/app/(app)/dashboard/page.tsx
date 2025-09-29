'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Leaf, ShieldCheck, Sprout, Wind, Loader2, AlertCircle, Newspaper, BarChart2, Sun, CloudRain, CloudSun, CloudFog, CloudLightning } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { useEffect, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLatestNews } from "@/lib/actions";
import type { NewsArticle } from "@/lib/types";
import { TestTube2 } from "lucide-react";
import { cn } from "@/lib/utils";


const actionItems = [
  { href: '/recommendations', labelKey: 'dashboard.crop_advice', icon: Sprout, color: 'bg-green-500' },
  { href: '/soil-analysis', labelKey: 'dashboard.soil_analysis', icon: TestTube2, color: 'bg-blue-500' },
  { href: '/market-analysis', labelKey: 'dashboard.market_prices', icon: BarChart2, color: 'bg-amber-500' },
  { href: '/disease-prevention', labelKey: 'dashboard.disease_check', icon: ShieldCheck, color: 'bg-teal-500' },
];

type WeatherCondition = 'Clear sky' | 'Partly cloudy' | 'Cloudy' | 'Fog' | 'Rain' | 'Snow' | 'Rain showers' | 'Thunderstorm';

type WeatherData = {
  temp: number;
  description: WeatherCondition;
  humidity: number;
  rainfall: number;
};

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const fetchWeather = async (latitude: number, longitude: number) => {
      setIsLoadingWeather(true);
      setLocationError(null);
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.reason);
        }

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          description: getWeatherDescription(data.current.weather_code),
          humidity: data.current.relative_humidity_2m,
          rainfall: data.current.precipitation,
        });
      } catch (error: any) {
        setLocationError(`Failed to fetch weather: ${error.message}`);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLocationError(t('recommendations.location_error_manual'));
        setIsLoadingWeather(false);
        console.error(`Geolocation error: ${error.message}`);
      }
    );
  }, [isClient, t]);

  useEffect(() => {
    async function loadNews() {
      setIsLoadingNews(true);
      const result = await getLatestNews(language);
      if (result.success && result.data) {
        setNews(result.data.articles.slice(0, 2));
      }
      setIsLoadingNews(false);
    }
    loadNews();
  }, [language]);


  const getWeatherDescription = (code: number): WeatherCondition => {
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Partly cloudy';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };
  
   const getWeatherBackground = (description: WeatherCondition | undefined) => {
    switch (description) {
      case 'Clear sky':
        return 'weather-sunny';
      case 'Partly cloudy':
      case 'Cloudy':
        return 'weather-cloudy';
      case 'Fog':
        return 'weather-fog';
      case 'Rain':
      case 'Rain showers':
        return 'weather-rainy';
      case 'Thunderstorm':
        return 'weather-stormy';
      default:
        return 'bg-secondary';
    }
  };

  const getWeatherIcon = (description: WeatherCondition | undefined) => {
    switch (description) {
      case 'Clear sky': return <Sun className="w-16 h-16 text-yellow-300" />;
      case 'Partly cloudy': return <CloudSun className="w-16 h-16 text-white" />;
      case 'Cloudy': return <Cloud className="w-16 h-16 text-gray-300" />;
      case 'Fog': return <CloudFog className="w-16 h-16 text-gray-400" />;
      case 'Rain':
      case 'Rain showers': return <CloudRain className="w-16 h-16 text-blue-300" />;
      case 'Thunderstorm': return <CloudLightning className="w-16 h-16 text-yellow-300" />;
      default: return <Cloud className="w-16 h-16" />;
    }
  }

  const renderWeatherContent = () => {
    if (isLoadingWeather) {
      return (
        <CardContent className="flex flex-col items-center justify-center p-8 text-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Fetching local weather...</p>
        </CardContent>
      );
    }
    
    if (locationError) {
        return (
             <Alert variant="destructive" className="m-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Location Access Denied</AlertTitle>
              <AlertDescription>
                Please enable location services in your browser to see local weather conditions.
              </AlertDescription>
            </Alert>
        )
    }

    if (weather) {
      return (
         <CardContent className={cn("p-6 relative overflow-hidden rounded-b-lg text-white", getWeatherBackground(weather.description))}>
           <div className="z-10 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center">
                  <span className="text-6xl font-bold">{weather.temp}°C</span>
                  <div className="ml-4">{getWeatherIcon(weather.description)}</div>
                </div>
                <p className="text-lg">{weather.description}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium bg-black/20 p-2 rounded-md">
                  <span className="flex items-center"><Droplets className="w-4 h-4 mr-2" />{t('dashboard.humidity')}</span>
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium bg-black/20 p-2 rounded-md">
                  <span className="flex items-center"><Wind className="w-4 h-4 mr-2" />{t('dashboard.rainfall')}</span>
                  <span>{weather.rainfall}mm</span>
                </div>
              </div>
            </div>
            <Card className="mt-4 bg-white/20 border-white/30 backdrop-blur-sm">
                <CardContent className="p-3">
                    <p className="text-sm text-white font-medium">{t('dashboard.weather_-condition')}</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      )
    }
    
    return null;
  }

  const renderNewsContent = () => {
    if (isLoadingNews) {
      return (
        <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 mt-1" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
             <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 mt-1" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </CardContent>
      );
    }

    return (
        <CardContent className="space-y-4">
          {news.map(article => (
            <div key={article.id} className="flex items-start p-3 bg-secondary/50 rounded-lg">
                <div className="p-3 bg-primary/10 rounded-full mr-4">
                    <Newspaper className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-md leading-tight">{article.headline}</p>
                    <p className="text-sm text-muted-foreground">{article.date}</p>
                </div>
            </div>
          ))}
          <Button asChild variant="link" className="w-full">
            <Link href="/news">
                {t('dashboard.read_more_news')}
            </Link>
          </Button>
        </CardContent>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>{t('dashboard.todays_weather')}</CardTitle>
        </CardHeader>
        {renderWeatherContent()}
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        {actionItems.map(item => (
          <Button key={item.labelKey} asChild className={`${item.color} text-white h-24 text-base font-semibold flex-col gap-2`}>
            <Link href={item.href}>
              <item.icon className="w-8 h-8" />
              {t(item.labelKey)}
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.latest_news_title')}</CardTitle>
        </CardHeader>
        {renderNewsContent()}
      </Card>
    </div>
  );
}
