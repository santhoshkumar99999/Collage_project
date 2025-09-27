
import { getSubjects, getLessons, getBadges } from '@/lib/data';
import { ProfilePageClient } from './ProfilePageClient';


// This function is no longer needed for a client-rendered page.
// export function generateStaticParams() {
//   return [];
// }


export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  // These are server-safe and can be fetched at build time.
  const allSubjects = getSubjects();
  const allLessons = getLessons();
  const allBadges = getBadges();

  return (
    <ProfilePageClient 
      userId={params.userId}
      allSubjects={allSubjects}
      allLessons={allLessons}
      allBadges={allBadges}
    />
  );
}
