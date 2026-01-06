import type { BodyArea, Difficulty, FitnessGoal } from './fitness';

/**
 * Workout-related type definitions
 */

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number; // in seconds
  description: string;
  imageUrl?: string;
  completed: boolean;
  formTips?: string[];
}

export interface Workout {
  id: string;
  name: string;
  bodyArea: BodyArea;
  fitnessGoal: FitnessGoal;
  exercises: Exercise[];
  estimatedDuration: number; // in minutes
  difficulty: Difficulty;
  caloriesBurned: number; // estimated
  completed: boolean;
  completedDate?: Date;
  createdAt: Date;
}

export interface WorkoutProgress {
  workoutId: string;
  completedExercises: string[]; // exercise IDs
  startedAt?: Date;
  completedAt?: Date;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageDuration: number;
  workoutsByGoal: Record<FitnessGoal, number>;
  workoutsByArea: Record<BodyArea, number>;
  recentWorkouts: Workout[];
}
