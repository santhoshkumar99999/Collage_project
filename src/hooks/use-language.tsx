
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  supportedLanguages: { value: string; label: string }[];
  isInitialized: boolean;
};

const supportedLanguages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'हिंदी' },
    { value: 'Telugu', label: 'తెలుగు' },
    { value: 'Kannada', label: 'ಕನ್ನಡ' },
    { value: 'Tamil', label: 'தமிழ்' },
    { value: 'Odia', label: 'ଓଡିଆ' },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('English');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && supportedLanguages.some(l => l.value === storedLanguage)) {
      setLanguageState(storedLanguage);
      document.documentElement.lang = supportedLanguages.find(l => l.value === storedLanguage)?.label.substring(0,2).toLowerCase() || 'en';
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = useCallback((newLanguage: string) => {
    if (supportedLanguages.some(l => l.value === newLanguage)) {
      localStorage.setItem('language', newLanguage);
      setLanguageState(newLanguage);
      document.documentElement.lang = supportedLanguages.find(l => l.value === newLanguage)?.label.substring(0,2).toLowerCase() || 'en';
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, supportedLanguages, isInitialized }}>
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
