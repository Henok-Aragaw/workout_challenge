"use client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {  Timer } from "lucide-react";

interface RestTimerProps {
  timeLeft: number;
  initialTime: number;
  isActive: boolean;
  onSkip: () => void;
}

export function RestTimer({ timeLeft, isActive, onSkip }: RestTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                 <Timer className="animate-pulse w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium opacity-90">Rest Timer</span>
                <span className="text-xl font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Button onClick={onSkip} variant="secondary" size="sm" className="h-8">
              Skip
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}