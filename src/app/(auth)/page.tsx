'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

// This page component is necessary for the layout to be rendered.
// It redirects authenticated users to the dashboard.
export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  // The actual login UI is now in src/app/page.tsx,
  // which is rendered for unauthenticated users at the root.
  // This page itself can remain minimal.
  return null;
}
