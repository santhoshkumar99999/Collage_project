
"use client";

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
  } from "@/components/ui/sidebar";
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Users, FileText, BookOpen, User, Settings, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { logoutUser } from '@/lib/data';


const adminMenuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/content", label: "Content", icon: FileText },
];

function AdminSidebar() {
    const router = useRouter();
    const handleLogout = () => {
        logoutUser();
        router.push('/login');
        router.refresh();
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {adminMenuItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild tooltip={{ children: item.label }}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <Separator className="my-2" />
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <SidebarMenuButton variant="ghost" className="h-auto p-2 w-full justify-start">
                        <Avatar className="w-8 h-8">
                            {/* In a real app this would be the teacher's avatar */}
                            <AvatarFallback>T</AvatarFallback> 
                        </Avatar>
                        <span className="ml-2">Teacher</span>
                        <Settings className="ml-auto h-5 w-5" />
                    </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" side="top" align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <BookOpen className="mr-2" />
                            Student View
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2" />
                        Logout
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
  )
}
