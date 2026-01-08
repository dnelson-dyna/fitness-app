import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { cosmosDB } from '../config/cosmosdb';
import { randomUUID } from 'crypto';

const weightCheckInSchema = z.object({
  weight: z.number(),
  notes: z.string().optional(),
});

export async function createWeightCheckIn(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Creating weight check-in');

  try {
    const userId = request.params.userId;
    
    if (!userId) {
      return {
        status: 400,
        jsonBody: { error: 'userId is required' }
      };
    }

    const body = await request.json() as unknown;
    const data = weightCheckInSchema.parse(body);

    const checkIn = {
      id: randomUUID(),
      userId,
      weight: data.weight,
      notes: data.notes,
      recordedAt: new Date()
    };

    await cosmosDB.init();
    const container = cosmosDB.getContainer('progress');
    await container.items.create(checkIn);

    context.log('✅ Weight check-in created:', checkIn.id);

    return {
      status: 201,
      jsonBody: checkIn
    };
  } catch (error: any) {
    context.error('❌ Error creating weight check-in:', error);

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
        error: 'Failed to create weight check-in',
        message: error.message
      }
    };
  }
}

app.http('createWeightCheckIn', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'users/{userId}/weight-checkin',
  handler: createWeightCheckIn,
});
