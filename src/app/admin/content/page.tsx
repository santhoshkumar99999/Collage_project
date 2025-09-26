
"use client";

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
import { subjects, lessons as initialLessons } from '@/lib/data';
import type { Lesson } from '@/lib/types';
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


export default function AdminContentPage() {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const handleAddLesson = () => {
    if (!title || !subjectId || !description || !content) {
        toast({
            title: 'Missing Fields',
            description: 'Please fill out all fields to add a new lesson.',
            variant: 'destructive',
        });
      return;
    }

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      subjectId,
      title,
      description,
      content,
    };

    setLessons([newLesson, ...lessons]);

    // Reset form
    setTitle('');
    setSubjectId('');
    setDescription('');
    setContent('');

    toast({
        title: 'Lesson Added',
        description: `"${title}" has been successfully added.`,
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(l => l.id !== lessonId));
    toast({
        title: 'Lesson Deleted',
        description: 'The lesson has been removed.',
    });
  }

  return (
    <>
      <PageHeader title="Content Management" />
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subjectId} onValueChange={setSubjectId}>
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Full Content</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    placeholder="The main content of the lesson."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
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
                                    <Badge variant="outline">{subject?.name}</Badge>
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
