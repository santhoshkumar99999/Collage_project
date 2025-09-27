
"use client";

import * as React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from './ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

export function Translate({ children }: { children: React.ReactNode }) {
  const { getTranslation, isTranslating, registerKeys } = useTranslation();
  const { language, isInitialized } = useLanguage();

  const originalText = React.useMemo(() => {
    return React.Children.toArray(children).reduce((acc: string, child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return acc + child;
      }
      return acc;
    }, '');
  }, [children]);
  
  React.useEffect(() => {
    if (originalText && isInitialized && language.toLowerCase() !== 'english') {
      registerKeys([originalText]);
    }
  }, [originalText, registerKeys, language, isInitialized]);

  if (!originalText || !isInitialized) {
    return <>{children}</>;
  }
  
  if (language.toLowerCase() === 'english') {
    return <>{originalText}</>;
  }

  const translatedText = getTranslation(originalText);

  if (isTranslating(originalText)) {
      const width = Math.min(150, originalText.length * 8) + 'px';
      return <Skeleton className="h-5" style={{ width }} />;
  }

  return <>{translatedText || originalText}</>;
}
