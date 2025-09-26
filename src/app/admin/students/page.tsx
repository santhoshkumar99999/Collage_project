
import { PageHeader } from '@/components/PageHeader';
import { users } from '@/lib/data';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AdminStudentsPage() {
  return (
    <>
      <PageHeader title="Student Management" />
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="w-[200px]">Progress to Next Level</TableHead>
                  <TableHead className="text-right">Badges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Level {user.level}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Progress value={(user.xp / user.xpToNextLevel) * 100} className="h-2" />
                            <span className="text-xs text-muted-foreground">{Math.round((user.xp / user.xpToNextLevel) * 100)}%</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">{user.badges.length}</TableCell>
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
