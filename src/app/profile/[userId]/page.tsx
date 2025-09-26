
"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { User } from '@/lib/types';
import { badges, users as initialUsers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

function rehydrateUserBadges(user: User): User {
    // Ensure badges are objects with an id, not just strings, before finding the full badge object.
    const validBadges = user.badges?.map(badge => {
        const badgeId = typeof badge === 'string' ? badge : badge.id;
        const fullBadge = badges.find(b => b.id === badgeId);
        return fullBadge;
    }).filter(Boolean) as User['badges']; // filter(Boolean) removes any undefineds if a badge wasn't found

    return {
        ...user,
        badges: validBadges || [],
    };
}


export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This function will only run on the client side.
    const loadUser = () => {
      let foundUser: User | undefined;
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
          try {
              const allUsers: User[] = JSON.parse(storedUsers);
              foundUser = allUsers.find(u => u.id === params.userId);
          } catch(e) {
              console.error("Failed to parse users from localStorage, falling back to initial data.", e);
              foundUser = initialUsers.find(u => u.id === params.userId);
          }
      } else {
          foundUser = initialUsers.find(u => u.id === params.userId);
      }
      
      if (foundUser) {
          setUser(rehydrateUserBadges(foundUser));
      }
      
      setIsLoading(false);
    }
    
    loadUser();
  }, [params.userId]);

  if (isLoading) {
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
              <p className="text-muted-foreground">Level {user.level}</p>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Leveling up through learning!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>XP: {user.xp} / {user.xpToNextLevel}</span>
                    <span>Level {user.level}</span>
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
                <CardTitle>Badges</CardTitle>
                <CardDescription>Achievements unlocked.</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-4">
                    {user.badges.length > 0 ? (
                      user.badges.map((badge) => {
                        const BadgeIcon = badge.icon;
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
                      <p className="text-muted-foreground">No badges earned yet.</p>
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
