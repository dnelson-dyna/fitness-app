import type { BodyArea, DietaryPreference, FitnessGoal, MealType } from './fitness';

/**
 * Meal and nutrition-related type definitions
 */

export interface Macros {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  calories: number;
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  calories: number;
  macros: Macros;
  ingredients: Ingredient[];
  instructions: string;
  prepTime?: number; // in minutes
  imageUrl?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  bodyArea: BodyArea;
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  meals: Meal[];
  totalCalories: number;
  macros: Macros;
  createdAt: Date;
}

export interface NutritionStats {
  totalCalories: number;
  totalMacros: Macros;
  mealPlansCreated: number;
  favoritePreference: DietaryPreference;
}
