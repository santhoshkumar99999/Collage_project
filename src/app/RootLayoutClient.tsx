
"use client";

import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useEffect, useState } from 'react';
import { getAuthenticatedUserId } from '@/lib/data';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.startsWith('/admin');
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        getAuthenticatedUserId().then(id => {
            setUserId(id);
            setIsLoading(false);
        });
    }, [pathname]);


    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
         <SidebarProvider>
              <AppSidebar initialUserId={userId} />
              <SidebarInset>
                  {children}
              </SidebarInset>
          </SidebarProvider>
    );
}
