import { useState, useCallback } from 'react';
import type { MealPlan, BodyArea, FitnessGoal, DietaryPreference } from '../types';
import { mealService } from '../services';

interface UseMealPlansReturn {
  currentMealPlan: MealPlan | null;
  mealPlans: MealPlan[];
  isLoading: boolean;
  error: string | null;
  generateMealPlan: (
    bodyArea: BodyArea,
    fitnessGoal: FitnessGoal,
    dietary: DietaryPreference
  ) => Promise<void>;
  saveMealPlan: (mealPlan: MealPlan) => Promise<void>;
  clearCurrentMealPlan: () => void;
}

export function useMealPlans(): UseMealPlansReturn {
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMealPlan = useCallback(async (
    bodyArea: BodyArea,
    fitnessGoal: FitnessGoal,
    dietary: DietaryPreference
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const mealPlan = await mealService.generateMealPlan(bodyArea, fitnessGoal, dietary);
      setCurrentMealPlan(mealPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveMealPlan = useCallback(async (mealPlan: MealPlan) => {
    setIsLoading(true);
    setError(null);
    try {
      const savedMealPlan = await mealService.saveMealPlan(mealPlan);
      setMealPlans(prev => [...prev, savedMealPlan]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meal plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCurrentMealPlan = useCallback(() => {
    setCurrentMealPlan(null);
  }, []);

  return {
    currentMealPlan,
    mealPlans,
    isLoading,
    error,
    generateMealPlan,
    saveMealPlan,
    clearCurrentMealPlan,
  };
}
