'use client';

import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { languages } from '@/lib/i18n';
import Image from 'next/image';

export default function WelcomePage() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="AgriAssist Logo" width={60} height={60} />
          </div>
          <CardTitle className="text-3xl font-headline">{t('welcome.title')}</CardTitle>
          <CardDescription>{t('welcome.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language-select">{t('welcome.language_select_label')}</Label>
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
          <Button size="lg" className="w-full" onClick={() => router.push('/dashboard')}>
            {t('welcome.start_button')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
