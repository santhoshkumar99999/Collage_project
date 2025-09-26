"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { translateText } from '@/ai/flows/translate-flow';
import { Skeleton } from './ui/skeleton';

export function Translate({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<React.ReactNode>(children);
  const [isTranslating, setIsTranslating] = useState(false);

  const originalText = React.useMemo(() => {
    // Convert children to a flat string for the translation API
    return React.Children.toArray(children).reduce((acc: string, child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return acc + child;
      }
      // Note: This won't handle nested components well, but it's a start.
      if (React.isValidElement(child) && typeof child.props.children === 'string') {
        return acc + child.props.children;
      }
      return acc;
    }, '');
  }, [children]);


  useEffect(() => {
    if (!originalText || !language || language === 'English') {
      setTranslatedText(children);
      return;
    }

    const translate = async () => {
      setIsTranslating(true);
      // Simple caching mechanism to avoid re-translating the same text
      const cacheKey = `${language}:${originalText}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
          setTranslatedText(cached);
          setIsTranslating(false);
          return;
      }

      try {
        const response = await translateText({ text: originalText, targetLanguage: language });
        setTranslatedText(response.translation);
        sessionStorage.setItem(cacheKey, response.translation);
      } catch (error) {
        console.error("Failed to translate content:", error);
        setTranslatedText(children); // Fallback to original content
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [originalText, language, children]);

  if (isTranslating) {
    // Simple skeleton loader, works best for single lines of text
    return <Skeleton className="h-5 w-3/4" />;
  }

  return <>{translatedText}</>;
}
