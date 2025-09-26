
import { PageHeader } from '@/components/PageHeader';
import { leaderboard } from '@/lib/data';
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

export default function LeaderboardPage() {
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
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
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
                    <TableCell className="text-right font-semibold">{entry.score.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{entry.user.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
