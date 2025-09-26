
"use client";

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.startsWith('/admin');

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
         <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                  {children}
              </SidebarInset>
          </SidebarProvider>
    );
}
