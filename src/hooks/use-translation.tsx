
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useLanguage } from './use-language';
import { translateBatch } from '@/ai/flows/translate-batch-flow';

type TranslationCache = {
  [language: string]: {
    [key: string]: string;
  };
};

type TranslationContextType = {
  getTranslation: (key: string) => string;
  isTranslating: (key: string) => boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Debounce helper
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<TranslationCache>({});
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());

  // Function to fetch translations in a batch
  const fetchTranslations = useCallback(async (keysToFetch: string[], targetLanguage: string) => {
    if (keysToFetch.length === 0 || targetLanguage.toLowerCase() === 'english') {
      return;
    }

    try {
      const response = await translateBatch({ texts: keysToFetch, targetLanguage });
      
      setTranslations(prev => {
        const newLangCache = { ...(prev[targetLanguage] || {}) };
        response.translations.forEach((translatedText, index) => {
          const originalKey = keysToFetch[index];
          newLangCache[originalKey] = translatedText;
        });
        return { ...prev, [targetLanguage]: newLangCache };
      });

    } catch (error) {
      console.error("Batch translation failed:", error);
      // Fallback: use original text for failed translations
       setTranslations(prev => {
        const newLangCache = { ...(prev[targetLanguage] || {}) };
        keysToFetch.forEach(key => {
            if (!newLangCache[key]) newLangCache[key] = key;
        });
        return { ...prev, [targetLanguage]: newLangCache };
      });
    } finally {
        // After fetching, remove these keys from the pending set
        setPendingKeys(prev => {
            const next = new Set(prev);
            keysToFetch.forEach(key => next.delete(key));
            return next;
        });
    }
  }, []);

  // Create a debounced version of the fetch function
  const debouncedFetch = useCallback(debounce(fetchTranslations, 500), [fetchTranslations]);

  const getTranslation = useCallback((key: string): string => {
    // If language is English, return original key
    if (language.toLowerCase() === 'english') {
      return key;
    }

    // Check if translation exists in cache
    const cachedTranslation = translations[language]?.[key];
    if (cachedTranslation) {
      return cachedTranslation;
    }

    // If not in cache and not already pending, add to pending queue
    if (!pendingKeys.has(key)) {
        setPendingKeys(prev => new Set(prev).add(key));
    }
    
    // Return original key as fallback until translation is loaded
    return key;
  }, [language, translations, pendingKeys]);


  // Effect to trigger fetch when pending keys change
  useEffect(() => {
    const keysToFetch = Array.from(pendingKeys);

    // Filter out keys that have already been translated for the current language
    const trulyPending = keysToFetch.filter(key => !translations[language]?.[key]);
    
    if (trulyPending.length > 0) {
      debouncedFetch(trulyPending, language);
    }
  }, [pendingKeys, language, translations, debouncedFetch]);


  const isTranslating = useCallback((key: string): boolean => {
    if (language.toLowerCase() === 'english') return false;
    return pendingKeys.has(key) && !translations[language]?.[key];
  }, [pendingKeys, translations, language]);


  return (
    <TranslationContext.Provider value={{ getTranslation, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
