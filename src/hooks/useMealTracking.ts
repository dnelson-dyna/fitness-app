import { useState, useCallback } from 'react';
import { mealService } from '../services';
import { Meal, DailyMealLog, MealType } from '../types';

interface UseMealTrackingReturn {
  dailyLog: DailyMealLog | null;
  isLoading: boolean;
  error: string | null;
  logMeal: (userId: string, meal: Meal, mealType: MealType, notes?: string) => Promise<void>;
  getDailyLog: (userId: string, date?: string) => Promise<void>;
  isLoggingMeal: boolean;
}

export const useMealTracking = (): UseMealTrackingReturn => {
  const [dailyLog, setDailyLog] = useState<DailyMealLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logMeal = useCallback(async (
    userId: string,
    meal: Meal,
    mealType: MealType,
    notes?: string
  ) => {
    setIsLoggingMeal(true);
    setError(null);
    try {
      await mealService.logMeal(userId, meal, mealType, notes);
      // Refresh daily log after logging meal
      await getDailyLog(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log meal';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoggingMeal(false);
    }
  }, []);

  const getDailyLog = useCallback(async (userId: string, date?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const log = await mealService.getDailyMealLog(userId, date);
      setDailyLog(log);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get meal log';
      setError(errorMessage);
      setDailyLog(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    dailyLog,
    isLoading,
    error,
    logMeal,
    getDailyLog,
    isLoggingMeal,
  };
};
