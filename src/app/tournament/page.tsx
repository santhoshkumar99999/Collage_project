
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { subjects } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import imageData from '@/lib/placeholder-images.json';
import { Translate } from '@/components/Translate';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Swords } from 'lucide-react';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import { QuizClient } from '@/components/QuizClient';
import type { Quiz } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


export default function TournamentPage() {
    const { toast } = useToast();
    const [selectedSubject, setSelectedSubject] = useState<typeof subjects[0] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
    
    const handleSelectSubject = async (subject: typeof subjects[0]) => {
        setSelectedSubject(subject);
        setIsLoading(true);
        setGeneratedQuiz(null);

        try {
            const response = await generateQuiz({ subject: subject.name, numberOfQuestions: 10 });
            if (response.quiz && response.quiz.questions.length > 0) {
                setGeneratedQuiz(response.quiz);
            } else {
                throw new Error("AI failed to generate a valid quiz.");
            }
        } catch (error) {
            console.error("Failed to generate quiz:", error);
            toast({
                title: "Error Generating Quiz",
                description: "Could not create a tournament quiz. Please try again.",
                variant: "destructive",
            });
            setSelectedSubject(null); // Reset selection on error
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
             <>
                <PageHeader title="Weekly Tournament" />
                <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center">
                    <LoaderCircle className="w-16 h-16 animate-spin text-primary mb-4" />
                    <h2 className="text-2xl font-bold font-headline mb-2">Generating Your Tournament...</h2>
                    <p className="text-muted-foreground">The AI is creating a unique set of questions for the {selectedSubject?.name} tournament.</p>
                </main>
            </>
        )
    }

    if (generatedQuiz) {
        return (
            <>
                <PageHeader title={`${selectedSubject?.name} Tournament`} />
                <main className="flex-1 p-4 md:p-6">
                    <QuizClient quiz={generatedQuiz} isTournament={true} />
                </main>
            </>
        )
    }

  return (
    <>
      <PageHeader title="Weekly Tournament" />
       <main className="flex-1 p-4 md:p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-headline">Choose Your Arena</h2>
                <p className="text-muted-foreground text-lg">Select a subject to start your AI-generated tournament.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => {
                const placeholder = imageData.placeholderImages.find(p => p.id === subject.imageId);
                return (
                <Card key={subject.id} className="h-full overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl cursor-pointer" onClick={() => handleSelectSubject(subject)}>
                    <CardContent className="p-0 relative">
                        {placeholder && (
                        <Image
                            src={placeholder.imageUrl}
                            alt={subject.name}
                            width={600}
                            height={400}
                            data-ai-hint={placeholder.imageHint}
                            className="rounded-t-lg object-cover aspect-[3/2]"
                        />
                        )}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                         <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-headline">
                                <subject.icon className="w-6 h-6" />
                                <Translate>{subject.name}</Translate>
                            </h3>
                         </div>
                    </CardContent>
                    <CardHeader>
                        <CardDescription><Translate>{subject.description}</Translate></CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button className="w-full">
                            <Swords className="mr-2" />
                            Start Tournament
                        </Button>
                    </CardContent>
                </Card>
                )
            })}
            </div>
      </main>
    </>
  );
}
