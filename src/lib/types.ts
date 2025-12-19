export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: string;
  restSeconds: number;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export interface SetLog {
  completed: boolean;
  actualWeight: number;
}

export interface WorkoutLog {
  [exerciseId: string]: {
    [setIndex: number]: SetLog;
  };
}