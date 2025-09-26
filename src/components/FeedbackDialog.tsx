
"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUser } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@/lib/types';
import { Translate } from './Translate';


export function FeedbackDialog({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [feedbackType, setFeedbackType] = useState('');
    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setUser(getUser());
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackType || !message) {
            toast({
                title: "Missing Fields",
                description: "Please select a feedback type and write a message.",
                variant: "destructive",
            });
            return;
        }

        // In a real application, you would send this data to a backend server.
        // For this demo, we'll just simulate a successful submission.
        console.log({
            user: user?.email,
            feedbackType,
            message,
        });

        toast({
            title: "Feedback Submitted",
            description: "Thank you! We've received your feedback.",
        });

        // Reset form and close dialog
        setFeedbackType('');
        setMessage('');
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle><Translate>Submit Feedback</Translate></DialogTitle>
                        <DialogDescription>
                           <Translate>Have a suggestion or found a bug? Let us know!</Translate>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                <Translate>Name</Translate>
                            </Label>
                            <Input id="name" value={user?.name || 'Guest'} disabled className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="feedback-type" className="text-right">
                                <Translate>Type</Translate>
                            </Label>
                            <Select value={feedbackType} onValueChange={setFeedbackType}>
                                <SelectTrigger id="feedback-type" className="col-span-3">
                                <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bug"><Translate>Bug Report</Translate></SelectItem>
                                    <SelectItem value="suggestion"><Translate>Suggestion</Translate></SelectItem>
                                    <SelectItem value="question"><Translate>Question</Translate></SelectItem>
                                    <SelectItem value="other"><Translate>Other</Translate></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="message" className="text-right">
                                <Translate>Message</Translate>
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us more..."
                                className="col-span-3"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit"><Translate>Submit Feedback</Translate></Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
