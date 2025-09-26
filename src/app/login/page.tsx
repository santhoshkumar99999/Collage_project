
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UnifiedLoginPage() {
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
                    <Input id="student-password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">
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
                        <Input id="teacher-password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
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
