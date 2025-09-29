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
import {Loader2, Flower2} from 'lucide-react';
import {useLanguage} from '@/hooks/use-language';
import { createUserProfile } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { languages } from '@/lib/i18n';

const countryCodes = [
  { value: '+91', label: 'IN (+91)' },
  { value: '+1', label: 'US (+1)' },
  { value: '+44', label: 'UK (+44)' },
  { value: '+61', label: 'AU (+61)' },
  { value: '+81', label: 'JP (+81)' },
];

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const {user, loading: authLoading} = useAuth();
  const router = useRouter();
  const {toast} = useToast();
  const {t, language, setLanguage} = useLanguage();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const checkProfile = async () => {
        try {
            const res = await createUserProfile({ uid: user.uid, phoneNumber: user.phoneNumber! });
            if (res.success) {
                if (res.profileComplete) {
                    router.push('/dashboard');
                } else {
                    router.push('/profile-setup');
                }
            } else {
                // If checking profile fails, default to dashboard but log error
                console.error("Failed to check profile, defaulting to dashboard:", res.error);
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Exception when checking profile:", error);
            router.push('/dashboard');
        }
      };
      checkProfile();
    }
  }, [user, authLoading, router]);

  const handleSendOtp = async () => {
    const fullPhoneNumber = countryCode + phoneNumber;
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

      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, verifier);
      setConfirmationResult(result);
      toast({
        title: t('auth.toast_otp_sent_title'),
        description: t('auth.toast_otp_sent_description', {phoneNumber: fullPhoneNumber}),
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
      await confirmationResult.confirm(otp);
      // The useEffect hook will handle redirection
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
        <div className="animate-pulse">
            <Image src="/logo.png" alt="AgriAssist Logo" width={80} height={80} />
        </div>
      </div>
    );
  }


  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
       <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div className="flex justify-center">
            <Image src="/logo.png" alt="AgriAssist Logo" width={80} height={80} />
        </div>
        <h1 className="text-4xl font-bold font-headline">{t('welcome.title')}</h1>
        <p className="text-muted-foreground">{t('welcome.subtitle')}</p>
        
        <div className="space-y-2 text-left">
            <label htmlFor="language-select">{t('welcome.language_select_label')}</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-full">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {!confirmationResult ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendOtp();
            }}
          >
            <div className="flex gap-2">
               <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px] h-12">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((code) => (
                    <SelectItem key={code.value} value={code.value}>
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder={t('auth.phone_label')}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12 text-left"
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
