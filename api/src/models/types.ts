export type FitnessGoal = 'toning' | 'muscle' | 'cardio' | 'weightloss' | 'strength';
export type DietaryPreference = 'standard' | 'vegetarian' | 'keto' | 'highprotein' | 'glutenfree' | 'dairyfree';
export type BodyArea = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'fullbody';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  description: string;
  formTips?: string[];
  completed: boolean;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  bodyArea: BodyArea;
  fitnessGoal: FitnessGoal;
  exercises: Exercise[];
  estimatedDuration: number;
  difficulty: Difficulty;
  caloriesBurned: number;
  completed: boolean;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Macros {
  protein: number;
  carbs: number;
  fats: number;
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
  prepTime?: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  fitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  meals: Meal[];
  totalCalories: number;
  macros: Macros;
  createdAt: Date;
  updatedAt: Date;
}
