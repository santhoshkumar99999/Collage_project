
"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { initialLeaderboard } from '@/lib/data';
import type { LeaderboardEntry, User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshLeaderboard = () => {
      setIsLoading(true);
    // In a real app with a backend, you'd fetch the latest leaderboard.
    // We use a timeout to simulate a fetch and ensure localStorage is available.
    setTimeout(() => {
        const usersJSON = localStorage.getItem('users');
        if (usersJSON) {
            try {
                const users = JSON.parse(usersJSON) as User[];
                const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
                const newLeaderboard = sortedUsers.map((user, index) => ({
                    rank: index + 1,
                    user: user,
                    xp: user.xp,
                }));
                setLeaderboard(newLeaderboard);
            } catch (e) {
                console.error("Failed to parse users, falling back to initial data.", e);
                setLeaderboard(initialLeaderboard);
            }
        } else {
             // Fallback to initial data if localStorage is empty
            import('@/lib/data').then(mod => {
                const users = mod.users;
                const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);
                const newLeaderboard = sortedUsers.map((user, index) => ({
                    rank: index + 1,
                    user: user,
                    xp: user.xp,
                }));
                setLeaderboard(newLeaderboard);
            });
        }
        setIsLoading(false);
    }, 0);
  }

  useEffect(() => {
    refreshLeaderboard();
    window.addEventListener('storage', refreshLeaderboard);
    return () => {
        window.removeEventListener('storage', refreshLeaderboard);
    }
  }, []);

  return (
    <>
      <PageHeader title="Leaderboard" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">XP</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={`skeleton-${i}`}>
                            <TableCell><Skeleton className="h-6 w-10 rounded-md" /></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-6 w-32 rounded-md" />
                                </div>
                            </TableCell>
                            <TableCell className="text-right"><Skeleton className="h-6 w-16 rounded-md ml-auto" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-6 w-10 rounded-md ml-auto" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    leaderboard.map((entry) => (
                    <TableRow key={entry.rank} className={entry.rank <= 3 ? 'bg-primary/5' : ''}>
                        <TableCell className="font-medium text-lg">
                        <div className="flex items-center gap-2">
                            {entry.rank === 1 && <Trophy className="w-6 h-6 text-yellow-400" />}
                            {entry.rank === 2 && <Trophy className="w-5 h-5 text-gray-400" />}
                            {entry.rank === 3 && <Trophy className="w-4 h-4 text-orange-400" />}
                            {entry.rank}
                        </div>
                        </TableCell>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar>
                            <AvatarImage src={entry.user.avatarUrl} alt={entry.user.name} />
                            <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{entry.user.name}</span>
                        </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{entry.xp.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{entry.user.level}</TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
