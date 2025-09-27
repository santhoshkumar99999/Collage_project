
import { notFound } from 'next/navigation';
import { getSubjects, getLessons } from '@/lib/data';
import { SubjectPageClient } from './SubjectPageClient';

export function generateStaticParams() {
  const subjects = getSubjects();
  return subjects.map((subject) => ({
    subjectId: subject.id,
  }));
}

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const subjects = getSubjects();
  const lessons = getLessons();
  const subject = subjects.find((s) => s.id === params.subjectId);
  
  if (!subject) {
    notFound();
  }
  
  const subjectLessons = lessons.filter((l) => l.subjectId === params.subjectId);

  return <SubjectPageClient subject={subject} subjectLessons={subjectLessons} />;
}
