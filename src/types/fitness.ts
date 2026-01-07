/**
 * Core fitness-related type definitions
 */

export type FitnessGoal = 'toning' | 'muscle' | 'cardio' | 'weightloss' | 'strength';

export type DietaryPreference = 'standard' | 'vegetarian' | 'keto' | 'highprotein' | 'glutenfree' | 'dairyfree';

export type WorkoutBodyArea = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'fullbody';

export type MealPlanBodyArea = 'fullbody' | 'muscle' | 'cardio';

export type BodyArea = WorkoutBodyArea | MealPlanBodyArea;

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type ProteinPreference = 'any' | 'chicken' | 'beef' | 'fish' | 'salmon' | 'tuna' | 'pork' | 'turkey' | 'eggs' | 'tofu' | 'tempeh' | 'legumes';

export interface FitnessGoalOption {
  id: FitnessGoal;
  label: string;
  description: string;
  icon?: string;
}

export interface DietaryPreferenceOption {
  id: DietaryPreference;
  label: string;
  description: string;
  icon?: string;
}

export interface BodyAreaOption {
  id: BodyArea;
  label: string;
  description: string;
  icon?: string;
}

export interface ProteinPreferenceOption {
  id: ProteinPreference;
  label: string;
  description: string;
}
