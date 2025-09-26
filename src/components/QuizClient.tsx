
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
import { CheckCircle, XCircle, Lightbulb, PartyPopper, Frown } from 'lucide-react';

export function QuizClient({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * quiz.questions.length); // 15 seconds per question

  const currentQuestion = quiz.questions[currentQuestionIndex];

  useEffect(() => {
    if (isFinished) return;
    if (timeLeft === 0) {
      setIsFinished(true);
      toast({
        title: "Time's Up!",
        description: "You ran out of time. Better luck next time!",
        variant: "destructive",
      });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, toast]);

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
      setIsFinished(true);
    }
  };

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
          <CardTitle className="text-3xl font-bold font-headline">Quiz Completed!</CardTitle>
          <CardDescription>You scored {score} out of {quiz.questions.length}.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg">{isSuccess ? "Great job! You've mastered this topic." : "Good effort! Review the lesson and try again."}</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: quiz.questions.length }).map((_, i) => (
                i < score ? <CheckCircle key={i} className="text-primary" /> : <XCircle key={i} className="text-destructive" />
            ))}
          </div>
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <Button onClick={() => router.back()}>Back to Lesson</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1 text-right">{Math.floor(timeLeft / 60)}:{('0' + timeLeft % 60).slice(-2)}</p>
            <Progress value={(currentQuestionIndex / quiz.questions.length) * 100} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        </div>
        <CardTitle className="text-2xl font-headline">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer ?? undefined}>
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-base flex-1 cursor-pointer">{option}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={showHint} disabled={!currentQuestion.hint}>
          <Lightbulb className="mr-2 h-4 w-4" /> Hint
        </Button>
        <Button onClick={handleNext}>
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
}
