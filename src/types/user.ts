import type { DietaryPreference, FitnessGoal } from './fitness';

/**
 * User-related type definitions
 */

export interface UserProfile {
  id: string; // Auth0 user ID (sub)
  email: string;
  name?: string;
  picture?: string;
  
  // Personal metrics
  age?: number;
  height?: number; // in cm
  weight?: number; // current weight in kg
  targetWeight?: number; // goal weight in kg
  
  // Preferences (used for meal/workout generation)
  fitnessGoal?: FitnessGoal;
  dietaryPreference?: DietaryPreference;
  preferredProteins?: string[]; // e.g., ['chicken', 'beef', 'tofu']
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightCheckIn {
  id: string;
  userId: string;
  weight: number; // kg
  recordedAt: Date;
  notes?: string;
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
