
// This file is used for ambient type declarations.

// Extend window object to include speech recognition APIs for browsers that support it.
interface Window extends Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
