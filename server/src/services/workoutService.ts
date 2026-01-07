import { cosmosDB } from '../config/cosmosdb';
import { openAI } from '../config/openai';
import type { Workout, BodyArea, FitnessGoal, Difficulty } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class WorkoutService {
  /**
   * Generate AI-powered workout plan
   */
  async generateWorkout(params: {
    userId: string;
    bodyArea: BodyArea;
    fitnessGoal: FitnessGoal;
    difficulty: Difficulty;
  }): Promise<Workout> {
    try {
      // Call Azure OpenAI to generate workout
      const aiResponse = await openAI.generateWorkoutPlan({
        bodyArea: params.bodyArea,
        fitnessGoal: params.fitnessGoal,
        difficulty: params.difficulty,
      });

      const workoutData = JSON.parse(aiResponse);

      // Create workout object
      const workout: Workout = {
        id: uuidv4(),
        userId: params.userId,
        name: workoutData.name || `${params.bodyArea} ${params.fitnessGoal} Workout`,
        bodyArea: params.bodyArea,
        fitnessGoal: params.fitnessGoal,
        difficulty: params.difficulty,
        exercises: workoutData.exercises.map((ex: any) => ({
          ...ex,
          id: uuidv4(),
          completed: false,
        })),
        estimatedDuration: workoutData.estimatedDuration || 45,
        caloriesBurned: workoutData.caloriesBurned || 300,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Cosmos DB
      await cosmosDB.workouts.items.create(workout);

      return workout;
    } catch (error) {
      console.error('Error generating workout:', error);
      throw new Error('Failed to generate workout');
    }
  }

  /**
   * Get user's workouts
   */
  async getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
      const { resources } = await cosmosDB.workouts.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll();

      return resources as Workout[];
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  }

  /**
   * Get workout by ID
   */
  async getWorkoutById(workoutId: string, userId: string): Promise<Workout | null> {
    try {
      const { resource } = await cosmosDB.workouts.item(workoutId, userId).read();
      return resource as Workout | null;
    } catch (error: any) {
      if (error.code === 404) return null;
      console.error('Error fetching workout:', error);
      throw new Error('Failed to fetch workout');
    }
  }

  /**
   * Update workout
   */
  async updateWorkout(
    workoutId: string,
    userId: string,
    updates: Partial<Workout>
  ): Promise<Workout> {
    try {
      const workout = await this.getWorkoutById(workoutId, userId);
      if (!workout) {
        throw new Error('Workout not found');
      }

      const updatedWorkout = {
        ...workout,
        ...updates,
        updatedAt: new Date(),
      };

      const { resource } = await cosmosDB.workouts
        .item(workoutId, userId)
        .replace(updatedWorkout);

      return resource as Workout;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw new Error('Failed to update workout');
    }
  }

  /**
   * Mark workout as completed
   */
  async completeWorkout(workoutId: string, userId: string): Promise<Workout> {
    return this.updateWorkout(workoutId, userId, {
      completed: true,
      completedDate: new Date(),
    });
  }

  /**
   * Delete workout
   */
  async deleteWorkout(workoutId: string, userId: string): Promise<void> {
    try {
      await cosmosDB.workouts.item(workoutId, userId).delete();
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw new Error('Failed to delete workout');
    }
  }
}

export const workoutService = new WorkoutService();
