

"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle, LoaderCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { getLessons, addSubject, getSubjects } from '@/lib/data';
import type { Lesson, Subject } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateSubjectDescription } from '@/ai/flows/generate-subject-description-flow';


export default function AdminContentPage() {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for new lesson
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubjectId, setLessonSubjectId] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonContent, setLessonContent] = useState('');

  // State for new subject
  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  
  const refreshData = async () => {
    const [currentSubjects, currentLessons] = await Promise.all([getSubjects(), getLessons()]);
    setSubjects(currentSubjects);
    setLessons(currentLessons);
  }

  useEffect(() => {
    refreshData();
  }, []);


  const handleAddLesson = () => {
    if (!lessonTitle || !lessonSubjectId || !lessonDescription || !lessonContent) {
        toast({
            title: 'Missing Fields',
            description: 'Please fill out all fields to add a new lesson.',
            variant: 'destructive',
        });
      return;
    }

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      subjectId: lessonSubjectId,
      title: lessonTitle,
      description: lessonDescription,
      content: lessonContent,
    };

    setLessons([newLesson, ...lessons]);

    // Reset form
    setLessonTitle('');
    setLessonSubjectId('');
    setLessonDescription('');
    setLessonContent('');

    toast({
        title: 'Lesson Added',
        description: `"${lessonTitle}" has been successfully added.`,
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(l => l.id !== lessonId));
    toast({
        title: 'Lesson Deleted',
        description: 'The lesson has been removed.',
    });
  }

  const handleAddSubject = async () => {
      if (!subjectName) {
          toast({
              title: 'Missing Fields',
              description: 'Please provide a name for the new subject.',
              variant: 'destructive',
          });
          return;
      }

      let descriptionToSave = subjectDescription;

      if (!subjectDescription.trim()) {
        setIsGenerating(true);
        try {
            const result = await generateSubjectDescription({ subjectName });
            descriptionToSave = result.description;
             toast({
                title: 'Description Generated',
                description: 'AI has created a description for you.',
            });
        } catch (error) {
            console.error("Failed to generate description:", error);
            toast({
                title: 'AI Error',
                description: 'Could not generate a description. Please write one manually.',
                variant: 'destructive',
            });
            setIsGenerating(false);
            return;
        } finally {
            setIsGenerating(false);
        }
      }

      await addSubject({ name: subjectName, description: descriptionToSave });
      toast({
          title: 'Subject Added',
          description: `"${subjectName}" has been successfully added.`,
      });
      setSubjectName('');
      setSubjectDescription('');
      refreshData(); // Re-fetch subjects from DB
  }

  return (
    <>
      <PageHeader title="Content Management" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
             <Card>
              <CardHeader>
                <CardTitle>Add New Subject</CardTitle>
                <CardDescription>Create a new subject category for lessons. If you leave the description blank, AI will write one for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input 
                    id="subject-name"
                    placeholder="e.g., History"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="subject-description">Subject Description</Label>
                  <Textarea
                    id="subject-description"
                    placeholder="Optional. AI will generate this if left empty."
                    value={subjectDescription}
                    onChange={(e) => setSubjectDescription(e.target.value)}
                  />
                </div>
                 <Button className="w-full" onClick={handleAddSubject} disabled={isGenerating}>
                  {isGenerating ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" /> }
                  {isGenerating ? "Generating Description..." : "Add Subject"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Lesson</CardTitle>
                <CardDescription>Fill out the form to add a new lesson to the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input 
                    id="title"
                    placeholder="e.g., Introduction to Photosynthesis"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={lessonSubjectId} onValueChange={setLessonSubjectId}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief summary of the lesson."
                    value={lessonDescription}
                    onChange={(e) => setLessonDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Full Content</Label>
                  <Textarea
                    id="content"
                    placeholder="The main content of the lesson."
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddLesson}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
             <Card>
                <CardHeader>
                    <CardTitle>Existing Lessons</CardTitle>
                    <CardDescription>A list of all lessons currently on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lessons.map((lesson) => {
                            const subject = subjects.find(s => s.id === lesson.subjectId);
                            return (
                                <TableRow key={lesson.id}>
                                <TableCell className="font-medium">{lesson.title}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{subject?.name || 'N/A'}</Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" disabled>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteLesson(lesson.id)}>Delete</Button>
                                </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    </Table>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </>
  );
}
