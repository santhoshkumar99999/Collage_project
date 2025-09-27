
"use client";

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubjects, getLessons } from '@/lib/data';
import type { Subject, Lesson } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LessonClient } from '@/components/LessonClient';
import { LoaderCircle } from 'lucide-react';

export function generateStaticParams() {
  const lessons = getLessons();
  return lessons.map((lesson) => ({
    subjectId: lesson.subjectId,
    lessonId: lesson.id,
  }));
}

export default function LessonPage({ params }: { params: { subjectId: string, lessonId: string } }) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subjects = getSubjects();
    const lessons = getLessons();

    const currentSubject = subjects.find((s) => s.id === params.subjectId);
    const currentLesson = lessons.find((l) => l.id === params.lessonId && l.subjectId === params.subjectId);
    
    if (currentSubject) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { icon, ...serializableSubject } = currentSubject;
        setSubject(serializableSubject as Subject);
    }
    
    if(currentLesson) {
        setLesson(currentLesson);
    }
    
    setIsLoading(false);
  }, [params.subjectId, params.lessonId]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!subject || !lesson) {
    notFound();
  }

  return (
    <>
      <PageHeader title={lesson.title}>
         <Button variant="outline" disabled>
            <Download className="mr-2 h-4 w-4" />
            Download for Offline
        </Button>
      </PageHeader>
      <LessonClient lesson={lesson} subject={subject} />
    </>
  );
}
