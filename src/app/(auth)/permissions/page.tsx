
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, MapPin, Mic, Bell, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveFcmToken } from '@/lib/actions';
import { useAuth } from '@/hooks/use-auth';
import { getToken, messaging } from '@/lib/firebase';

type PermissionState = 'granted' | 'denied' | 'prompt';

export default function PermissionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [locationState, setLocationState] = useState<PermissionState>('prompt');
  const [notificationsState, setNotificationsState] = useState<PermissionState>('prompt');
  const [microphoneState, setMicrophoneState] = useState<PermissionState>('prompt');

  const handleLocationRequest = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationState('granted');
        toast({ title: 'Location access granted!' });
      },
      () => {
        setLocationState('denied');
        toast({ variant: 'destructive', title: 'Location access denied.' });
      }
    );
  };

  const handleNotificationsRequest = async () => {
    if (!('Notification' in window) || !user) {
      toast({ title: "Error", description: "This browser does not support notifications or you are not logged in." });
      setNotificationsState('denied');
      return;
    }
     if (!messaging) {
        toast({ title: "Error", description: "Messaging not initialized." });
        setNotificationsState('denied');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const currentToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY_HERE' }); // Replace with your VAPID key
            if (currentToken) {
                await saveFcmToken(user.uid, currentToken);
                setNotificationsState('granted');
                toast({ title: 'Notification permissions granted!' });
            } else {
                 setNotificationsState('denied');
                 toast({ variant: 'destructive', title: 'Could not get notification token.' });
            }
        } else {
            setNotificationsState('denied');
            toast({ variant: 'destructive', title: 'Notification permissions were denied.' });
        }
    } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
        setNotificationsState('denied');
        toast({ variant: 'destructive', title: 'An error occurred while enabling notifications.' });
    }
  };

  const handleMicrophoneRequest = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setMicrophoneState('granted');
        toast({ title: 'Microphone access granted!' });
      })
      .catch(() => {
        setMicrophoneState('denied');
        toast({ variant: 'destructive', title: 'Microphone access denied.' });
      });
  };

  const permissionItems = [
    {
      id: 'location',
      icon: MapPin,
      title: 'Location Access',
      description: 'Used to provide localized weather data and regional crop advice.',
      state: locationState,
      action: handleLocationRequest,
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive alerts for important updates and recommendations.',
      state: notificationsState,
      action: handleNotificationsRequest,
    },
    {
      id: 'microphone',
      icon: Mic,
      title: 'Microphone Access',
      description: 'Used for voice commands and interacting with the AI assistant.',
      state: microphoneState,
      action: handleMicrophoneRequest,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Set App Permissions</CardTitle>
          <CardDescription>To get the most out of AgriAssist, please grant the following permissions. You can change these later in your browser settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {permissionItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <item.icon className="h-6 w-6 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={item.action}
                disabled={item.state === 'granted'}
                className={cn({
                  'bg-green-600 hover:bg-green-700': item.state === 'granted',
                })}
              >
                {item.state === 'granted' ? <Check className="h-4 w-4" /> : 'Grant'}
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button className="w-full" onClick={() => router.push('/dashboard')}>
                Continue to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
             <Button variant="link" size="sm" onClick={() => router.push('/dashboard')}>
                Skip for now
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
