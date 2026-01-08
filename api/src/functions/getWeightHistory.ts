import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosDB } from '../config/cosmosdb';

export async function getWeightHistory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Getting weight history');

  try {
    const userId = request.params.userId;
    const daysParam = request.query.get('days');
    const days = daysParam ? parseInt(daysParam) : 30;
    
    if (!userId) {
      return {
        status: 400,
        jsonBody: { error: 'userId is required' }
      };
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await cosmosDB.init();
    const container = cosmosDB.getContainer('progress');
    
    const query = {
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.recordedAt >= @cutoffDate ORDER BY c.recordedAt DESC',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@cutoffDate', value: cutoffDate.toISOString() }
      ]
    };

    const { resources } = await container.items.query(query).fetchAll();

    context.log(`✅ Retrieved ${resources.length} weight check-ins`);

    return {
      status: 200,
      jsonBody: resources
    };
  } catch (error: any) {
    context.error('❌ Error getting weight history:', error);
    return {
      status: 500,
      jsonBody: {
        error: 'Failed to get weight history',
        message: error.message
      }
    };
  }
}

app.http('getWeightHistory', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users/{userId}/weight-history',
  handler: getWeightHistory,
});
