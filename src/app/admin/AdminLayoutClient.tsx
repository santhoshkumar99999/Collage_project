
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
import { LayoutDashboard, Users, FileText, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

const adminMenuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/content", label: "Content", icon: FileText },
];

function AdminSidebar() {
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
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: "Student View" }}>
                            <Link href="/">
                                <BookOpen />
                                <span>Student View</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
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
  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/signup');
  
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
