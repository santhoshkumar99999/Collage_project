
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { translateText, TranslateTextOutput } from '@/ai/flows/translate-flow';
import { Skeleton } from './ui/skeleton';

// In-memory cache to track in-flight requests to prevent duplicate API calls for the same text.
const inFlightRequests = new Map<string, Promise<TranslateTextOutput>>();

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
      if (React.isValidElement(child) && typeof child.props.children === 'string') {
        return acc + child.props.children;
      }
      // Added to handle cases where child.props.children is an array of strings
      if (React.isValidElement(child) && Array.isArray(child.props.children)) {
         return acc + child.props.children.join('');
      }
      return acc;
    }, '');
  }, [children]);


  useEffect(() => {
    if (!originalText || !language || language.toLowerCase() === 'english') {
      setTranslatedText(children);
      return;
    }

    const translate = async () => {
      const cacheKey = `${language}:${originalText}`;
      
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setTranslatedText(cached);
          return;
        }
      } catch (error) {
        // sessionStorage may not be available in all environments (e.g. server-side during pre-rendering)
        console.warn("sessionStorage is not available. Caching is disabled.");
      }


      setIsTranslating(true);
      
      // Check if a request for this exact translation is already in flight.
      let requestPromise = inFlightRequests.get(cacheKey);

      if (!requestPromise) {
        // If not, create a new request and store the promise in the map.
        requestPromise = translateText({ text: originalText, targetLanguage: language });
        inFlightRequests.set(cacheKey, requestPromise);
      }

      try {
        const response = await requestPromise;
        const translation = response.translation;
        try {
          sessionStorage.setItem(cacheKey, translation);
        } catch (error) {
           // Ignore sessionStorage errors on the server
        }
        setTranslatedText(translation);
      } catch (error) {
        console.error("Failed to translate content:", error);
        setTranslatedText(children); // Fallback to original content on error
      } finally {
        // Clean up the in-flight request map once it's settled.
        inFlightRequests.delete(cacheKey);
        setIsTranslating(false);
      }
    };

    translate();
  }, [originalText, language, children]);

  if (isTranslating) {
    // Simple skeleton loader, works best for single lines of text.
    // Adjust width based on text length for a slightly better visual.
    const width = Math.min(150, originalText.length * 8) + 'px';
    return <Skeleton className="h-5 rounded-md" style={{ width }} />;
  }

  return <>{translatedText}</>;
}
