import type { BodyArea, DietaryPreference, FitnessGoal, MealType, ProteinPreference } from './fitness';

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

export interface MealInstruction {
  step: number;
  description: string;
}

export interface SubstitutionOption {
  name: string;
  amount?: string;
  calories?: number;
  notes?: string;
}

export interface IngredientSubstitution {
  ingredient: string;
  alternatives: SubstitutionOption[];
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  protein?: ProteinPreference; // Main protein source
  calories: number;
  macros: Macros;
  ingredients: Ingredient[];
  instructions: MealInstruction[];
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  totalTime?: number; // in minutes
  difficulty?: 'easy' | 'moderate' | 'advanced';
  substitutions: IngredientSubstitution[];
  imageUrl?: string;
  isAiGenerated?: boolean;
}

export interface MealLogEntry {
  id: string;
  userId: string;
  mealId: string;
  meal: Meal;
  mealType: MealType;
  loggedAt: Date;
  notes?: string;
}

export interface DailyMealLog {
  date: string; // YYYY-MM-DD
  meals: MealLogEntry[];
  totalCalories: number;
  totalMacros: Macros;
}

export interface MealPlan {
  id: string;
  name: string;
  bodyArea: BodyArea;
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  proteinPreferences?: ProteinPreference[]; // Optional protein preferences
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
