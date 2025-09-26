
"use client";

import { useLanguage } from '@/hooks/use-language';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';


export function LanguageSelector({ className }: { className?: string }) {
    const { language, setLanguage, supportedLanguages } = useLanguage();

    return (
        <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className={cn("w-[140px]", className)}>
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                {supportedLanguages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
