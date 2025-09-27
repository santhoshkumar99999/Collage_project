
import { notFound } from 'next/navigation';
import { getSubjects, getLessons } from '@/lib/data';
import { SubjectPageClient } from './SubjectPageClient';
import type { Subject } from '@/lib/types';


export function generateStaticParams() {
  const subjects = getSubjects();
  return subjects.map((subject) => ({
    subjectId: subject.id,
  }));
}

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const subjects = getSubjects();
  const lessons = getLessons();

  const subjectData = subjects.find((s) => s.id === params.subjectId);
  
  if (!subjectData) {
    notFound();
  }
  
  const subjectLessons = lessons.filter((l) => l.subjectId === params.subjectId);

  // Pass the raw, serializable subject data to the client component.
  // The client will handle resolving the icon component.
  return <SubjectPageClient subject={subjectData as Omit<Subject, 'icon'>} subjectLessons={subjectLessons} />;
}
