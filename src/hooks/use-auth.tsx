'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type {User} from 'firebase/auth';
import {onAuthStateChanged, signOut as firebaseSignOut} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {useRouter} from 'next/navigation';
import {useToast}from './use-toast';
import { useLanguage } from './use-language';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {toast} = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/auth');
      toast({
        title: t('sidebar.sign_out'),
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Out Error',
        description: error.message,
      });
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
