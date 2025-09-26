
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  supportedLanguages: { value: string; label: string }[];
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

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && supportedLanguages.some(l => l.value === storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: string) => {
    if (supportedLanguages.some(l => l.value === newLanguage)) {
      localStorage.setItem('language', newLanguage);
      setLanguageState(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, supportedLanguages }}>
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
