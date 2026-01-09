import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { openAI } from '../config/openai';
import { cosmosDB } from '../config/cosmosdb';
import { Workout, Exercise } from '../models/types';
import { randomUUID } from 'crypto';

const generateWorkoutSchema = z.object({
  bodyArea: z.enum(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'fullbody']),
  fitnessGoal: z.enum(['toning', 'muscle', 'cardio', 'weightloss', 'strength']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

export async function generateWorkout(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Processing workout generation request');

  try {
    const body = await request.json() as unknown;
    const params = generateWorkoutSchema.parse(body);

    let aiData: any;
    let exercisesWithIds: Exercise[];
    let isAiGenerated = false;

    try {
      // Generate workout using Azure OpenAI
      const aiResponse = await openAI.generateWorkoutPlan({
        bodyArea: params.bodyArea,
        fitnessGoal: params.fitnessGoal,
        difficulty: params.difficulty,
      });

      aiData = JSON.parse(aiResponse);
      
      // Add IDs and completed status to exercises
      exercisesWithIds = aiData.exercises.map((exercise: any) => ({
        ...exercise,
        id: randomUUID(),
        completed: false,
      }));

      isAiGenerated = true;
      context.log('✅ Generated workout using AI');
    } catch (aiError) {
      context.log('⚠️ AI generation failed, using mock data:', aiError instanceof Error ? aiError.message : 'Unknown error');
      
      // Generate mock workout as fallback
      const mockWorkout = generateMockWorkout(params);
      aiData = mockWorkout;
      exercisesWithIds = mockWorkout.exercises;
      isAiGenerated = false;
    }

    // Create workout object
    const workout: Workout = {
      id: randomUUID(),
      userId: 'dev-user-123', // TODO: Get from auth context
      name: aiData.name || `${params.bodyArea} ${params.difficulty} Workout`,
      bodyArea: params.bodyArea,
      fitnessGoal: params.fitnessGoal,
      exercises: exercisesWithIds,
      estimatedDuration: aiData.estimatedDuration || 45,
      difficulty: params.difficulty,
      caloriesBurned: aiData.caloriesBurned || 300,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAiGenerated: isAiGenerated,
    };

    // Save to Cosmos DB
    await cosmosDB.init();
    const container = cosmosDB.getContainer('workouts');
    await container.items.create(workout);

    context.log('✅ Workout generated and saved:', workout.id);

    return {
      status: 200,
      jsonBody: workout,
    };
  } catch (error: any) {
    context.error('❌ Error generating workout:', error);

    if (error instanceof z.ZodError) {
      return {
        status: 400,
        jsonBody: {
          error: 'Invalid request data',
          details: error.errors,
        },
      };
    }

    return {
      status: 500,
      jsonBody: {
        error: 'Failed to generate workout',
        message: error.message,
      },
    };
  }
}

function generateMockWorkout(params: z.infer<typeof generateWorkoutSchema>): any {
  const mockExercises = [
    {
      id: randomUUID(),
      name: `${params.bodyArea} Exercise 1`,
      sets: 3,
      reps: 12,
      duration: 0,
      description: `Perform this ${params.difficulty} level exercise focusing on ${params.bodyArea}`,
      formTips: ['Keep proper form', 'Control the movement'],
      completed: false,
    },
    {
      id: randomUUID(),
      name: `${params.bodyArea} Exercise 2`,
      sets: 3,
      reps: 10,
      duration: 0,
      description: `Another effective ${params.bodyArea} exercise`,
      formTips: ['Breathe steadily', 'Maintain tension'],
      completed: false,
    },
    {
      id: randomUUID(),
      name: `${params.bodyArea} Exercise 3`,
      sets: 4,
      reps: 8,
      duration: 0,
      description: `Advanced ${params.bodyArea} movement`,
      formTips: ['Focus on the target muscle', 'Use full range of motion'],
      completed: false,
    },
  ];

  return {
    name: `${params.bodyArea.charAt(0).toUpperCase() + params.bodyArea.slice(1)} ${params.difficulty.charAt(0).toUpperCase() + params.difficulty.slice(1)} Workout`,
    description: `A ${params.difficulty} level workout targeting ${params.bodyArea}`,
    estimatedDuration: 45,
    caloriesBurned: params.difficulty === 'beginner' ? 200 : params.difficulty === 'intermediate' ? 300 : 400,
    exercises: mockExercises,
  };
}

app.http('generateWorkout', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'workouts/generate',
  handler: generateWorkout,
});
