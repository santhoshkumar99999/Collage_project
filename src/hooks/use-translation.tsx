
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
  getTranslation: (key: string) => string | null;
  isTranslating: (key: string) => boolean;
  registerKeys: (keys: string[]) => void;
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
       setPendingKeys(prev => {
        const next = new Set(prev);
        keysToFetch.forEach(key => next.delete(key));
        return next;
      });
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
       setTranslations(prev => {
        const newLangCache = { ...(prev[targetLanguage] || {}) };
        keysToFetch.forEach(key => {
            if (!newLangCache[key]) newLangCache[key] = key; // Fallback to original
        });
        return { ...prev, [targetLanguage]: newLangCache };
      });
    } finally {
        setPendingKeys(prev => {
            const next = new Set(prev);
            keysToFetch.forEach(key => next.delete(key));
            return next;
        });
    }
  }, []);

  const debouncedFetch = useCallback(debounce(fetchTranslations, 500), [fetchTranslations]);

  useEffect(() => {
    const keysToFetch = Array.from(pendingKeys);
    if (keysToFetch.length > 0) {
      debouncedFetch(keysToFetch, language);
    }
  }, [pendingKeys, language, debouncedFetch]);

  const registerKeys = useCallback((keys: string[]) => {
    setPendingKeys(prev => {
        const newKeys = new Set(prev);
        let added = false;
        keys.forEach(key => {
            if (language.toLowerCase() !== 'english' && !translations[language]?.[key] && !newKeys.has(key)) {
                newKeys.add(key);
                added = true;
            }
        });
        return added ? newKeys : prev;
    });
  }, [language, translations]);

  const getTranslation = useCallback((key: string): string | null => {
    if (language.toLowerCase() === 'english') {
      return key;
    }
    return translations[language]?.[key] || null;
  }, [language, translations]);

  const isTranslating = useCallback((key: string): boolean => {
    if (language.toLowerCase() === 'english') return false;
    return translations[language]?.[key] === undefined && pendingKeys.has(key);
  }, [pendingKeys, translations, language]);


  return (
    <TranslationContext.Provider value={{ getTranslation, isTranslating, registerKeys }}>
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
