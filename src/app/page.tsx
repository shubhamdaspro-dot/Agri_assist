'use client';
import {useState, useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {useAuth} from '@/hooks/use-auth';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useToast} from '@/hooks/use-toast';
import {Loader2, Sprout} from 'lucide-react';
import {useLanguage} from '@/hooks/use-language';
import { createUserProfile } from '@/lib/actions';


export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const {user, loading: authLoading} = useAuth();
  const router = useRouter();
  const {toast} = useToast();
  const {t} = useLanguage();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast({
        variant: 'destructive',
        title: t('auth.toast_phone_required_title'),
        description: t('auth.toast_phone_required_description'),
      });
      return;
    }
    setLoading(true);
    try {
      const verifier =
        (window as any).recaptchaVerifier ||
        new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      (window as any).recaptchaVerifier = verifier;

      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      toast({
        title: t('auth.toast_otp_sent_title'),
        description: t('auth.toast_otp_sent_description', {phoneNumber}),
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('auth.toast_otp_failed_title'),
        description: error.message,
      });
    }
    setLoading(false);
  };
  
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        variant: 'destructive',
        title: t('auth.toast_otp_required_title'),
        description: t('auth.toast_otp_required_description'),
      });
      return;
    }
    if (!confirmationResult) {
      toast({
        variant: 'destructive',
        title: t('auth.toast_otp_not_sent_title'),
        description: t('auth.toast_otp_not_sent_description'),
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const user = userCredential.user;

      if (user) {
        await createUserProfile({
          uid: user.uid,
          phoneNumber: user.phoneNumber!,
        });
      }

      toast({
        title: t('auth.toast_login_success_title'),
        description: t('auth.toast_login_success_description'),
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.toast_invalid_otp_title'),
        description: error.message,
      });
    }
    setLoading(false);
  };

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
       <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="flex justify-center">
            <Sprout className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">{t('auth.login_title')}</h1>
        <p className="text-muted-foreground">{t('auth.login_subtitle')}</p>

        {!confirmationResult ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendOtp();
            }}
          >
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder={t('auth.phone_label')}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 text-center"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('auth.send_otp_button')}
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOtp();
            }}
          >
            <div className="relative">
              <Input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t('auth.otp_label')}
                className="h-12 text-center"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('auth.verify_otp_button')}
            </Button>
            <Button
              variant="link"
              type="button"
              onClick={() => {
                setConfirmationResult(null);
                setOtp('');
              }}
            >
              {t('auth.change_number_button')}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
