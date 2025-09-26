
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
  Settings,
  LogOut,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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
  const currentUser = getUser();

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
        {isAuthenticated && currentUser && (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton variant="ghost" className="h-auto p-2 w-full justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{currentUser.name}</span>
                 <Settings className="ml-auto h-5 w-5" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href="/admin/login">
                  <Shield className="mr-2" />
                  Teacher Portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                 <Link href="/login">
                  <LogOut className="mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
