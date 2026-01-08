import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { cosmosDB } from '../config/cosmosdb';

const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
  age: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  targetWeight: z.number().optional(),
  fitnessGoal: z.enum(['muscle', 'toning', 'cardio', 'weightloss', 'strength']).optional(),
  dietaryPreference: z.enum(['standard', 'vegetarian', 'keto', 'highprotein', 'glutenfree', 'dairyfree']).optional(),
  preferredProteins: z.array(z.string()).optional(),
});

export async function updateUserProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Updating user profile');

  try {
    const userId = request.params.userId;
    
    if (!userId) {
      return {
        status: 400,
        jsonBody: { error: 'userId is required' }
      };
    }

    const body = await request.json() as unknown;
    const updates = updateProfileSchema.parse(body);

    await cosmosDB.init();
    const container = cosmosDB.getContainer('users');
    
    // Get existing profile or create new
    let profile;
    try {
      const { resource } = await container.item(userId, userId).read();
      profile = resource;
    } catch (error: any) {
      if (error.code === 404) {
        profile = {
          id: userId,
          createdAt: new Date()
        };
      } else {
        throw error;
      }
    }

    // Update profile
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date()
    };

    await container.items.upsert(updatedProfile);

    context.log('✅ Profile updated:', userId);

    return {
      status: 200,
      jsonBody: updatedProfile
    };
  } catch (error: any) {
    context.error('❌ Error updating profile:', error);

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
        error: 'Failed to update profile',
        message: error.message
      }
    };
  }
}

app.http('updateUserProfile', {
  methods: ['PUT', 'PATCH'],
  authLevel: 'anonymous',
  route: 'users/{userId}/profile',
  handler: updateUserProfile,
});
