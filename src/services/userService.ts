import type { UserProfile, WeightCheckIn } from '../types';
import { API_BASE_URL } from './api';

/**
 * User profile and weight tracking service
 */

export const userService = {
  /**
   * Get user profile
   */
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`);
    if (!response.ok) throw new Error('Failed to get user profile');
    return response.json();
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return response.json();
  },

  /**
   * Add weight check-in
   */
  addWeightCheckIn: async (userId: string, weight: number, notes?: string): Promise<WeightCheckIn> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/weight-checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weight, notes }),
    });
    if (!response.ok) throw new Error('Failed to add weight check-in');
    return response.json();
  },

  /**
   * Get weight history
   */
  getWeightHistory: async (userId: string, days: number = 30): Promise<WeightCheckIn[]> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/weight-history?days=${days}`);
    if (!response.ok) throw new Error('Failed to get weight history');
    return response.json();
  },
};
