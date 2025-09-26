
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
import { subjects, lessons } from '@/lib/data';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminContentPage() {
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
                  <Input id="title" placeholder="e.g., Introduction to Photosynthesis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
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
                  <Textarea id="description" placeholder="A brief summary of the lesson." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Full Content</Label>
                  <Textarea id="content" rows={6} placeholder="The main content of the lesson." />
                </div>
                <Button className="w-full">
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
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="destructive" size="sm">Delete</Button>
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
