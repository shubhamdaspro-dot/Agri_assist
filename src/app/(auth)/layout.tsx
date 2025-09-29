'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/use-auth';
import { Flower2 } from 'lucide-react';
import Image from 'next/image';

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
        <div className="animate-pulse">
            <Image src="/logo.png" alt="AgriAssist Logo" width={80} height={80} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
