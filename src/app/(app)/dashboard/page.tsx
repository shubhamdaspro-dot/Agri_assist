'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, Leaf, ShieldCheck, Sprout, Tractor, Wind, MapPin, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { useEffect, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const actionItems = [
  { href: '/recommendations', labelKey: 'dashboard.crop_advice', icon: Sprout, color: 'bg-green-500' },
  { href: '/recommendations', labelKey: 'dashboard.soil_analysis', icon: Leaf, color: 'bg-blue-500' },
  { href: '/news', labelKey: 'dashboard.market_prices', icon: Tractor, color: 'bg-amber-500' },
  { href: '/disease-prevention', labelKey: 'dashboard.disease_check', icon: ShieldCheck, color: 'bg-teal-500' },
];

const cropStatus = [
  { name: 'Rice', stage: 'Flowering', days: 45, status: 'Healthy', icon: Sprout },
  { name: 'Sugarcane', stage: 'Tillering', days: 90, status: 'Healthy', icon: Sprout },
];

type WeatherData = {
  temp: number;
  description: string;
  humidity: number;
  rainfall: number;
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    const fetchWeather = async (latitude: number, longitude: number) => {
      setIsLoadingWeather(true);
      setLocationError(null);
      try {
        // NOTE: This uses a free, open-source weather API (Open-Meteo).
        // No API key is required.
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

  const getWeatherDescription = (code: number) => {
    // Simplified mapping from WMO weather interpretation codes
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Partly cloudy';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };
  
  const renderWeatherContent = () => {
    if (isLoadingWeather) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Fetching local weather...</p>
        </div>
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
         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center">
              <span className="text-6xl font-bold text-orange-500">{weather.temp}°C</span>
              <Cloud className="w-16 h-16 text-blue-400 ml-4" />
            </div>
            <p className="text-lg text-muted-foreground">{weather.description}</p>
            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">{t('dashboard.moderate_humidity')}</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center"><Droplets className="w-4 h-4 mr-2" />{t('dashboard.humidity')}</span>
              <span className="font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center"><Wind className="w-4 h-4 mr-2" />{t('dashboard.rainfall')}</span>
              <span className="font-medium">{weather.rainfall}mm</span>
            </div>
            <Card className="mt-4 bg-green-50 border-green-200">
                <CardContent className="p-3">
                    <p className="text-sm text-green-800">{t('dashboard.weather_-condition')}</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      )
    }
    
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
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
          <CardTitle>{t('dashboard.current_crop_status')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cropStatus.map(crop => (
            <div key={crop.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                    <crop.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-lg">{crop.name}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.growth_stage')}: {crop.stage}</p>
                </div>
                <div className="text-right">
                    <Badge className={crop.status === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{crop.status}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{crop.days} {t('dashboard.days')}</p>
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
