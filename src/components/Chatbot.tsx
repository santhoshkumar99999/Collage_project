
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, LoaderCircle, PlayCircle, Languages, Volume2 } from 'lucide-react';
import { answerQuestion } from '@/ai/flows/lesson-chat-flow';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getUser } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSelector } from './LanguageSelector';


interface Message {
  role: 'user' | 'model';
  content: string;
  audioUrl?: string;
  isAudioLoading?: boolean;
}

export function Chatbot({ lessonContent }: { lessonContent: string }) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isBotLoading, setIsBotLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUser = getUser();
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('language')) {
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
  
  const generateAndPlayAudio = async (text: string, messageIndex: number) => {
    setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, isAudioLoading: true } : msg));
    try {
      const audioResponse = await textToSpeech(text);
      const audioUrl = audioResponse.media;
      setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, audioUrl, isAudioLoading: false } : msg));

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }

    } catch (error) {
      console.error("Error generating speech:", error);
      setMessages(prev => prev.map((msg, idx) => idx === messageIndex ? { ...msg, isAudioLoading: false } : msg));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsBotLoading(true);

    try {
      const response = await answerQuestion({
        lessonContent,
        question: input,
        conversationHistory: messages.map(({ audioUrl, isAudioLoading, ...rest }) => rest), // Don't send audio data to chat model
        language: language,
      });
      const modelMessage: Message = { role: 'model', content: response.answer, isAudioLoading: false };
      const newMessages = [...messages, userMessage, modelMessage];
      const newIndex = newMessages.length - 1; // Index of the new model message

      setMessages(newMessages);
      
      await generateAndPlayAudio(response.answer, newIndex);


    } catch (error) {
      console.error("Error getting answer from AI:", error);
      const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
    }
  };


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
                <Bot /> Lesson Assistant
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
                                    Hello! How can I help you with this lesson?
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
                <CardFooter>
                <div className="flex w-full items-center space-x-2">
                    <Input
                    id="message"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isBotLoading}
                    autoComplete='off'
                    />
                    <Button type="submit" size="icon" onClick={handleSend} disabled={isBotLoading}>
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
