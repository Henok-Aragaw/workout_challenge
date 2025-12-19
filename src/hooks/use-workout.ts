"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts"; // Handy hook for persistence
import { WorkoutLog, Workout } from "@/lib/types";
export function useWorkout(workout: Workout) {
  // Persist logs in local storage
  const [logs, setLogs] = useLocalStorage<WorkoutLog>(`workout-log-${workout.id}`, {});
  
  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);

  // Initialize logs if empty
  useEffect(() => {
    if (Object.keys(logs).length === 0) {
      const initialLogs: WorkoutLog = {};
      workout.exercises.forEach((ex) => {
        initialLogs[ex.id] = {};
        for (let i = 0; i < ex.sets; i++) {
          initialLogs[ex.id][i] = { completed: false, actualWeight: ex.weight };
        }
      });
      setLogs(initialLogs);
    }
  }, [workout, logs, setLogs]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Play sound
      const audio = new Audio("/notification.mp3"); // Ensure you have a file or use a CDN
      audio.play().catch(() => console.log("Audio interaction needed"));
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleSet = (exerciseId: string, setIndex: number, restTime: number) => {
    setLogs((prev) => {
      const isCompleting = !prev[exerciseId]?.[setIndex]?.completed;
      
      const newLogs = {
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          [setIndex]: {
            ...prev[exerciseId][setIndex],
            completed: isCompleting,
          },
        },
      };

      // Trigger timer if completing a set
      if (isCompleting) {
        setTimeLeft(restTime);
        setInitialTime(restTime);
        setTimerActive(true);
      }

      return newLogs;
    });
  };

  const updateWeight = (exerciseId: string, setIndex: number, weight: number) => {
    setLogs((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [setIndex]: {
          ...prev[exerciseId][setIndex],
          actualWeight: weight,
        },
      },
    }));
  };

  const skipTimer = () => {
    setTimerActive(false);
    setTimeLeft(0);
  };

  const getProgress = () => {
    let totalSets = 0;
    let completedSets = 0;
    
    Object.values(logs).forEach((ex) => {
      Object.values(ex).forEach((set) => {
        totalSets++;
        if (set.completed) completedSets++;
      });
    });

    return { total: totalSets, completed: completedSets };
  };

  const resetWorkout = () => {
     setLogs({}); // Clear storage to restart
     window.location.reload();
  };

  return {
    logs,
    toggleSet,
    updateWeight,
    timer: { timeLeft, isActive: timerActive, initialTime, skipTimer },
    progress: getProgress(),
    resetWorkout
  };
}