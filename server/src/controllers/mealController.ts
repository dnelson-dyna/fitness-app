import type { Request, Response } from 'express';
import { mealService } from '../services/mealService';
import { z } from 'zod';

const generateMealPlanSchema = z.object({
  fitnessGoal: z.enum(['toning', 'muscle', 'cardio', 'weightloss', 'strength']),
  dietaryPreference: z.enum(['standard', 'vegetarian', 'keto', 'highprotein', 'glutenfree', 'dairyfree']),
  targetCalories: z.number().positive().optional(),
});

export class MealController {
  /**
   * POST /api/meals/generate
   */
  async generateMealPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validated = generateMealPlanSchema.parse(req.body);

      const mealPlan = await mealService.generateMealPlan({
        userId,
        ...validated,
      });

      res.status(201).json(mealPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
        return;
      }
      console.error('Generate meal plan error:', error);
      res.status(500).json({ error: 'Failed to generate meal plan' });
    }
  }

  /**
   * GET /api/meals
   */
  async getMealPlans(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const mealPlans = await mealService.getUserMealPlans(userId);
      res.json(mealPlans);
    } catch (error) {
      console.error('Get meal plans error:', error);
      res.status(500).json({ error: 'Failed to fetch meal plans' });
    }
  }

  /**
   * GET /api/meals/:id
   */
  async getMealPlanById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const mealPlan = await mealService.getMealPlanById(req.params.id, userId);
      if (!mealPlan) {
        res.status(404).json({ error: 'Meal plan not found' });
        return;
      }

      res.json(mealPlan);
    } catch (error) {
      console.error('Get meal plan error:', error);
      res.status(500).json({ error: 'Failed to fetch meal plan' });
    }
  }

  /**
   * DELETE /api/meals/:id
   */
  async deleteMealPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await mealService.deleteMealPlan(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete meal plan error:', error);
      res.status(500).json({ error: 'Failed to delete meal plan' });
    }
  }
}

export const mealController = new MealController();
