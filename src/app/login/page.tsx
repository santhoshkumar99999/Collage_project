
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { loginUserAction } from "@/lib/data";
import { LoaderCircle } from "lucide-react";

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  const handleLogin = (role: 'student' | 'teacher') => {
    setIsLoading(true);
    const email = role === 'student' ? studentEmail : teacherEmail;
    const password = role === 'student' ? studentPassword : teacherPassword;

    try {
      const result = loginUserAction({ email, password });
      if (result.success && result.userId) {
        
        toast({
          title: "Login Successful",
          description: `Welcome back${role === 'teacher' ? ', Teacher' : ''}!`,
        });

        if (role === 'teacher') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Tabs defaultValue="student" className="w-full max-w-sm mx-auto">
        <Card>
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <CardTitle className="text-2xl font-headline">Vidyagram Portal</CardTitle>
                <CardDescription>
                    Sign in to continue to your dashboard.
                </CardDescription>
                 <TabsList className="grid w-full grid-cols-2 mt-4">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="student">
                <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                        id="student-email"
                        type="email"
                        placeholder="student@example.com"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="student-password">Password</Label>
                        <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                        >
                        Forgot your password?
                        </Link>
                    </div>
                    <Input 
                        id="student-password" 
                        type="password" 
                        required 
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                    />
                    </div>
                    <Button onClick={() => handleLogin('student')} className="w-full" disabled={isLoading}>
                      {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                      Student Login
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="underline">
                    Sign up
                    </Link>
                </div>
                </CardContent>
            </TabsContent>
            <TabsContent value="teacher">
                 <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="teacher-email">Email</Label>
                        <Input
                            id="teacher-email"
                            type="email"
                            placeholder="teacher@example.com"
                            required
                             value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="teacher-password">Password</Label>
                            <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                            >
                            Forgot your password?
                            </Link>
                        </div>
                        <Input 
                            id="teacher-password" 
                            type="password" 
                            required 
                            value={teacherPassword}
                            onChange={(e) => setTeacherPassword(e.target.value)}
                        />
                        </div>
                        <Button onClick={() => handleLogin('teacher')} className="w-full" disabled={isLoading}>
                            {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Teacher Login
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link href="/admin/signup" className="underline">
                        Sign up
                        </Link>
                    </div>
                    </CardContent>
            </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
