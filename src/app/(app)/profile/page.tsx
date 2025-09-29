
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Camera } from 'lucide-react';
import { updateUserProfile } from '@/lib/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '@/hooks/use-language';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: '',
    },
  });
  
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setPageLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          form.setValue('displayName', userData.displayName || '');
          setAvatar(userData.photoURL || null);
        }
        setPageLoading(false);
      };
      fetchUserData();
    } else if (!authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router, form]);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: t('profile.toast_error_title'), description: 'You are not logged in.' });
      return;
    }

    setLoading(true);
    let photoURL: string | undefined = undefined;

    try {
       if (avatar && !avatar.startsWith('http')) {
            const storageRef = ref(storage, `avatars/${user.uid}`);
            await uploadString(storageRef, avatar, 'data_url');
            photoURL = await getDownloadURL(storageRef);
       } else {
            photoURL = avatar || undefined;
       }

      const result = await updateUserProfile({
        uid: user.uid,
        displayName: values.displayName,
        photoURL: photoURL,
      });

      if (result.success) {
        toast({ title: t('profile.toast_success_title'), description: t('profile.toast_success_description') });
      } else {
        throw new Error(result.error || t('profile.toast_error_description'));
      }
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: t('profile.toast_error_title'), description: error.message });
    } finally {
        setLoading(false);
    }
  };

  if (pageLoading || authLoading) {
    return <ProfileSkeleton />;
  }
  
  if (!user) {
     return null;
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">{t('profile.page_title')}</h1>
            <p className="text-muted-foreground">{t('profile.page_subtitle')}</p>
        </div>
        <Card className="w-full max-w-lg mx-auto">
            <CardContent className="pt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatar || undefined} alt="User Avatar" />
                                <AvatarFallback>
                                    <User className="h-12 w-12" />
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                type="button"
                                size="icon"
                                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('profile.form_name_label')}</FormLabel>
                        <FormControl>
                        <Input placeholder={t('profile.form_name_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? t('profile.form_loading_button') : t('profile.form_submit_button')}
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>
    </div>
  );
}


function ProfileSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <Card className="w-full max-w-lg mx-auto">
                <CardContent className="pt-6 space-y-6">
                    <div className="flex justify-center">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
