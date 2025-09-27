
"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { User, Subject, Badge as BadgeType, Lesson } from '@/lib/types';
import { getUser, getIconMap } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { Translate } from '@/components/Translate';
import { Star } from 'lucide-react';

interface ProfilePageClientProps {
    userId: string;
    allSubjects: Omit<Subject, 'icon'>[];
    allLessons: Lesson[];
    allBadges: Omit<BadgeType, 'icon'>[];
}

export function ProfilePageClient({ userId, allSubjects, allLessons, allBadges }: ProfilePageClientProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iconMap, setIconMap] = useState<any>(null);
  
  useEffect(() => {
    setIsLoading(true);
    const userData = getUser(userId);
    const icons = getIconMap();

    if (userData) {
        setUser(userData);
    }
    
    setIconMap(icons);
    setIsLoading(false);
  }, [userId]);


  const learnedSubjects: Subject[] = (user && iconMap) ? 
    allSubjects.filter(subject => 
        allLessons.some(lesson => 
            user.completedLessons.includes(lesson.id) && lesson.subjectId === subject.id
        )
    ).map(s => ({...s, icon: iconMap[s.icon as keyof typeof iconMap] || Star }))
    : [];

  const tournamentSubjects: Subject[] = (user?.completedTournaments && iconMap) ? 
    allSubjects.filter(subject => user.completedTournaments!.includes(subject.id))
    .map(s => ({...s, icon: iconMap[s.icon as keyof typeof iconMap] || Star }))
    : [];
    
  const userBadges: BadgeType[] = (user && user.badgeIds && iconMap) ? user.badgeIds.map(badgeId => {
      const badge = allBadges.find(b => b.id === badgeId);
      if (!badge) return null;
      return {...badge, icon: iconMap[badge.icon as keyof typeof iconMap] || Star };
  }).filter(b => b !== null) as BadgeType[] : [];


  if (isLoading || !iconMap) {
    return (
        <>
            <PageHeader title="Student Profile" />
            <main className="flex-1 p-4 md:p-6">
                 <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </main>
        </>
    );
  }

  if (!user) {
    notFound();
  }

  const xpPercentage = (user.xp / user.xpToNextLevel) * 100;

  return (
    <>
      <PageHeader title={`${user.name}'s Profile`} />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="flex flex-col items-center p-6 text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
              <div className="text-muted-foreground"><Translate>Level</Translate> {user.level}</div>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><Translate>Progress</Translate></CardTitle>
                <CardDescription><Translate>Leveling up through learning!</Translate></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>XP: {user.xp} / {user.xpToNextLevel}</span>
                    <span><Translate>Level</Translate> {user.level}</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Progress value={xpPercentage} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.xpToNextLevel - user.xp} XP to next level</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><Translate>Learned Subjects</Translate></CardTitle>
                <CardDescription><Translate>Subjects where quizzes have been completed.</Translate></CardDescription>
              </CardHeader>
              <CardContent>
                 <TooltipProvider>
                    <div className="flex flex-wrap gap-4">
                        {learnedSubjects.length > 0 ? (
                            learnedSubjects.map((subject) => {
                                const SubjectIcon = subject.icon;
                                return (
                                <Tooltip key={subject.id}>
                                    <TooltipTrigger>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 rounded-full bg-secondary">
                                                {SubjectIcon && <SubjectIcon className="w-8 h-8 text-secondary-foreground" />}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{subject.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                                )
                            })
                        ) : (
                            <div className="text-muted-foreground"><Translate>No subjects learned yet.</Translate></div>
                        )}
                    </div>
                </TooltipProvider>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle><Translate>Tournament Subjects</Translate></CardTitle>
                <CardDescription><Translate>Subjects where tournament quizzes have been attempted.</Translate></CardDescription>
              </CardHeader>
              <CardContent>
                 <TooltipProvider>
                    <div className="flex flex-wrap gap-4">
                        {tournamentSubjects.length > 0 ? (
                            tournamentSubjects.map((subject) => {
                                const SubjectIcon = subject.icon;
                                return (
                                <Tooltip key={subject.id}>
                                    <TooltipTrigger>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 rounded-full bg-primary/10">
                                                {SubjectIcon && <SubjectIcon className="w-8 h-8 text-primary" />}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{subject.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                                )
                            })
                        ) : (
                            <div className="text-muted-foreground"><Translate>No tournaments attempted yet.</Translate></div>
                        )}
                    </div>
                </TooltipProvider>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><Translate>Badges</Translate></CardTitle>
                <CardDescription><Translate>Achievements unlocked.</Translate></CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-4">
                    {userBadges.length > 0 ? (
                      userBadges.map((badge) => {
                        const BadgeIcon = badge.icon as React.ElementType;
                        return (
                        <Tooltip key={badge.id}>
                          <TooltipTrigger>
                            <div className="flex flex-col items-center gap-2">
                              <div className={`p-3 rounded-full bg-accent`}>
                                <BadgeIcon className={`w-8 h-8 ${badge.color}`} />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{badge.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      )})
                    ) : (
                      <div className="text-muted-foreground"><Translate>No badges earned yet.</Translate></div>
                    )}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
