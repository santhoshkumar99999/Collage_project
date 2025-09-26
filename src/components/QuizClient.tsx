
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz, QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Lightbulb, PartyPopper, Frown, Award } from 'lucide-react';
import { updateUser, getUser, badges, User, lessons } from '@/lib/data';
import { Translate } from './Translate';

export function QuizClient({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Redirect to login if no user is found
      router.push('/login');
    }
  }, [router]);

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({ title: 'Please select an answer.', variant: 'destructive' });
      return;
    }

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setSelectedAnswer(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinish(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  const handleFinish = (finalScore = score) => {
    if(!currentUser) return;
    const xpGained = finalScore * 10;
    let newXp = currentUser.xp + xpGained;
    let newLevel = currentUser.level;
    let newBadges = [...currentUser.badges];
    let leveledUp = false;
    let newCompletedLessons = [...(currentUser.completedLessons || [])];

    if (!newCompletedLessons.includes(quiz.lessonId)) {
      newCompletedLessons.push(quiz.lessonId);
    }

    while (newXp >= currentUser.xpToNextLevel) {
      newXp -= currentUser.xpToNextLevel;
      newLevel++;
      leveledUp = true;
    }

    // Add Scholar badge if they get a perfect score
    const hasScholarBadge = currentUser.badges.some(b => b.id === 'scholar');
    if(finalScore === quiz.questions.length && !hasScholarBadge){
      const scholarBadge = badges.find(b => b.id === 'scholar');
      if (scholarBadge) {
        newBadges.push(scholarBadge);
        toast({
          title: "Badge Unlocked!",
          description: `You've earned the ${scholarBadge.name} badge!`,
          action: (
            <div className="p-2 rounded-full bg-accent">
                <Award className={`w-8 h-8 ${scholarBadge.color}`} />
            </div>
          )
        });
      }
    }
    
    updateUser({ 
      ...currentUser, 
      xp: newXp, 
      level: newLevel,
      badges: newBadges,
      completedLessons: newCompletedLessons
    });

    toast({
        title: `Quiz Complete! +${xpGained} XP`,
        description: leveledUp ? `Congratulations! You've reached Level ${newLevel}!` : `You scored ${finalScore}/${quiz.questions.length}.`,
    });

    setIsFinished(true);
  }

  const showHint = () => {
    if (currentQuestion.hint) {
      toast({ title: 'Hint', description: currentQuestion.hint });
    } else {
      toast({ title: 'No hint available for this question.' });
    }
  };
  
  if (isFinished) {
    const isSuccess = score / quiz.questions.length >= 0.7;
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="items-center">
            {isSuccess ? <PartyPopper className="w-16 h-16 text-yellow-400" /> : <Frown className="w-16 h-16 text-muted-foreground" />}
          <CardTitle className="text-3xl font-bold font-headline"><Translate>Quiz Completed!</Translate></CardTitle>
          <CardDescription><Translate>You scored</Translate> {score} <Translate>out of</Translate> {quiz.questions.length}.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">{isSuccess ? <Translate>Great job! You've mastered this topic.</Translate> : <Translate>Good effort! Review the lesson and try again.</Translate>}</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: quiz.questions.length }).map((_, i) => (
                i < score ? <CheckCircle key={i} className="text-primary" /> : <XCircle key={i} className="text-destructive" />
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <Button onClick={() => router.back()}><Translate>Back to Lesson</Translate></Button>
          <Button variant="outline" onClick={() => window.location.reload()}><Translate>Try Again</Translate></Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="mb-4">
            <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2"><Translate>Question</Translate> {currentQuestionIndex + 1} <Translate>of</Translate> {quiz.questions.length}</p>
        </div>
        <CardTitle className="text-2xl font-headline"><Translate>{currentQuestion.question}</Translate></CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer ?? undefined}>
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-base flex-1 cursor-pointer"><Translate>{option}</Translate></Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={showHint} disabled={!currentQuestion.hint}>
          <Lightbulb className="mr-2 h-4 w-4" /> <Translate>Hint</Translate>
        </Button>
        <Button onClick={handleNext}>
          {currentQuestionIndex === quiz.questions.length - 1 ? <Translate>Finish</Translate> : <Translate>Next</Translate>}
        </Button>
      </CardFooter>
    </Card>
  );
}
