import { cosmosDB } from '../config/cosmosdb.js';
import { openAI } from '../config/openai.js';
import type { MealPlan, FitnessGoal, DietaryPreference } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';

export class MealService {
  /**
   * Generate AI-powered meal plan
   */
  async generateMealPlan(params: {
    userId: string;
    fitnessGoal: FitnessGoal;
    dietaryPreference: DietaryPreference;
    targetCalories?: number;
  }): Promise<MealPlan> {
    try {
      // Call Azure OpenAI to generate meal plan
      const aiResponse = await openAI.generateMealPlan({
        fitnessGoal: params.fitnessGoal,
        dietaryPreference: params.dietaryPreference,
        targetCalories: params.targetCalories,
      });

      const mealData = JSON.parse(aiResponse);

      // Create meal plan object
      const mealPlan: MealPlan = {
        id: uuidv4(),
        userId: params.userId,
        name: mealData.name || `${params.fitnessGoal} ${params.dietaryPreference} Plan`,
        fitnessGoal: params.fitnessGoal,
        dietaryPreference: params.dietaryPreference,
        meals: mealData.meals.map((meal: any) => ({
          ...meal,
          id: uuidv4(),
          ingredients: meal.ingredients.map((ing: any) => ({
            ...ing,
            id: uuidv4(),
          })),
        })),
        totalCalories: mealData.totalCalories,
        macros: mealData.macros,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Cosmos DB
      await cosmosDB.meals.items.create(mealPlan);

      return mealPlan;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      throw new Error('Failed to generate meal plan');
    }
  }

  /**
   * Get user's meal plans
   */
  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const { resources } = await cosmosDB.meals.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll();

      return resources as MealPlan[];
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      throw new Error('Failed to fetch meal plans');
    }
  }

  /**
   * Get meal plan by ID
   */
  async getMealPlanById(mealPlanId: string, userId: string): Promise<MealPlan | null> {
    try {
      const { resource } = await cosmosDB.meals.item(mealPlanId, userId).read();
      return resource as MealPlan | null;
    } catch (error: any) {
      if (error.code === 404) return null;
      console.error('Error fetching meal plan:', error);
      throw new Error('Failed to fetch meal plan');
    }
  }

  /**
   * Delete meal plan
   */
  async deleteMealPlan(mealPlanId: string, userId: string): Promise<void> {
    try {
      await cosmosDB.meals.item(mealPlanId, userId).delete();
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw new Error('Failed to delete meal plan');
    }
  }
}

export const mealService = new MealService();
