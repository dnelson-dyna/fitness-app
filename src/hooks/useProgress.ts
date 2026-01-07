import { useState, useCallback, useEffect } from 'react';
import type { Workout, WorkoutStats } from '../types';

interface UseProgressReturn {
  stats: WorkoutStats;
  isLoading: boolean;
  updateStats: (completedWorkout: Workout) => void;
}

const initialStats: WorkoutStats = {
  totalWorkouts: 0,
  totalCaloriesBurned: 0,
  averageDuration: 0,
  workoutsByGoal: {
    toning: 0,
    muscle: 0,
    cardio: 0,
    weightloss: 0,
    strength: 0,
  },
  workoutsByArea: {
    chest: 0,
    back: 0,
    shoulders: 0,
    arms: 0,
    legs: 0,
    core: 0,
    fullbody: 0,
  },
  recentWorkouts: [],
};

export function useProgress(): UseProgressReturn {
  const [stats, setStats] = useState<WorkoutStats>(initialStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stats from localStorage on mount
    const loadStats = () => {
      try {
        const savedStats = localStorage.getItem('workoutStats');
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats);
          // Convert date strings back to Date objects
          parsedStats.recentWorkouts = parsedStats.recentWorkouts.map((w: Workout) => ({
            ...w,
            createdAt: new Date(w.createdAt),
            completedDate: w.completedDate ? new Date(w.completedDate) : undefined,
          }));
          setStats(parsedStats);
        }
      } catch (err) {
        console.error('Failed to load workout stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const updateStats = useCallback((completedWorkout: Workout) => {
    setStats(prev => {
      const newStats: WorkoutStats = {
        totalWorkouts: prev.totalWorkouts + 1,
        totalCaloriesBurned: prev.totalCaloriesBurned + completedWorkout.caloriesBurned,
        averageDuration:
          (prev.averageDuration * prev.totalWorkouts + completedWorkout.estimatedDuration) /
          (prev.totalWorkouts + 1),
        workoutsByGoal: {
          ...prev.workoutsByGoal,
          [completedWorkout.fitnessGoal]: prev.workoutsByGoal[completedWorkout.fitnessGoal] + 1,
        },
        workoutsByArea: {
          ...prev.workoutsByArea,
          [completedWorkout.bodyArea]: (prev.workoutsByArea[completedWorkout.bodyArea] || 0) + 1,
        },
        recentWorkouts: [completedWorkout, ...prev.recentWorkouts].slice(0, 10),
      };

      // Save to localStorage
      try {
        localStorage.setItem('workoutStats', JSON.stringify(newStats));
      } catch (err) {
        console.error('Failed to save workout stats:', err);
      }

      return newStats;
    });
  }, []);

  return {
    stats,
    isLoading,
    updateStats,
  };
}
