import { useState, useCallback } from 'react';
import type { Workout, BodyArea, FitnessGoal, Difficulty } from '../types';
import { workoutService } from '../services';

interface UseWorkoutsReturn {
  currentWorkout: Workout | null;
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  generateWorkout: (bodyArea: BodyArea, fitnessGoal: FitnessGoal, difficulty?: Difficulty) => Promise<void>;
  saveWorkout: (workout: Workout) => Promise<void>;
  completeWorkout: (workoutId: string) => Promise<void>;
  toggleExercise: (workoutId: string, exerciseId: string, completed: boolean) => Promise<void>;
  clearCurrentWorkout: () => void;
}

export function useWorkouts(): UseWorkoutsReturn {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWorkout = useCallback(async (
    bodyArea: BodyArea,
    fitnessGoal: FitnessGoal,
    difficulty: Difficulty = 'beginner'
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const workout = await workoutService.generateWorkout(bodyArea, fitnessGoal, difficulty);
      setCurrentWorkout(workout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate workout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveWorkout = useCallback(async (workout: Workout) => {
    setIsLoading(true);
    setError(null);
    try {
      const savedWorkout = await workoutService.saveWorkout(workout);
      setWorkouts(prev => [...prev, savedWorkout]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeWorkout = useCallback(async (workoutId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const completedWorkout = await workoutService.completeWorkout(workoutId);
      setWorkouts(prev =>
        prev.map(w => w.id === workoutId ? completedWorkout : w)
      );
      if (currentWorkout?.id === workoutId) {
        setCurrentWorkout(completedWorkout);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete workout');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkout]);

  const toggleExercise = useCallback(async (
    workoutId: string,
    exerciseId: string,
    completed: boolean
  ) => {
    try {
      await workoutService.toggleExerciseComplete(workoutId, exerciseId, completed);

      // Update local state
      if (currentWorkout?.id === workoutId) {
        setCurrentWorkout(prev => {
          if (!prev) return null;
          return {
            ...prev,
            exercises: prev.exercises.map(ex =>
              ex.id === exerciseId ? { ...ex, completed } : ex
            ),
          };
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exercise');
    }
  }, [currentWorkout]);

  const clearCurrentWorkout = useCallback(() => {
    setCurrentWorkout(null);
  }, []);

  return {
    currentWorkout,
    workouts,
    isLoading,
    error,
    generateWorkout,
    saveWorkout,
    completeWorkout,
    toggleExercise,
    clearCurrentWorkout,
  };
}
