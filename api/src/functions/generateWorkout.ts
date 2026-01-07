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

    // Generate workout using Azure OpenAI
    const aiResponse = await openAI.generateWorkoutPlan({
      bodyArea: params.bodyArea,
      fitnessGoal: params.fitnessGoal,
      difficulty: params.difficulty,
    });

    const aiData = JSON.parse(aiResponse);

    // Add IDs and completed status to exercises
    const exercisesWithIds: Exercise[] = aiData.exercises.map((exercise: any) => ({
      ...exercise,
      id: randomUUID(),
      completed: false,
    }));

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

app.http('generateWorkout', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'workouts/generate',
  handler: generateWorkout,
});
