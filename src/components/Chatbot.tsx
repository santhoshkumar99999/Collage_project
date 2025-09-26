
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, LoaderCircle, PlayCircle, Languages, Volume2, Mic, MicOff, Paperclip, XCircle } from 'lucide-react';
import { answerQuestion as answerLessonQuestion } from '@/ai/flows/lesson-chat-flow';
import { answerQuizQuestion } from '@/ai/flows/quiz-chat-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getUser } from '@/lib/data';
import type { User } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSelector } from './LanguageSelector';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { audioCache } from '@/services/audio-cache';


interface Message {
  role: 'user' | 'model';
  content: string;
  audioUrl?: string;
  isAudioLoading?: boolean;
}

interface ChatbotProps {
    context: string;
    flowType: 'lesson' | 'quiz';
}

export function Chatbot({ context, flowType }: ChatbotProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  useEffect(() => {
    setCurrentUser(getUser());
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setHasSelectedLanguage(true);
    }
  }, []);
  
  useEffect(() => {
    if (language) {
      setHasSelectedLanguage(true);
    }
  }, [language]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (transcript) {
        setInput(transcript);
    }
  }, [transcript]);
  
  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
    }
  };
  
  const generateAndPlayAudio = async (text: string, messageIndex: number) => {
    const cacheKey = `${language}:${text}`;
    if (audioCache.has(cacheKey)) {
        const audioUrl = audioCache.get(cacheKey)!;
        setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, audioUrl, isAudioLoading: false } : msg));
        playAudio(audioUrl);
        return;
    }

    setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, isAudioLoading: true } : msg));
    try {
      const audioResponse = await textToSpeech(text);
      const audioUrl = audioResponse.media;
      audioCache.set(cacheKey, audioUrl);
      setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, audioUrl, isAudioLoading: false } : msg));
      playAudio(audioUrl);

    } catch (error) {
      console.error("Error generating speech:", error);
      setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, isAudioLoading: false } : msg));
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !imageDataUri) || !context) return;
    if (isListening) stopListening();

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsBotLoading(true);

    try {
      let response;
      const conversationHistory = messages.map(({ audioUrl, isAudioLoading, ...rest }) => rest);
      
      if (flowType === 'quiz') {
        response = await answerQuizQuestion({
          quizQuestionContext: context,
          question: input,
          conversationHistory,
          language: language,
          imageDataUri: imageDataUri || undefined,
        });
      } else {
         response = await answerLessonQuestion({
            lessonContent: context,
            question: input,
            conversationHistory,
            language: language,
            imageDataUri: imageDataUri || undefined,
        });
      }

      const modelMessage: Message = { role: 'model', content: response.answer, isAudioLoading: false };
      const newMessages = [...messages, userMessage, modelMessage];

      setMessages(newMessages);

    } catch (error) {
      console.error("Error getting answer from AI:", error);
      const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotLoading(false);
      setImageDataUri(null); // Clear image after sending
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageDataUri(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }


  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          <span className="sr-only">Toggle Chatbot</span>
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot /> {flowType === 'quiz' ? 'Quiz Helper' : 'Lesson Assistant'}
              </CardTitle>
               <LanguageSelector />
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                { !hasSelectedLanguage ? (
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                        <Languages className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Select a Language</h3>
                        <p className="text-muted-foreground mb-4">Please choose your preferred language to start the chat.</p>
                        <div className="w-[200px]">
                           <LanguageSelector />
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="flex justify-start gap-3 text-sm">
                                <Avatar className="w-8 h-8"><AvatarFallback><Bot size={20} /></AvatarFallback></Avatar>
                                <div className='rounded-lg px-3 py-2 bg-muted'>
                                    Hello! How can I help you with this {flowType}?
                                </div>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div
                            key={index}
                            className={cn(
                                'flex gap-3 text-sm',
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                            >
                            {message.role === 'model' && <Avatar className="w-8 h-8"><AvatarFallback><Bot size={20} /></AvatarFallback></Avatar>}
                            <div
                                className={cn(
                                'rounded-lg px-3 py-2 max-w-[80%]',
                                message.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                )}
                            >
                                {message.content}
                                {message.role === 'model' && (
                                    <div className="mt-2">
                                    {message.isAudioLoading && <LoaderCircle className="animate-spin h-4 w-4 text-muted-foreground" />}
                                    {message.audioUrl && !message.isAudioLoading && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => playAudio(message.audioUrl!)}>
                                            <PlayCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {!message.audioUrl && !message.isAudioLoading && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => generateAndPlayAudio(message.content, index)}>
                                            <Volume2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    </div>
                                )}
                            </div>
                            {message.role === 'user' && currentUser && <Avatar className="w-8 h-8"><AvatarImage src={currentUser.avatarUrl} /><AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback></Avatar>}
                            </div>
                        ))}
                        {isBotLoading && (
                            <div className="flex justify-start gap-3 text-sm">
                                <Avatar className="w-8 h-8"><AvatarFallback><Bot size={20} /></AvatarFallback></Avatar>
                                <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                                    <LoaderCircle className="animate-spin h-4 w-4" />
                                </div>
                            </div>
                        )}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
            {hasSelectedLanguage && (
                <CardFooter className="flex flex-col items-stretch gap-2">
                {imageDataUri && (
                    <div className="relative w-full h-24 rounded-md overflow-hidden border">
                        <Image src={imageDataUri} alt="Uploaded preview" layout="fill" objectFit="cover" />
                        <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={removeImage}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <div className="flex w-full items-center space-x-2">
                    <Input
                    id="message"
                    placeholder={isListening ? "Listening..." : "Ask a question..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isBotLoading || !context}
                    autoComplete='off'
                    />
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <Button type="button" size="icon" variant="outline" onClick={handleAttachmentClick}>
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Attach image</span>
                    </Button>
                     {isSupported && (
                        <Button type="button" size="icon" onClick={handleMicClick} variant={isListening ? 'destructive' : 'outline'}>
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
                        </Button>
                    )}
                    <Button type="submit" size="icon" onClick={handleSend} disabled={isBotLoading || !context}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                    </Button>
                </div>
                </CardFooter>
            )}
          </Card>
        </div>
      )}
       <audio ref={audioRef} className="hidden" />
    </>
  );
}
