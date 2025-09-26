
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { subjects, lessons } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Gamepad2 } from 'lucide-react';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
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
          <h2 className="text-2xl font-semibold mb-4 font-headline">Available Lessons</h2>
          {subjectLessons.length > 0 ? (
            subjectLessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardFooter className="gap-2">
                  <Button asChild>
                    <Link href={`/subjects/${subject.id}/lessons/${lesson.id}`}>
                      <BookOpen />
                      Start Lesson
                    </Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href={`/subjects/${subject.id}/lessons/${lesson.id}/quiz`}>
                      <Gamepad2 />
                      Start Quiz
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No lessons available for this subject yet. Check back soon!</p>
          )}
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  return subjects.map((subject) => ({
    subjectId: subject.id,
  }));
}
