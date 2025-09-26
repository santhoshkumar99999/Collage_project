
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Gamepad2, LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import imageData from '@/lib/placeholder-images.json';
import { Chatbot } from '@/components/Chatbot';
import { useLanguage } from '@/hooks/use-language';
import { translateText } from '@/ai/flows/translate-flow';
import type { Lesson, Subject } from '@/lib/types';
import { Translate } from './Translate';

export function LessonClient({ lesson, subject }: { lesson: Lesson, subject: Subject }) {
  const { language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState(lesson.content);
  const [translatedDescription, setTranslatedDescription] = useState(lesson.description);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!lesson || !language || language === 'English') {
      setTranslatedContent(lesson?.content || '');
      setTranslatedDescription(lesson?.description || '');
      return;
    }

    const translateLessonContent = async () => {
      setIsTranslating(true);
      try {
        const [contentResponse, descriptionResponse] = await Promise.all([
            translateText({ text: lesson.content, targetLanguage: language }),
            translateText({ text: lesson.description, targetLanguage: language })
        ]);
        setTranslatedContent(contentResponse.translation);
        setTranslatedDescription(descriptionResponse.translation);
      } catch (error) {
        console.error("Failed to translate content:", error);
        setTranslatedContent(lesson.content); // Fallback to original content on error
        setTranslatedDescription(lesson.description);
      } finally {
        setIsTranslating(false);
      }
    };

    translateLessonContent();
  }, [lesson, language]);
  
  const placeholder = imageData.placeholderImages.find(p => p.id === 'lesson_default');

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
                    <p className="text-lg text-muted-foreground">{translatedDescription}</p>
                    <div className="mt-4 text-base leading-relaxed">
                    {isTranslating ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                        <LoaderCircle className="animate-spin h-5 w-5" />
                        <span><Translate>Translating to</Translate> {language}...</span>
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
                    <Translate>Ready to test your knowledge? Start Quiz!</Translate>
                </Link>
                </Button>
            </div>
            </div>
        </main>
        <Chatbot context={translatedContent || lesson.content} flowType="lesson" />
    </>
  );
}
