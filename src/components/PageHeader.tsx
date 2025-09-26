
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageSelector } from './LanguageSelector';
import { Translate } from "./Translate";

export function PageHeader({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          <Translate>{title}</Translate>
        </h1>
        <div className="ml-auto flex items-center gap-2">
            <LanguageSelector />
            {children}
        </div>
    </header>
  );
}
