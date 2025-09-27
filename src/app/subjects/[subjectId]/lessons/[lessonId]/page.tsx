
import { notFound } from 'next/navigation';
import { getSubjects, getLessons } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LessonClient } from '@/components/LessonClient';
import type { Subject } from '@/lib/types';

export function generateStaticParams() {
  const lessons = getLessons();
  return lessons.map((lesson) => ({
    subjectId: lesson.subjectId,
    lessonId: lesson.id,
  }));
}

export default async function LessonPage({ params }: { params: { subjectId: string, lessonId: string } }) {
  const subjects = getSubjects();
  const lessons = getLessons();

  const subject = subjects.find((s) => s.id === params.subjectId);
  const lesson = lessons.find((l) => l.id === params.lessonId && l.subjectId === params.subjectId);

  if (!subject || !lesson) {
    notFound();
  }
  
  // The 'icon' prop is a component which cannot be passed to a Client Component.
  // We only pass the serializable parts of the subject.
  const { icon, ...serializableSubject } = subject;

  return (
    <>
      <PageHeader title={lesson.title}>
         <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download for Offline
        </Button>
      </PageHeader>
      <LessonClient lesson={lesson} subject={serializableSubject as Omit<Subject, 'icon'>} />
    </>
  );
}
