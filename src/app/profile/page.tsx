
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from "react-qr-code";
import { PageHeader } from '@/components/PageHeader';
import { getUser, updateUser, getAuthenticatedUserId, getLessons, getSubjects, getBadges } from '@/lib/data';
import { User, Subject, Lesson, Badge as BadgeType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit, Save, X, QrCode, LoaderCircle, BookOpen, Calculator, FlaskConical, Atom, Dna, Bot, Star, BrainCircuit, Rocket, Target, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Translate } from '@/components/Translate';

const badgeIconMap = {
    Star,
    BookOpen,
    BrainCircuit,
    Rocket,
    Target,
    Zap
};

export default function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refreshUser = () => {
      setIsLoading(true);
      const userId = getAuthenticatedUserId();
      if (userId) {
        const user = getUser(userId);
        if (user) {
          setCurrentUser(user);
          setName(user.name);
          setProfileUrl(`${window.location.origin}/profile/${user.id}`);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };
    refreshUser();
  }, [router]);

  useEffect(() => {
    const subjectsData = getSubjects();
    const lessonsData = getLessons();
    const badgesData = getBadges();

     const badgesWithIcons = badgesData.map(badge => ({
        ...badge,
        icon: badgeIconMap[badge.icon as keyof typeof badgeIconMap] || Star
    }));
    setSubjects(subjectsData);
    setLessons(lessonsData);
    setAllBadges(badgesWithIcons);
  }, []);


  const learnedSubjects = currentUser ? 
    subjects.filter(subject => 
        lessons.some(lesson => 
            currentUser.completedLessons.includes(lesson.id) && lesson.subjectId === subject.id
        )
    ) : [];
  
  const userBadges: BadgeType[] = currentUser ? currentUser.badgeIds.map(badgeId => allBadges.find(b => b.id === badgeId)).filter(b => b !== undefined) as BadgeType[] : [];


  if (isLoading || !currentUser) {
    return (
        <div className="flex items-center justify-center h-full">
            <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
        </div>
    );
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
    const userId = getAuthenticatedUserId();
    if(userId) {
      const user = getUser(userId);
       if (user) {
          setCurrentUser(user);
          setName(user.name);
        }
    }
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
                <DialogTitle><Translate>Share Your Progress</Translate></DialogTitle>
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
                <Edit className="mr-2 h-4 w-4" /> <Translate>Edit Profile</Translate>
            </Button>
        ) : (
            <div className="flex gap-2">
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" /> <Translate>Save</Translate>
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" /> <Translate>Cancel</Translate>
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
              <p className="text-muted-foreground"><Translate>Level</Translate> {currentUser.level}</p>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle><Translate>My Progress</Translate></CardTitle>
                <CardDescription><Translate>Keep learning to level up!</Translate></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>XP: {currentUser.xp} / {currentUser.xpToNextLevel}</span>
                    <span><Translate>Level</Translate> {currentUser.level}</span>
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
                <CardTitle><Translate>Learned Subjects</Translate></CardTitle>
                <CardDescription><Translate>Subjects where you have completed quizzes.</Translate></CardDescription>
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
                                        <p className="font-semibold"><Translate>{subject.name}</Translate></p>
                                    </TooltipContent>
                                </Tooltip>
                                )
                            })
                        ) : (
                            <p className="text-muted-foreground"><Translate>Complete a quiz to see your first learned subject!</Translate></p>
                        )}
                    </div>
                </TooltipProvider>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle><Translate>My Badges</Translate></CardTitle>
                <CardDescription><Translate>Achievements you have unlocked.</Translate></CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="flex flex-wrap gap-4">
                    {userBadges.length > 0 ? (
                      userBadges.map((badge) => {
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
                            <p className="font-semibold"><Translate>{badge.name}</Translate></p>
                          </TooltipContent>
                        </Tooltip>
                      )})
                    ) : (
                      <p className="text-muted-foreground"><Translate>No badges earned yet. Keep playing!</Translate></p>
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
