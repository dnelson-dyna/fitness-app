import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { cosmosDB } from '../config/cosmosdb';

const logMealSchema = z.object({
  userId: z.string(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  meal: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    calories: z.number(),
    macros: z.object({
      protein: z.number(),
      carbs: z.number(),
      fats: z.number(),
    }),
    ingredients: z.array(z.any()),
    instructions: z.array(z.any()),
    prepTime: z.number().optional(),
    cookTime: z.number().optional(),
    totalTime: z.number().optional(),
    difficulty: z.enum(['easy', 'moderate', 'advanced']).optional(),
    substitutions: z.array(z.any()),
  }),
  notes: z.string().optional(),
});

export async function logMeal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Logging meal');

  try {
    const body = await request.json() as unknown;
    const params = logMealSchema.parse(body);

    await cosmosDB.init();
    const container = cosmosDB.getContainer('mealLogs');

    const mealLogEntry = {
      id: randomUUID(),
      userId: params.userId,
      mealId: params.meal.id,
      meal: params.meal,
      mealType: params.mealType,
      loggedAt: new Date(),
      notes: params.notes,
    };

    await container.items.create(mealLogEntry);

    context.log(`✅ Logged ${params.mealType} meal for user ${params.userId}`);

    return {
      status: 201,
      jsonBody: mealLogEntry
    };
  } catch (error: any) {
    context.error('❌ Error logging meal:', error.message || String(error));

    if (error instanceof z.ZodError) {
      return {
        status: 400,
        jsonBody: {
          error: 'Invalid request data',
          details: error.errors
        }
      };
    }

    return {
      status: 500,
      jsonBody: {
        error: 'Failed to log meal',
        message: error.message
      }
    };
  }
}

app.http('logMeal', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'meals/log',
  handler: logMeal,
});
