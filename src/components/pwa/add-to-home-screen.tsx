'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import Image from 'next/image';

const AddToHomeScreen = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      const isPwaInstalled = localStorage.getItem('isPwaInstalled');
      if (!isPwaInstalled) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          localStorage.setItem('isPwaInstalled', 'true');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false);
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <Card className="w-80 shadow-2xl">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image src="/icons/icon-192x192.png" alt="AgriAssist Logo" width={40} height={40} className="rounded-md" />
              <div>
                <CardTitle className="text-base">Install AgriAssist</CardTitle>
                <CardDescription className="text-xs">Add to your home screen for a better experience.</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button className="w-full" onClick={handleInstallClick}>
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddToHomeScreen;
