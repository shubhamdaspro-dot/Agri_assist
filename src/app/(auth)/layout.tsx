'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/use-auth';
import {Loader2} from 'lucide-react';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const {user, loading: authLoading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
