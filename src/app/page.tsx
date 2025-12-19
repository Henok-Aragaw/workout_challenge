"use client";

import { useWorkout } from "@/hooks/use-workout"; 
import { SAMPLE_WORKOUT } from "@/lib/data";
import { ExerciseCard } from "@/components/exercise-card";
import { RestTimer } from "@/components/rest-timer";
import { ThemeToggle } from "@/components/theme-toggle";
import { InstallPrompt } from "@/components/install-prompt";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WorkoutPage() {
  const { logs, toggleSet, updateWeight, timer, progress, resetWorkout } = useWorkout(SAMPLE_WORKOUT);
  const [showSummary, setShowSummary] = useState(false);

  const progressPercentage = progress.total > 0 
    ? (progress.completed / progress.total) * 100 
    : 0;

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b']
    });
    setShowSummary(true);
  };

  return (
    <main className="min-h-screen bg-background pb-32">
      {/* Sticky Header with Animated Progress */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg tracking-tight">{SAMPLE_WORKOUT.name}</h1>
            <p className="text-xs text-muted-foreground">{progress.completed}/{progress.total} sets completed</p>
          </div>
          
          <div className="flex items-center gap-1">
            <InstallPrompt />
            <ThemeToggle />
          </div>
        </div>
        
        <div className="h-1.5 w-full bg-secondary overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </div>
      </header>

      <motion.div 
        className="container max-w-md mx-auto p-4 space-y-6 mt-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {SAMPLE_WORKOUT.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            logs={logs[ex.id] || {}}
            onToggleSet={(setIndex, rest) => toggleSet(ex.id, setIndex, rest)}
            onUpdateWeight={(setIndex, weight) => updateWeight(ex.id, setIndex, weight)}
          />
        ))}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6"
        >
           <Dialog open={showSummary} onOpenChange={setShowSummary}>
            <DialogTrigger asChild>
               <Button 
                size="lg" 
                className="w-full font-bold text-lg h-14 shadow-lg shadow-primary/20" 
                onClick={handleFinish}
                disabled={progress.completed === 0}
               >
                Complete Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-0 bg-background/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">Workout Complete! 🎉</DialogTitle>
              </DialogHeader>
              <div className="py-6 flex flex-col items-center gap-6">
                <div className="relative flex items-center justify-center w-32 h-32">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary" strokeDasharray={377} strokeDashoffset={377 - (377 * progressPercentage) / 100} strokeLinecap="round" />
                   </svg>
                   <span className="absolute text-3xl font-bold">{Math.round(progressPercentage)}%</span>
                </div>
                <p className="text-center text-muted-foreground px-4">
                  You smashed <strong>{progress.completed}</strong> sets today. Time to recover and get stronger!
                </p>
                <Button onClick={resetWorkout} className="w-full" size="lg">Start New Session</Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>

      {/* Timer Component */}
      <RestTimer
        isActive={timer.isActive}
        timeLeft={timer.timeLeft}
        initialTime={timer.initialTime}
        onSkip={timer.skipTimer}
      />
    </main>
  );
}