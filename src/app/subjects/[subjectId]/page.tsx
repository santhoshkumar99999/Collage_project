
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSubjects, getLessons } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Gamepad2 } from 'lucide-react';
import { Translate } from '@/components/Translate';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const subjects = getSubjects();
  const lessons = getLessons();
  const subject = subjects.find((s) => s.id === params.subjectId);
  const subjectLessons = lessons.filter((l) => l.subjectId === params.subjectId);

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

export function generateStaticParams() {
  const subjects = getSubjects();
  return subjects.map((subject) => ({
    subjectId: subject.id,
  }));
}
