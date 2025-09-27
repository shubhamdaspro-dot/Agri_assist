'use client';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {useAuth} from '@/hooks/use-auth';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useToast} from '@/hooks/use-toast';
import {Loader2, Sprout} from 'lucide-react';
import {useLanguage} from '@/hooks/use-language';
import { createUserProfile } from '@/lib/actions';

export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const {user, loading: authLoading} = useAuth();
  const router = useRouter();
  const {toast} = useToast();
  const {t} = useLanguage();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const initRecaptcha = () => {
       if (!(window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response: any) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                    },
                }
            );
        }
    };
    // Delay initialization to ensure the container is in the DOM
    const timeoutId = setTimeout(initRecaptcha, 100);

    return () => clearTimeout(timeoutId);
  }, []);

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
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      toast({
        title: t('auth.toast_otp_sent_title'),
        description: t('auth.toast_otp_sent_description', {phoneNumber}),
      });
    } catch (error: any) {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary p-3 rounded-full w-fit mb-4">
                <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">{t('auth.login_title')}</CardTitle>
            <CardDescription>{t('auth.login_subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {!confirmationResult ? (
            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone_label')}</Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                </div>
                <Button onClick={handleSendOtp} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.send_otp_button')}
                </Button>
            </div>
            ) : (
            <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="otp">{t('auth.otp_label')}</Label>
                <Input
                    id="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the 6-digit code"
                />
                </div>
                <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full"
                >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.verify_otp_button')}
                </Button>
                <Button
                variant="link"
                className="w-full"
                onClick={() => {
                    setConfirmationResult(null);
                    setOtp('');
                }}
                >
                {t('auth.change_number_button')}
                </Button>
            </div>
            )}
            <div id="recaptcha-container"></div>
        </CardContent>
        </Card>
    </div>
  );
}
