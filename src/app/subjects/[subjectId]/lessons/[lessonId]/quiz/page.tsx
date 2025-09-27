
"use client";

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getQuizzes, getLessons } from '@/lib/data';
import type { Quiz } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';
import { QuizClient } from '@/components/QuizClient';
import { LoaderCircle } from 'lucide-react';

export function generateStaticParams() {
  const quizzes = getQuizzes();
  const lessons = getLessons();
  return quizzes.map((quiz) => {
    const lesson = lessons.find((l) => l.id === quiz.lessonId);
    return {
      subjectId: lesson?.subjectId,
      lessonId: quiz.lessonId,
    };
  }).filter(params => params.subjectId);
}

export default function QuizPage({ params }: { params: { lessonId: string } }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const quizzes = getQuizzes();
    const currentQuiz = quizzes.find((q) => q.lessonId === params.lessonId);
    if (currentQuiz) {
      setQuiz(currentQuiz);
    }
    setIsLoading(false);
  }, [params.lessonId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!quiz) {
    notFound();
  }

  return (
    <>
      <PageHeader title={quiz.title} />
      <main className="flex-1 p-4 md:p-6">
        <QuizClient quiz={quiz} />
      </main>
    </>
  );
}
