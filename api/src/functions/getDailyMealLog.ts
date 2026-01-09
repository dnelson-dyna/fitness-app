import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosDB } from '../config/cosmosdb';

export async function getDailyMealLog(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Getting daily meal log');

  try {
    const userId = request.params.userId;
    const dateParam = request.query.get('date'); // YYYY-MM-DD format
    
    if (!userId) {
      return {
        status: 400,
        jsonBody: { error: 'userId is required' }
      };
    }

    // Default to today if no date provided
    const date = dateParam || new Date().toISOString().split('T')[0];
    
    // Calculate date range for the day
    const startOfDay = new Date(date + 'T00:00:00Z');
    const endOfDay = new Date(date + 'T23:59:59Z');

    await cosmosDB.init();
    const container = cosmosDB.getContainer('mealLogs');

    // Query for meals logged on this date
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.loggedAt >= @startDate AND c.loggedAt <= @endDate ORDER BY c.loggedAt ASC',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@startDate', value: startOfDay.toISOString() },
        { name: '@endDate', value: endOfDay.toISOString() },
      ]
    };

    const { resources: meals } = await container.items.query(querySpec).fetchAll();

    // Calculate totals
    let totalCalories = 0;
    const totalMacros = { protein: 0, carbs: 0, fats: 0 };

    meals.forEach((mealLog: any) => {
      totalCalories += mealLog.meal.calories || 0;
      totalMacros.protein += mealLog.meal.macros?.protein || 0;
      totalMacros.carbs += mealLog.meal.macros?.carbs || 0;
      totalMacros.fats += mealLog.meal.macros?.fats || 0;
    });

    context.log(`✅ Retrieved ${meals.length} meals for ${date}`);

    return {
      status: 200,
      jsonBody: {
        date,
        meals,
        totalCalories,
        totalMacros,
      }
    };
  } catch (error: any) {
    context.error('❌ Error getting daily meal log:', error.message || String(error));

    return {
      status: 500,
      jsonBody: {
        error: 'Failed to get daily meal log',
        message: error.message
      }
    };
  }
}

app.http('getDailyMealLog', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'meals/log/{userId}',
  handler: getDailyMealLog,
});
