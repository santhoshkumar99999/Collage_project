
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/use-language';
import { RootLayoutClient } from './RootLayoutClient';


export const metadata: Metadata = {
  title: 'Vidyagram - Gamified Learning',
  description: 'A gamified learning platform for rural education, focusing on STEM subjects.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#4CAF50',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
           <RootLayoutClient>
                {children}
            </RootLayoutClient>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
