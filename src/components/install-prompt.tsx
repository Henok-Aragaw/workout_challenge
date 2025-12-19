"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkIOS = setTimeout(() => {
      const userAgent = window.navigator.userAgent;
      const isDeviceIOS = /iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window);
      
      if (isDeviceIOS) {
        setIsIOS(true);
      }
    }, 0);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(checkIOS);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto">
        {deferredPrompt && (
          <Button 
            onClick={handleInstallClick} 
            className="w-full shadow-xl bg-primary text-primary-foreground font-bold animate-in slide-in-from-bottom-5 h-12 text-lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Install App
          </Button>
        )}
        
        {isIOS && (
           <div className="bg-background/80 backdrop-blur-md border border-border p-4 rounded-xl shadow-xl text-sm text-center animate-in slide-in-from-bottom-5">
              <p className="flex items-center justify-center gap-2 mb-1 text-foreground font-medium">
                Install for offline access
              </p>
              <p className="text-muted-foreground">
                Tap <Share className="inline w-4 h-4 mx-1" /> and select <span className="font-bold">Add to Home Screen</span>
              </p>
           </div>
        )}
      </div>
    </div>
  );
}