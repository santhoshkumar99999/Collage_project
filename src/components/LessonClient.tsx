
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Gamepad2, LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Chatbot } from '@/components/Chatbot';
import { useLanguage } from '@/hooks/use-language';
import { translateText } from '@/ai/flows/translate-flow';
import type { Lesson, Subject } from '@/lib/types';

export function LessonClient({ lesson, subject }: { lesson: Lesson, subject: Subject }) {
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState(lesson.content);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!lesson || !language || language === 'English') {
      setTranslatedContent(lesson?.content || '');
      return;
    }

    const translateLessonContent = async () => {
      setIsTranslating(true);
      try {
        const response = await translateText({ text: lesson.content, targetLanguage: language });
        setTranslatedContent(response.translation);
      } catch (error) {
        console.error("Failed to translate content:", error);
        setTranslatedContent(lesson.content); // Fallback to original content on error
      } finally {
        setIsTranslating(false);
      }
    };

    translateLessonContent();
  }, [lesson, language]);
  
  const placeholder = PlaceHolderImages.find(p => p.id === 'lesson_default');

  return (
    <>
        <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
            {placeholder && (
                <Card className="mb-6">
                <CardContent className="p-0">
                    <Image
                    src={placeholder.imageUrl}
                    alt={lesson.title}
                    width={800}
                    height={400}
                    data-ai-hint={placeholder.imageHint}
                    className="rounded-lg object-cover aspect-[2/1]"
                    />
                </CardContent>
                </Card>
            )}
            <Card>
                <CardContent className="p-6">
                <article className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-muted-foreground">{lesson.description}</p>
                    <div className="mt-4 text-base leading-relaxed">
                    {isTranslating ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                        <LoaderCircle className="animate-spin h-5 w-5" />
                        <span>Translating to {language}...</span>
                        </div>
                    ) : (
                        translatedContent.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)
                    )}
                    </div>
                </article>
                </CardContent>
            </Card>
            <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                <Link href={`/subjects/${subject.id}/lessons/${lesson.id}/quiz`}>
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Ready to test your knowledge? Start Quiz!
                </Link>
                </Button>
            </div>
            </div>
        </main>
        <Chatbot lessonContent={translatedContent || lesson.content} />
    </>
  );
}
