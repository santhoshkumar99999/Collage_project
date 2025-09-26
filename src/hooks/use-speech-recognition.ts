
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useLanguage } from './use-language';

// This store manages the speech recognition instance and its state.
// It's defined outside the hook to be a singleton.
let recognition: SpeechRecognition | null = null;
let state = {
  isListening: false,
  transcript: '',
};
const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const getSnapshot = () => state;

const notify = () => listeners.forEach(cb => cb());

const start = (lang: string) => {
  if (state.isListening || !recognition) return;
  
  recognition.lang = lang;
  recognition.start();
  state = { ...state, isListening: true };
  notify();
};

const stop = () => {
  if (!state.isListening || !recognition) return;
  
  recognition.stop();
  state = { ...state, isListening: false };
  notify();
};


export const useSpeechRecognition = () => {
  const { language } = useLanguage();
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
              state = { ...state, transcript: state.transcript + finalTranscript };
              notify();
          }
        };

        recognition.onstart = () => {
          state = { ...state, isListening: true };
          notify();
        };

        recognition.onend = () => {
          // Keep listening even after a pause
          if (state.isListening) {
            recognition?.start();
          }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            state = { ...state, isListening: false };
            notify();
        }
      }
    }
  }, []);
  
  // Map friendly names to BCP 47 language codes for speech recognition
  const getLangCode = (lang: string) => {
    const map: { [key: string]: string } = {
        'English': 'en-US',
        'Hindi': 'hi-IN',
        'Telugu': 'te-IN',
        'Kannada': 'kn-IN',
        'Tamil': 'ta-IN',
        'Odia': 'or-IN',
    };
    return map[lang] || 'en-US';
  }

  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const startListening = useCallback(() => {
    const langCode = getLangCode(language);
    start(langCode);
  }, [language]);

  const stopListening = useCallback(() => {
    stop();
  }, []);

  return { ...store, startListening, stopListening, isSupported };
};
