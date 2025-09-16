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
import {Loader2} from 'lucide-react';
import {useLanguage} from '@/hooks/use-language';

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

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Phone Number Required',
        description: 'Please enter a valid phone number.',
      });
      return;
    }
    setLoading(true);
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${phoneNumber}.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: error.message,
      });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({
        variant: 'destructive',
        title: 'OTP Required',
        description: 'Please enter the OTP you received.',
      });
      return;
    }
    if (!confirmationResult) {
      toast({
        variant: 'destructive',
        title: 'OTP Not Sent',
        description: 'Please request an OTP first.',
      });
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Login Successful',
        description: 'You have been successfully logged in.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: error.message,
      });
    }
    setLoading(false);
  };

  if (authLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
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
                placeholder="+919876543210"
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
  );
}
