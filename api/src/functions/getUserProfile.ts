import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosDB } from '../config/cosmosdb';

export async function getUserProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Getting user profile');

  try {
    const userId = request.params.userId;
    
    if (!userId) {
      return {
        status: 400,
        jsonBody: { error: 'userId is required' }
      };
    }

    await cosmosDB.init();
    const container = cosmosDB.getContainer('users');
    
    try {
      const { resource } = await container.item(userId, userId).read();
      
      if (!resource) {
        // User doesn't exist, create default profile
        const newProfile = {
          id: userId,
          email: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await container.items.create(newProfile);
        return {
          status: 200,
          jsonBody: newProfile
        };
      }
      
      return {
        status: 200,
        jsonBody: resource
      };
    } catch (error: any) {
      if (error.code === 404) {
        // Create new profile
        const newProfile = {
          id: userId,
          email: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await container.items.create(newProfile);
        return {
          status: 200,
          jsonBody: newProfile
        };
      }
      throw error;
    }
  } catch (error: any) {
    context.error('❌ Error getting user profile:', error);
    return {
      status: 500,
      jsonBody: {
        error: 'Failed to get user profile',
        message: error.message
      }
    };
  }
}

app.http('getUserProfile', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users/{userId}/profile',
  handler: getUserProfile,
});
