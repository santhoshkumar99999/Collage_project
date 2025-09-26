
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-bold text-primary", className)}>
      <GraduationCap className="h-6 w-6" />
      <span className="font-headline">Vidyagram</span>
    </div>
  );
}
