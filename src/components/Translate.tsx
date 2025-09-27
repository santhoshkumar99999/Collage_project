
"use client";

import * as React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from './ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

export function Translate({ children }: { children: React.ReactNode }) {
  const { getTranslation, isTranslating, registerKeys } = useTranslation();
  const { language } = useLanguage();

  const originalText = React.useMemo(() => {
    return React.Children.toArray(children).reduce((acc: string, child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return acc + child;
      }
      return acc;
    }, '');
  }, [children]);
  
  React.useEffect(() => {
    if (originalText && language !== 'English') {
      registerKeys([originalText]);
    }
  }, [originalText, registerKeys, language]);

  if (!originalText) {
    return <>{children}</>;
  }
  
  if (language === 'English') {
    return <>{originalText}</>;
  }

  const translatedText = getTranslation(originalText);

  if (isTranslating(originalText)) {
      const width = Math.min(150, originalText.length * 8) + 'px';
      return <Skeleton className="h-5" style={{ width }} />;
  }

  return <>{translatedText}</>;
}
