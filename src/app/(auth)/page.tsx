'use client';
import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function AuthRedirectPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    redirect('/dashboard');
  } 

  // If not loading and no user, the parent layout will render the login page.
  // We should not redirect here to avoid loops.
  return null;
}
