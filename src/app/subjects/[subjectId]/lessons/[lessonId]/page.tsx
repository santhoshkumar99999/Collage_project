
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { subjects, lessons } from '@/lib/data';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Gamepad2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LessonPage({ params }: { params: { subjectId: string, lessonId: string } }) {
  const subject = subjects.find((s) => s.id === params.subjectId);
  const lesson = lessons.find((l) => l.id === params.lessonId && l.subjectId === params.subjectId);

  if (!subject || !lesson) {
    notFound();
  }
  
  const placeholder = PlaceHolderImages.find(p => p.id === 'lesson_default');

  return (
    <>
      <PageHeader title={lesson.title}>
         <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download for Offline
        </Button>
      </PageHeader>
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
                  {lesson.content.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
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
    </>
  );
}

export async function generateStaticParams() {
  const params: { subjectId: string; lessonId: string }[] = [];
  subjects.forEach(subject => {
    lessons
      .filter(lesson => lesson.subjectId === subject.id)
      .forEach(lesson => {
        params.push({ subjectId: subject.id, lessonId: lesson.id });
      });
  });
  return params;
}
