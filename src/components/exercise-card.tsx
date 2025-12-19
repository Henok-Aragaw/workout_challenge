"use client";
import { Exercise, SetLog } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Dumbbell, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ExerciseCardProps {
  exercise: Exercise;
  logs: { [key: number]: SetLog };
  onToggleSet: (setIndex: number, restTime: number) => void;
  onUpdateWeight: (setIndex: number, weight: number) => void;
}

export function ExerciseCard({ exercise, logs, onToggleSet, onUpdateWeight }: ExerciseCardProps) {
  const isAllCompleted = logs && Object.values(logs).every((l) => l.completed);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("w-full transition-all duration-500 overflow-hidden relative", 
        isAllCompleted ? "border-green-500/50 bg-green-500/5 dark:bg-green-900/10 shadow-[0_0_20px_-12px_rgba(34,197,94,0.4)]" : "border-border"
      )}>
        {/* Background completion effect */}
        <div className={cn("absolute inset-0 bg-green-500/10 pointer-events-none transition-opacity duration-500", 
          isAllCompleted ? "opacity-100" : "opacity-0"
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {exercise.name}
                {isAllCompleted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {exercise.sets} sets × {exercise.reps} reps • {exercise.restSeconds}s rest
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-3">
            <div className="grid grid-cols-[30px_1fr_40px_40px] gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
              <span className="text-center">#</span>
              <span className="text-center">Lbs</span>
              <span className="text-center">Reps</span>
              <span className="text-center">Log</span>
            </div>
            
            {Array.from({ length: exercise.sets }).map((_, idx) => {
              const log = logs?.[idx] || { completed: false, actualWeight: exercise.weight };
              
              return (
                <motion.div 
                  key={idx}
                  layout
                  className={cn(
                    "grid grid-cols-[30px_1fr_40px_40px] gap-3 items-center p-2 rounded-lg transition-colors border",
                    log.completed 
                      ? "bg-green-500/10 border-green-500/20 dark:bg-green-900/20" 
                      : "bg-card border-transparent hover:border-border"
                  )}
                >
                  <div className="text-center font-mono text-sm opacity-60">{idx + 1}</div>
                  
                  <Input
                    type="number"
                    value={log.actualWeight}
                    onChange={(e) => onUpdateWeight(idx, Number(e.target.value))}
                    className="h-9 text-center bg-transparent"
                    disabled={log.completed}
                  />
                  
                  <div className="text-center text-sm font-medium">{exercise.reps}</div>
                  
                  <motion.div whileTap={{ scale: 0.85 }}>
                    <Button
                      size="icon"
                      variant={log.completed ? "default" : "secondary"}
                      className={cn(
                        "h-9 w-9 shadow-sm transition-all duration-300",
                        log.completed ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-muted-foreground/20"
                      )}
                      onClick={() => onToggleSet(idx, exercise.restSeconds)}
                    >
                      <AnimatePresence mode="wait">
                        {log.completed ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="dumbbell"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Dumbbell className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}