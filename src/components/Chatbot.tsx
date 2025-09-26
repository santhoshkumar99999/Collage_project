
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, LoaderCircle } from 'lucide-react';
import { answerQuestion } from '@/ai/flows/lesson-chat-flow';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { currentUser } from '@/lib/data';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot({ lessonContent }: { lessonContent: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerQuestion({
        lessonContent,
        question: input,
        conversationHistory: messages
      });
      const modelMessage: Message = { role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error getting answer from AI:", error);
      const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
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
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
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
                            'rounded-lg px-3 py-2',
                            message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            )}
                        >
                            {message.content}
                        </div>
                        {message.role === 'user' && <Avatar className="w-8 h-8"><AvatarImage src={currentUser.avatarUrl} /><AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback></Avatar>}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start gap-3 text-sm">
                             <Avatar className="w-8 h-8"><AvatarFallback><Bot size={20} /></AvatarFallback></Avatar>
                             <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                                <LoaderCircle className="animate-spin h-4 w-4" />
                             </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="message"
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  autoComplete='off'
                />
                <Button type="submit" size="icon" onClick={handleSend} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
