
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz, QuizQuestion, Badge as BadgeType, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Lightbulb, PartyPopper, Frown, Award, Volume2, LoaderCircle, Star } from 'lucide-react';
import { updateUser, getUser, getLessons, getAuthenticatedUserId, getBadges, getIconMap } from '@/lib/data';
import { Translate } from './Translate';
import { textToSpeech } from '@/ai/flows/tts-flow';
import { useLanguage } from '@/hooks/use-language';
import { translateText } from '@/ai/flows/translate-flow';
import { Chatbot } from './Chatbot';
import { audioCache } from '@/services/audio-cache';
import { cn } from '@/lib/utils';

interface QuizClientProps {
    quiz: Quiz;
    isTournament?: boolean;
}

export function QuizClient({ quiz, isTournament = false }: QuizClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isAnswered, setIsAnswered] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    const userId = getAuthenticatedUserId();
    if (userId) {
        const user = getUser(userId);
        setCurrentUser(user);
    } else {
        router.push('/login');
    }
  }, [router]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const chatbotContext = useMemo(() => {
    if (!currentQuestion) return '';
    return `Question: "${currentQuestion.question}"\nOptions: ${currentQuestion.options.join(', ')}\nCorrect Answer: ${currentQuestion.correctAnswer}`;
  }, [currentQuestion]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast({ title: 'Please select an answer.', variant: 'destructive' });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }
    
    setIsAnswered(true);
  };
  
  const handleNextQuestion = () => {
    setIsAnswered(false);
    setAnswerStatus(null);
    setSelectedAnswer(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinish();
    }
  }

  const handleFinish = (finalScore = score) => {
    if(!currentUser) return;
    const lessons = getLessons();
    const allBadges = getBadges();
    const iconMap = getIconMap();

    const xpGained = finalScore * 10;
    let newXp = currentUser.xp + xpGained;
    let newLevel = currentUser.level;
    let newBadgeIds = [...(currentUser.badgeIds || [])];
    let leveledUp = false;
    let newCompletedLessons = [...(currentUser.completedLessons || [])];
    let newCompletedTournaments = [...(currentUser.completedTournaments || [])];

    if (isTournament) {
        const lesson = lessons.find(l => l.id === quiz.lessonId);
        const subjectId = lesson?.subjectId || quiz.id.split('-')[2]; // Fallback for generated quizzes
        if (subjectId && !newCompletedTournaments.includes(subjectId)) {
            newCompletedTournaments.push(subjectId);
        }
    } else if (!newCompletedLessons.includes(quiz.lessonId)) {
        newCompletedLessons.push(quiz.lessonId);
    }


    while (newXp >= currentUser.xpToNextLevel) {
      newXp -= currentUser.xpToNextLevel;
      newLevel++;
      leveledUp = true;
    }

    // Add Scholar badge if they get a perfect score
    const hasScholarBadge = newBadgeIds.some(b => b === 'scholar');
    if(finalScore === quiz.questions.length && !hasScholarBadge){
      const scholarBadge = allBadges.find(b => b.id === 'scholar');
      if (scholarBadge) {
        newBadgeIds.push(scholarBadge.id);
        const BadgeIcon = iconMap[scholarBadge.icon as keyof typeof iconMap] || Award;
        toast({
          title: "Badge Unlocked!",
          description: `You've earned the ${scholarBadge.name} badge!`,
          action: (
            <div className="p-2 rounded-full bg-accent">
                <BadgeIcon className={`w-8 h-8 ${scholarBadge.color}`} />
            </div>
          )
        });
      }
    }
    
    updateUser({ 
      ...currentUser, 
      xp: newXp, 
      level: newLevel,
      badgeIds: newBadgeIds,
      completedLessons: newCompletedLessons,
      completedTournaments: newCompletedTournaments,
    });

    toast({
        title: `Quiz Complete! +${xpGained} XP`,
        description: leveledUp ? `Congratulations! You've reached Level ${newLevel}!` : `You scored ${finalScore}/${quiz.questions.length}.`,
    });

    setIsFinished(true);
  }

  const showHint = async () => {
    if (!currentQuestion.hint) {
      toast({ title: 'No hint available for this question.' });
      return;
    }
    
    setIsHintLoading(true);
    try {
        let hintText = currentQuestion.hint;
        if (language !== 'English') {
            const translationResponse = await translateText({ text: hintText, targetLanguage: language });
            hintText = translationResponse.translation;
        }
        toast({ title: 'Hint', description: hintText });
    } catch (error) {
        console.error("Error translating hint:", error);
        toast({ title: 'Could not load hint.', variant: 'destructive' });
    } finally {
        setIsHintLoading(false);
    }
  };

  const handlePlayAudio = async (text: string) => {
    setIsAudioLoading(true);
    try {
        let textToSpeak = text;
        if (language !== 'English') {
            const translationResponse = await translateText({ text, targetLanguage: language });
            textToSpeak = translationResponse.translation;
        }
        
        const cacheKey = `${language}:${textToSpeak}`;
        if (audioCache.has(cacheKey)) {
            if (audioRef.current) {
                audioRef.current.src = audioCache.get(cacheKey)!;
                audioRef.current.play();
            }
            setIsAudioLoading(false); // finish loading
            return;
        }

        const { media } = await textToSpeech({ prompt: textToSpeak, speakers: 1 });
        audioCache.set(cacheKey, media);

        if (audioRef.current) {
            audioRef.current.src = media;
            audioRef.current.play();
        }
    } catch (error: any) {
        if (error.message === 'RATE_LIMIT_EXCEEDED') {
          toast({
            title: "Audio Limit Reached",
            description: "You've exceeded the daily quota for audio playback. The feature will be available again tomorrow.",
            variant: "destructive"
          });
        } else if (error.message === 'SERVICE_UNAVAILABLE') {
            toast({
              title: "Audio Service Unavailable",
              description: "The text-to-speech service is temporarily down. Please try again later.",
              variant: "destructive"
            });
        } else {
            console.error("Error generating speech:", error);
            toast({ title: "Could not play audio", variant: "destructive" });
        }
    } finally {
        setIsAudioLoading(false);
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
           {isTournament ? (
                <Button onClick={() => window.location.reload()}><Translate>Play Another Tournament</Translate></Button>
           ) : (
                <Button onClick={() => router.back()}><Translate>Back to Lesson</Translate></Button>
           )}
          <Button variant="outline" onClick={() => router.push('/')}><Translate>Back to Dashboard</Translate></Button>
        </CardFooter>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="items-center">
                <Frown className="w-16 h-16 text-muted-foreground" />
                <CardTitle className="text-3xl font-bold font-headline">Quiz Error</CardTitle>
                <CardDescription>Could not load the quiz questions.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
                 <Button onClick={() => router.push('/')}><Translate>Back to Dashboard</Translate></Button>
            </CardFooter>
        </Card>
    )
  }

  const getOptionClass = (option: string) => {
    if (!isAnswered) return '';
    const isCorrect = option === currentQuestion.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) return 'bg-green-100 dark:bg-green-900 border-green-500';
    if (isSelected && !isCorrect) return 'bg-red-100 dark:bg-red-900 border-red-500';
    return 'opacity-60';
  }

  return (
    <>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="mb-4">
            <div className="text-sm text-muted-foreground mt-2"><Translate>Question</Translate> {currentQuestionIndex + 1} <Translate>of</Translate> {quiz.questions.length}</div>
            <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="w-full mt-1" />
        </div>
        <div className="flex items-start gap-2">
            <CardTitle className="text-2xl font-headline flex-1"><Translate>{currentQuestion.question}</Translate></CardTitle>
             <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePlayAudio(currentQuestion.question)}
              disabled={isAudioLoading}
              className="h-8 w-8 flex-shrink-0"
            >
              {isAudioLoading ? <LoaderCircle className="animate-spin" /> : <Volume2 />}
              <span className="sr-only">Read question</span>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer ?? undefined} disabled={isAnswered}>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;
                return (
                  <Label 
                    key={`${currentQuestion.id}-option-${index}`} 
                    htmlFor={`${currentQuestion.id}-option-${index}`}
                    className={cn(
                        "flex items-center space-x-4 p-4 rounded-lg border transition-all cursor-pointer",
                        "hover:bg-accent/50",
                        getOptionClass(option)
                    )}
                  >
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} className="shrink-0" />
                    <span className="text-base flex-1"><Translate>{option}</Translate></span>
                    {isAnswered && isCorrect && <CheckCircle className="text-green-600" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-600" />}
                  </Label>
                )
            })}
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={showHint} disabled={!currentQuestion.hint || isHintLoading}>
          {isHintLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          <Translate>Hint</Translate>
        </Button>
        <Button onClick={isAnswered ? handleNextQuestion : handleSubmitAnswer}>
            {isAnswered
            ? currentQuestionIndex === quiz.questions.length - 1
                ? <Translate>Finish</Translate>
                : <Translate>Next</Translate>
            : <Translate>Submit</Translate>}
        </Button>
      </CardFooter>
      <audio ref={audioRef} className="hidden" onEnded={() => setIsAudioLoading(false)} />
    </Card>
    <Chatbot context={chatbotContext} flowType="quiz" />
    </>
  );
}
