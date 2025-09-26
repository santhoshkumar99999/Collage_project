
import { notFound } from 'next/navigation';
import { quizzes } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { QuizClient } from '@/components/QuizClient';

export default function QuizPage({ params }: { params: { lessonId: string } }) {
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

export async function generateStaticParams() {
    const params: { subjectId: string; lessonId: string; quizId: string }[] = [];
    quizzes.forEach(quiz => {
        // This is a bit of a hack as we don't know subjectId here.
        // In a real app, you'd fetch this from the db.
        // For now we assume a lessonId is unique enough.
        params.push({ subjectId: 'any', lessonId: quiz.lessonId, quizId: quiz.id });
    });
    return params;
}
