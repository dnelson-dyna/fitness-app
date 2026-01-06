/**
 * Core fitness-related type definitions
 */

export type FitnessGoal = 'toning' | 'muscle' | 'cardio' | 'weightloss' | 'strength';

export type DietaryPreference = 'standard' | 'vegetarian' | 'keto' | 'highprotein' | 'glutenfree' | 'dairyfree';

export type BodyArea = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'fullbody';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

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
