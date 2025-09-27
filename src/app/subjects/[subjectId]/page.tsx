
"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSubjects, getLessons } from '@/lib/data';
import type { Subject, Lesson } from '@/lib/types';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Gamepad2 } from 'lucide-react';
import { Translate } from '@/components/Translate';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [subjectLessons, setSubjectLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allSubjects = getSubjects();
    const allLessons = getLessons();
    const currentSubject = allSubjects.find((s) => s.id === params.subjectId) || null;
    
    if (currentSubject) {
      setSubject(currentSubject);
      setSubjectLessons(allLessons.filter((l) => l.subjectId === params.subjectId));
    }
    setIsLoading(false);
  }, [params.subjectId]);

  if (isLoading) {
    // You can add a loading skeleton here if you want
    return <PageHeader title="Loading..." />;
  }

  if (!subject) {
    notFound();
  }

  return (
    <>
      <PageHeader title={subject.name} />
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 font-headline"><Translate>Available Lessons</Translate></h2>
          {subjectLessons.length > 0 ? (
            subjectLessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <CardTitle><Translate>{lesson.title}</Translate></CardTitle>
                  <CardDescription><Translate>{lesson.description}</Translate></CardDescription>
                </CardHeader>
                <CardFooter className="gap-2">
                  <Button asChild>
                    <Link href={`/subjects/${subject.id}/lessons/${lesson.id}`}>
                      <BookOpen />
                      <Translate>Start Lesson</Translate>
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={`/subjects/${subject.id}/lessons/${lesson.id}/quiz`}>
                      <Gamepad2 />
                      <Translate>Start Quiz</Translate>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground"><Translate>No lessons available for this subject yet. Check back soon!</Translate></p>
          )}
        </div>
      </main>
    </>
  );
}
