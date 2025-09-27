
import { notFound } from 'next/navigation';
import { getSubjects, getLessons, getUsers, getBadges } from '@/lib/data';
import { ProfilePageClient } from './ProfilePageClient';


// This function is required for static export to work with dynamic routes.
// It tells Next.js which user profiles to pre-render at build time.
export function generateStaticParams() {
  // In a real app, this might fetch all user IDs from a database.
  // For this local setup, we can't get users on the server, so we'll
  // return an empty array and rely on fallback rendering or client-side rendering.
  // Since we are using client-side rendering for this page now, we can leave this empty.
  return [];
}


export default function PublicProfilePage({ params }: { params: { userId: string } }) {
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
