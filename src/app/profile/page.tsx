
"use client";

import { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import { PageHeader } from '@/components/PageHeader';
import { getUser, updateUser, User } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X, QrCode } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function ProfilePage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
      setProfileUrl(`${window.location.origin}/profile/${user.id}`);
    }
  }, []);

  const refreshUser = () => {
    const user = getUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
    }
  };

  useEffect(() => {
    window.addEventListener('storage', refreshUser);
    return () => {
      window.removeEventListener('storage', refreshUser);
    }
  }, []);


  if (!currentUser) {
    return null; // Or a loading spinner
  }

  const xpPercentage = (currentUser.xp / currentUser.xpToNextLevel) * 100;

  const handleSave = () => {
    if (!name.trim()) {
        toast({ title: 'Name cannot be empty', variant: 'destructive' });
        return;
    }
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name: name };
    updateUser(updatedUser);
    setCurrentUser(updatedUser);
    setIsEditing(false);
    toast({
        title: "Profile Updated",
        description: "Your name has been successfully changed.",
    });
  };

  const handleCancel = () => {
    if (!currentUser) return;
    setName(currentUser.name);
    setIsEditing(false);
  }

  return (
    <>
      <PageHeader title="My Profile">
        <div className="flex items-center gap-2">
         <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <QrCode className="h-4 w-4" />
                <span className="sr-only">Show QR Code</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Share Your Progress</DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-white rounded-lg">
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={profileUrl}
                    viewBox={`0 0 256 256`}
                />
              </div>
            </DialogContent>
          </Dialog>
        {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
        ) : (
            <div className="flex gap-2">
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
            </div>
        )}
        </div>
      </PageHeader>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="flex flex-col items-center p-6 text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="text-3xl">{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                 <div className="w-full space-y-2 mt-2">
                    <Label htmlFor="name" className="sr-only">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="text-center text-lg"/>
                 </div>
              ) : (
                <h2 className="text-2xl font-bold font-headline">{currentUser.name}</h2>
              )}
              <p className="text-muted-foreground">Level {currentUser.level}</p>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Progress</CardTitle>
                <CardDescription>Keep learning to level up!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>XP: {currentUser.xp} / {currentUser.xpToNextLevel}</span>
                    <span>Level {currentUser.level}</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <Progress value={xpPercentage} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currentUser.xpToNextLevel - currentUser.xp} XP to next level</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>My Badges</CardTitle>
                <CardDescription>Achievements you have unlocked.</CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-4">
                    {currentUser.badges.length > 0 ? (
                      currentUser.badges.map((badge) => {
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
                      <p className="text-muted-foreground">No badges earned yet. Keep playing!</p>
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
