"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { WorkoutLog, Workout } from "@/lib/types";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine"; 

    oscillator.frequency.setValueAtTime(880, ctx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(1.0, ctx.currentTime + 0.1);

    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.6);
  } catch (error) {
    console.error("Audio play failed", error);
  }
};

export function useWorkout(workout: Workout) {

  const [logs, setLogs] = useLocalStorage<WorkoutLog>(`workout-log-${workout.id}`, {});
  
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  
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

  //Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleTimerComplete = () => {
    playNotificationSound();

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      // Vibration pattern Vibrate 500ms
      navigator.vibrate([500, 200, 500]);
    }
  };

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

      if (isCompleting) {
        startTimer(restTime);
      }

      return newLogs;
    });
  };

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setTimerActive(true);
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
     setLogs({});
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