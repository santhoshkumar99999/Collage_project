
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Trophy,
  User,
  Shield,
  LogIn,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { Separator } from "./ui/separator";
import { getUser } from "@/lib/data";
import { useEffect, useState } from "react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  // In a real app, you'd have a proper auth state.
  // We'll simulate it by checking if a user exists.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This check runs on the client side
    const user = getUser();
    setIsAuthenticated(!!user);
  }, [pathname]); // Rerun on path change to simulate login/logout

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {isAuthenticated ? (
            menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
             <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/login">
                        <LogIn />
                        <span>Login</span>
                    </Link>
                </SidebarMenuButton>
             </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: "Teacher Portal" }}>
              <Link href="/admin/login">
                <Shield />
                <span>Teacher Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
