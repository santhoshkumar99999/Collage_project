
import { notFound } from 'next/navigation';
import { getQuizzes, getLessons } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { QuizClient } from '@/components/QuizClient';

export function generateStaticParams() {
  const quizzes = getQuizzes();
  const lessons = getLessons();
  
  return quizzes.map((quiz) => {
    const lesson = lessons.find((l) => l.id === quiz.lessonId);
    return {
      subjectId: lesson?.subjectId,
      lessonId: quiz.lessonId,
    };
  }).filter(params => params.subjectId && params.lessonId) as { subjectId: string; lessonId: string; }[];
}

export default function QuizPage({ params }: { params: { lessonId: string, subjectId: string } }) {
  const quizzes = getQuizzes();
  const quiz = quizzes.find((q) => q.lessonId === params.lessonId);

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
