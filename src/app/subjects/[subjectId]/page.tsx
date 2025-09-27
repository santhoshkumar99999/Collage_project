
import { notFound } from 'next/navigation';
import { getSubjects, getLessons, getIconMap } from '@/lib/data';
import { SubjectPageClient } from './SubjectPageClient';
import { Star } from 'lucide-react';
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
  const iconMap = getIconMap();

  const subjectData = subjects.find((s) => s.id === params.subjectId);
  
  if (!subjectData) {
    notFound();
  }
  
  const subjectLessons = lessons.filter((l) => l.subjectId === params.subjectId);
  
  // Re-hydrate the icon component from its name
  const IconComponent = iconMap[subjectData.icon as keyof typeof iconMap] || Star;
  const subject = { ...subjectData, icon: IconComponent } as Subject;

  return <SubjectPageClient subject={subject} subjectLessons={subjectLessons} />;
}
