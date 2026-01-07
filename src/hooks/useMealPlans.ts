import { useState, useCallback } from 'react';
import type { MealPlan, BodyArea, FitnessGoal, DietaryPreference, ProteinPreference, MealType } from '../types';
import { mealService } from '../services';

interface UseMealPlansReturn {
  currentMealPlan: MealPlan | null;
  mealPlans: MealPlan[];
  isLoading: boolean;
  error: string | null;
  generateMealPlan: (
    bodyArea: BodyArea,
    fitnessGoal: FitnessGoal,
    dietary: DietaryPreference,
    proteinPrefs?: ProteinPreference[]
  ) => Promise<void>;
  changeMealProtein: (mealType: MealType, newProtein: ProteinPreference) => Promise<void>;
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
    dietary: DietaryPreference,
    proteinPrefs?: ProteinPreference[]
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const mealPlan = await mealService.generateMealPlan(bodyArea, fitnessGoal, dietary, proteinPrefs);
      setCurrentMealPlan(mealPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeMealProtein = useCallback(async (mealType: MealType, newProtein: ProteinPreference) => {
    if (!currentMealPlan) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const updatedMeal = await mealService.regenerateMealWithProtein(
        currentMealPlan,
        mealType,
        newProtein
      );
      
      // Update the meal in the current plan
      setCurrentMealPlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          meals: prev.meals.map(m => m.type === mealType ? updatedMeal : m),
          // Recalculate totals
          totalCalories: prev.meals.reduce((sum, m) => 
            sum + (m.type === mealType ? updatedMeal.calories : m.calories), 0),
          macros: prev.meals.reduce((acc, m) => {
            const meal = m.type === mealType ? updatedMeal : m;
            return {
              protein: acc.protein + meal.macros.protein,
              carbs: acc.carbs + meal.macros.carbs,
              fats: acc.fats + meal.macros.fats,
            };
          }, { protein: 0, carbs: 0, fats: 0 })
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change protein');
    } finally {
      setIsLoading(false);
    }
  }, [currentMealPlan]);

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
    changeMealProtein,
    saveMealPlan,
    clearCurrentMealPlan,
  };
}
