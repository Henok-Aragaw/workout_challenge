"use client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, FastForward } from "lucide-react";

interface RestTimerProps {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
  onSkip: () => void;
}

export function RestTimer({ timeLeft, initialTime, isActive, onSkip }: RestTimerProps) {

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;
  const dashOffset = 283 - (283 * progress) / 100;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-60 mx-auto max-w-md"
        >
          <div className="bg-primary text-primary-foreground p-3 pl-4 rounded-xl shadow-2xl flex items-center justify-between border border-primary-foreground/20 backdrop-blur-md">
            
            <div className="flex items-center gap-4">
              {/* Circular Progress Timer */}
              <div className="relative h-12 w-12 flex items-center justify-center">
                 <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-30" />
                    {/* Progress Circle */}
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray="283"
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                 </svg>
                 <Timer className="absolute w-5 h-5 animate-pulse" />
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-medium opacity-80 uppercase tracking-wider">Resting</span>
                <span className="text-2xl font-bold font-mono leading-none">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <Button 
              onClick={onSkip} 
              variant="secondary" 
              size="sm" 
              className="h-10 px-4 font-bold"
            >
              Skip <FastForward className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}