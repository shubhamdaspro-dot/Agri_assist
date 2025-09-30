'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Download } from 'lucide-react';

export default function InstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
      setIsPromptVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) return;

    // Type assertion for prompt() method
    const promptEvent = installPromptEvent as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setInstallPromptEvent(null);
    setIsPromptVisible(false);
  };
  
  if (!isPromptVisible) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50">
        <Button onClick={handleInstallClick}>
            <Download className="mr-2 h-4 w-4" />
            Install App
        </Button>
    </div>
  );
}
