import type { Request, Response } from 'express';
import { workoutService } from '../services/workoutService';
import { z } from 'zod';

const generateWorkoutSchema = z.object({
  bodyArea: z.enum(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'fullbody']),
  fitnessGoal: z.enum(['toning', 'muscle', 'cardio', 'weightloss', 'strength']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

const updateWorkoutSchema = z.object({
  exercises: z.array(z.any()).optional(),
  completed: z.boolean().optional(),
  completedDate: z.string().optional(),
});

export class WorkoutController {
  /**
   * POST /api/workouts/generate
   */
  async generateWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // From auth middleware
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validated = generateWorkoutSchema.parse(req.body);

      const workout = await workoutService.generateWorkout({
        userId,
        ...validated,
      });

      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
        return;
      }
      console.error('Generate workout error:', error);
      res.status(500).json({ error: 'Failed to generate workout' });
    }
  }

  /**
   * GET /api/workouts
   */
  async getWorkouts(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const workouts = await workoutService.getUserWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error('Get workouts error:', error);
      res.status(500).json({ error: 'Failed to fetch workouts' });
    }
  }

  /**
   * GET /api/workouts/:id
   */
  async getWorkoutById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const workout = await workoutService.getWorkoutById(req.params.id, userId);
      if (!workout) {
        res.status(404).json({ error: 'Workout not found' });
        return;
      }

      res.json(workout);
    } catch (error) {
      console.error('Get workout error:', error);
      res.status(500).json({ error: 'Failed to fetch workout' });
    }
  }

  /**
   * PATCH /api/workouts/:id
   */
  async updateWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const validated = updateWorkoutSchema.parse(req.body);
      const updateData = {
        ...validated,
        completedDate: validated.completedDate ? new Date(validated.completedDate) : undefined
      };
      const workout = await workoutService.updateWorkout(req.params.id, userId, updateData);

      res.json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
        return;
      }
      console.error('Update workout error:', error);
      res.status(500).json({ error: 'Failed to update workout' });
    }
  }

  /**
   * POST /api/workouts/:id/complete
   */
  async completeWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const workout = await workoutService.completeWorkout(req.params.id, userId);
      res.json(workout);
    } catch (error) {
      console.error('Complete workout error:', error);
      res.status(500).json({ error: 'Failed to complete workout' });
    }
  }

  /**
   * DELETE /api/workouts/:id
   */
  async deleteWorkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      await workoutService.deleteWorkout(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      console.error('Delete workout error:', error);
      res.status(500).json({ error: 'Failed to delete workout' });
    }
  }
}

export const workoutController = new WorkoutController();
