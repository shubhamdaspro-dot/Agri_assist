'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Languages, LogOut, Bell, BarChart2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/use-language';
import { auth, messaging, getToken } from '@/lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { saveFcmToken, createUserProfile } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function getTitleKey(path: string): string {
  if (path.includes('/products/')) {
    return 'sidebar.products';
  }
  const pathName = path.split('/').pop() || 'dashboard';
   if (path === '/app' || path === '/(app)') return 'sidebar.dashboard';
  return `sidebar.${pathName}`;
}

export default function Header() {
  const pathname = usePathname();
  const { t, setLanguage, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const titleKey = getTitleKey(pathname);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [userProfile, setUserProfile] = useState<{ displayName?: string; photoURL?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        }
      });
      return () => unsub();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleNotificationClick = async () => {
    if (!('Notification' in window)) {
        toast({ title: "Error", description: "This browser does not support notifications." });
        return;
    }

    if (Notification.permission === 'granted') {
        toast({ title: "Already Enabled", description: "You have already enabled push notifications." });
    } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setHasNotificationPermission(true);
            toast({ title: "Success", description: "Push notifications enabled!" });
            await setupNotifications();
        } else {
            toast({ title: "Permission Denied", description: "You have denied notification permissions." });
        }
    } else {
        toast({ title: "Permission Denied", description: "You have previously denied notification permissions. Please enable them in your browser settings." });
    }
  };

  const setupNotifications = async () => {
    if (messaging && user) {
        try {
            const currentToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }); // Replace with your VAPID key from Firebase Console
            if (currentToken) {
                await saveFcmToken(user.uid, currentToken);
                console.log('FCM Token saved:', currentToken);
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        } catch (err) {
            console.error('An error occurred while retrieving token. ', err);
            toast({ variant: 'destructive', title: "Error", description: "Failed to set up notifications." });
        }
    }
  };


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger />
      
      <div className="flex-1">
        {/* The title can be uncommented if needed in the future */}
        {/* <h1 className="text-lg sm:text-xl font-semibold truncate">{t(titleKey)}</h1> */}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="relative" onClick={handleNotificationClick}>
          <Bell className="h-5 w-5" />
          {!hasNotificationPermission && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
               <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.photoURL || undefined} alt="User avatar" />
                <AvatarFallback>{userProfile?.displayName?.charAt(0) || 'F'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='w-56'>
            <DropdownMenuLabel>
              <p className="font-semibold">{userProfile?.displayName || 'Farmer'}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.phoneNumber}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Languages className="mr-2 h-4 w-4" />
                        <span>{t('header.change_language')}</span>
                    </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setLanguage('en')} active={language === 'en'}>{t('header.english')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('hi')} active={language === 'hi'}>{t('header.hindi')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('bn')} active={language === 'bn'}>{t('header.bengali')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('te')} active={language === 'te'}>{t('header.telugu')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('mr')} active={language === 'mr'}>{t('header.marathi')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('ta')} active={language === 'ta'}>{t('header.tamil')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {user && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('auth.sign_out_button')}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
