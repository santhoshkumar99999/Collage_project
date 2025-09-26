
"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { User } from '@/lib/types';
import { badges } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StudentQrScanner } from '@/components/StudentQrScanner';


export default function AdminStudentsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        try {
            const parsedUsers = JSON.parse(storedUsers).map((user: User) => ({
                ...user,
                badges: user.badges.map(badge => {
                    const fullBadge = badges.find(b => b.id === badge.id);
                    return fullBadge || badge;
                })
            }));
            setUsers(parsedUsers);
        } catch (e) {
            console.error("Failed to parse users from localStorage", e);
             // Fallback to initial data if localStorage is empty or corrupted
            import('@/lib/data').then(mod => {
                const initialUsers = [
                        mod.users.find(u => u.id === 'user-1'),
                        mod.users.find(u => u.id === 'user-2'),
                        mod.users.find(u => u.id === 'user-3'),
                ].filter(Boolean) as User[];
                setUsers(initialUsers);
                localStorage.setItem('users', JSON.stringify(initialUsers));
            });
        }
      } else {
        // Fallback to initial data if localStorage is empty
        import('@/lib/data').then(mod => {
           const initialUsers = [
                mod.users.find(u => u.id === 'user-1'),
                mod.users.find(u => u.id === 'user-2'),
                mod.users.find(u => u.id === 'user-3'),
           ].filter(Boolean) as User[];
           setUsers(initialUsers);
           localStorage.setItem('users', JSON.stringify(initialUsers));
        });
      }
    }
  }, []);

  return (
    <>
      <PageHeader title="Student Management">
        <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
          <DialogTrigger asChild>
            <Button>
              <QrCode className="mr-2 h-4 w-4" />
              Scan Student QR
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan Student QR Code</DialogTitle>
            </DialogHeader>
            <StudentQrScanner onScanSuccess={() => setIsScannerOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>
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
