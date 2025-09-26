
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
  MessageSquareHeart,
  Swords,
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
import { getUser, logoutUser } from "@/lib/data";
import { useEffect, useState } from "react";
import type { User as UserType } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FeedbackDialog } from "./FeedbackDialog";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tournament", label: "Tournament", icon: Swords },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const refreshUser = () => {
    setCurrentUser(getUser());
  }

  useEffect(() => {
    refreshUser();
    // Also listen for storage changes to update the user
    window.addEventListener('storage', refreshUser);
    return () => {
        window.removeEventListener('storage', refreshUser);
    }
  }, [pathname]);

  const handleLogout = () => {
    logoutUser();
    refreshUser();
    // No need to push to /login, the component will re-render to show the login button
  };


  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {currentUser ? (
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
        {currentUser && (
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
              <FeedbackDialog>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <MessageSquareHeart className="mr-2" />
                    Feedback & Support
                </DropdownMenuItem>
              </FeedbackDialog>
              <DropdownMenuItem asChild>
                 <Link href="/login">
                  <Shield className="mr-2" />
                  Teacher Portal
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleLogout} asChild>
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
