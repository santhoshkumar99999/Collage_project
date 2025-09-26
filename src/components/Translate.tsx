
"use client";

import * as React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Skeleton } from './ui/skeleton';

export function Translate({ children }: { children: React.ReactNode }) {
  const { getTranslation, isTranslating } = useTranslation();

  // Convert children to a flat string to use as a key.
  const originalText = React.useMemo(() => {
    return React.Children.toArray(children).reduce((acc: string, child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return acc + child;
      }
      return acc;
    }, '');
  }, [children]);

  if (!originalText) {
    return <>{children}</>;
  }

  const translatedText = getTranslation(originalText);

  if (isTranslating(originalText)) {
      const width = Math.min(150, originalText.length * 8) + 'px';
      return <Skeleton className="h-5 rounded-md inline-block" style={{ width }} />;
  }

  return <>{translatedText}</>;
}
