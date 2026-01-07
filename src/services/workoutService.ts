import type { Workout, Exercise, BodyArea, FitnessGoal, Difficulty, WorkoutBodyArea } from '../types';
import { mockDelay, API_BASE_URL } from './api';

/**
 * Workout service with mock data
 */

// Mock workout data generator
const generateMockExercises = (bodyArea: WorkoutBodyArea, count: number = 5): Exercise[] => {
  const exercisesByArea: Record<WorkoutBodyArea, string[]> = {
    chest: ['Push-ups', 'Bench Press', 'Chest Fly', 'Incline Press', 'Cable Crossover'],
    back: ['Pull-ups', 'Bent-over Rows', 'Lat Pulldown', 'Deadlift', 'Face Pulls'],
    shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly', 'Shrugs'],
    arms: ['Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Tricep Pushdown', 'Skull Crushers'],
    legs: ['Squats', 'Lunges', 'Leg Press', 'Romanian Deadlift', 'Calf Raises'],
    core: ['Plank', 'Crunches', 'Russian Twists', 'Leg Raises', 'Mountain Climbers'],
    fullbody: ['Burpees', 'Jumping Jacks', 'High Knees', 'Jump Squats', 'Push-ups'],
  };

  const exercises = exercisesByArea[bodyArea as WorkoutBodyArea] || exercisesByArea.fullbody;

  return exercises.slice(0, count).map((name: string, index: number) => ({
    id: `exercise-${bodyArea}-${index}`,
    name,
    sets: 3,
    reps: 12,
    duration: name.includes('Plank') || name.includes('Hold') ? 30 : undefined,
    description: `Perform ${name} with proper form, focusing on controlled movements.`,
    completed: false,
    formTips: [
      'Keep your core engaged throughout the movement',
      'Maintain proper breathing - exhale on exertion',
      'Focus on the mind-muscle connection',
    ],
  }));
};

const generateMockWorkout = (
  bodyArea: WorkoutBodyArea,
  fitnessGoal: FitnessGoal,
  difficulty: Difficulty = 'beginner'
): Workout => {
  const goalLabels: Record<FitnessGoal, string> = {
    toning: 'Toning & Sculpting',
    muscle: 'Muscle Building',
    cardio: 'Cardio & Endurance',
    weightloss: 'Weight Loss',
    strength: 'Strength Building',
  };

  const areaLabels: Record<WorkoutBodyArea, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    arms: 'Arms',
    legs: 'Legs',
    core: 'Core',
    fullbody: 'Full Body',
  };

  const caloriesByGoal: Record<FitnessGoal, number> = {
    toning: 250,
    muscle: 300,
    cardio: 400,
    weightloss: 350,
    strength: 280,
  };

  const id = `workout-${bodyArea}-${fitnessGoal}-${Date.now()}`;

  return {
    id,
    name: `${areaLabels[bodyArea]} ${goalLabels[fitnessGoal]} Workout`,
    bodyArea,
    fitnessGoal,
    exercises: generateMockExercises(bodyArea),
    estimatedDuration: 45,
    difficulty,
    caloriesBurned: caloriesByGoal[fitnessGoal],
    completed: false,
    createdAt: new Date(),
  };
};

// Service methods
export const workoutService = {
  /**
   * Generate a workout based on body area and fitness goal
   */
  generateWorkout: async (
    bodyArea: BodyArea,
    fitnessGoal: FitnessGoal,
    difficulty: Difficulty = 'beginner'
  ): Promise<Workout> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bodyArea, fitnessGoal, difficulty }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate workout');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating workout:', error);
      // Fallback to mock data if API fails
      await mockDelay(800);
      return generateMockWorkout(bodyArea as WorkoutBodyArea, fitnessGoal, difficulty);
    }
  },

  /**
   * Get saved workouts
   */
  getWorkouts: async (): Promise<Workout[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`);
      if (!response.ok) throw new Error('Failed to fetch workouts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }
  },

  /**
   * Save a workout
   */
  saveWorkout: async (workout: Workout): Promise<Workout> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });
      if (!response.ok) throw new Error('Failed to save workout');
      return await response.json();
    } catch (error) {
      console.error('Error saving workout:', error);
      return workout;
    }
  },

  /**
   * Mark workout as completed
   */
  completeWorkout: async (workoutId: string): Promise<Workout> => {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts/${workoutId}/complete`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to complete workout');
      return await response.json();
    } catch (error) {
      console.error('Error completing workout:', error);
      const workout = generateMockWorkout('fullbody', 'toning');
      return {
        ...workout,
        id: workoutId,
        completed: true,
        completedDate: new Date(),
      };
    }
  },

  /**
   * Update exercise completion status
   */
  toggleExerciseComplete: async (
    workoutId: string,
    exerciseId: string,
    completed: boolean
  ): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exerciseId, completed }),
      });
    } catch (error) {
      console.error('Error toggling exercise:', error);
    }
  },
};
