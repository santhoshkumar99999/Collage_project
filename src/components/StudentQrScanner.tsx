
"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CameraOff } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface StudentQrScannerProps {
  onScanSuccess?: () => void;
}

export function StudentQrScanner({ onScanSuccess }: StudentQrScannerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCameraPermission = async () => {
      setIsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  useEffect(() => {
    let animationFrameId: number;

    const scanCode = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            const url = code.data;
             if (url.includes('/profile/')) {
               onScanSuccess?.();
               router.push(url);
               return; // Stop scanning
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(scanCode);
    };

    if (hasCameraPermission) {
      animationFrameId = requestAnimationFrame(scanCode);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasCameraPermission, router, onScanSuccess]);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                <Skeleton className="w-full h-full" />
            </div>
        )}

        {!isLoading && !hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-md">
                <CameraOff className="w-12 h-12 text-muted-foreground mb-4" />
                <Alert variant="destructive" className="w-auto">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature.
                    </AlertDescription>
                </Alert>
            </div>
        )}
         {/* Overlay for aiming */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-dashed border-primary/50 rounded-lg" />
        </div>
    </div>
  );
}
