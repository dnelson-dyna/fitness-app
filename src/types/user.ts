import type { BodyArea, DietaryPreference, FitnessGoal } from './fitness';

/**
 * User-related type definitions
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number; // in lbs or kg
  height?: number; // in inches or cm
  fitnessGoals: FitnessGoal[];
  preferredBodyAreas: BodyArea[];
  dietaryPreference: DietaryPreference;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  units: 'imperial' | 'metric';
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  notes?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}
