import { Workout } from "./types";

export const SAMPLE_WORKOUT: Workout = {
  id: "workout-1",
  name: "Upper Body Strength",
  description: "Focus on chest, shoulders, and triceps",
  exercises: [
    {
      id: "ex-1",
      name: "Bench Press",
      sets: 4,
      reps: 8,
      weight: 135,
      weightUnit: "lbs",
      restSeconds: 90,
    },
    {
      id: "ex-2",
      name: "Overhead Press",
      sets: 3,
      reps: 10,
      weight: 65,
      weightUnit: "lbs",
      restSeconds: 60,
    },
    {
      id: "ex-3",
      name: "Tricep Dips",
      sets: 3,
      reps: 12,
      weight: 0,
      weightUnit: "bodyweight",
      restSeconds: 45,
    },
  ],
};