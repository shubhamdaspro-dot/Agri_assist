'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import bn from '@/locales/bn.json';
import te from '@/locales/te.json';
import mr from '@/locales/mr.json';
import { useIsClient } from './use-is-client';

const translations: Record<string, any> = { en, hi, bn, te, mr };

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, substitutions?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      const savedLanguage = localStorage.getItem('agriassist_language');
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage);
      }
    }
  }, [isClient]);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      if (isClient) {
        localStorage.setItem('agriassist_language', lang);
      }
    }
  };

  const t = useCallback((key: string, substitutions?: Record<string, string | number>): string => {
    const getTranslation = (lang: string) => {
        const keys = key.split('.');
        let result = translations[lang];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) return undefined;
        }
        return result;
    };
    
    let translated = getTranslation(language);

    if (translated === undefined) {
        // Fallback to English if translation is missing
        translated = getTranslation('en');
    }

    if (typeof translated !== 'string') {
        console.warn(`Translation for key '${key}' not found.`);
        return key;
    }

    if (substitutions) {
        Object.keys(substitutions).forEach(subKey => {
            const regex = new RegExp(`{${subKey}}`, 'g');
            translated = (translated as string).replace(regex, String(substitutions[subKey]));
        });
    }

    return translated;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
