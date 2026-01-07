import { Router } from 'express';
import { workoutController } from '../controllers/workoutController';
import { mealController} from '../controllers/mealController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Workout routes
router.post('/workouts/generate', authenticateUser, (req, res) =>
  workoutController.generateWorkout(req, res)
);
router.get('/workouts', authenticateUser, (req, res) =>
  workoutController.getWorkouts(req, res)
);
router.get('/workouts/:id', authenticateUser, (req, res) =>
  workoutController.getWorkoutById(req, res)
);
router.patch('/workouts/:id', authenticateUser, (req, res) =>
  workoutController.updateWorkout(req, res)
);
router.post('/workouts/:id/complete', authenticateUser, (req, res) =>
  workoutController.completeWorkout(req, res)
);
router.delete('/workouts/:id', authenticateUser, (req, res) =>
  workoutController.deleteWorkout(req, res)
);

// Meal plan routes
router.post('/meals/generate', authenticateUser, (req, res) =>
  mealController.generateMealPlan(req, res)
);
router.get('/meals', authenticateUser, (req, res) =>
  mealController.getMealPlans(req, res)
);
router.get('/meals/:id', authenticateUser, (req, res) =>
  mealController.getMealPlanById(req, res)
);
router.delete('/meals/:id', authenticateUser, (req, res) =>
  mealController.deleteMealPlan(req, res)
);

export default router;
