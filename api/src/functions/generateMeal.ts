import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { openAI } from '../config/openai';
import { cosmosDB } from '../config/cosmosdb';
import { MealPlan, Meal, Ingredient } from '../models/types';
import { randomUUID } from 'crypto';

const generateMealSchema = z.object({
  fitnessGoal: z.enum(['toning', 'muscle', 'cardio', 'weightloss', 'strength']),
  dietaryPreference: z.enum(['standard', 'vegetarian', 'keto', 'highprotein', 'glutenfree', 'dairyfree']),
  targetCalories: z.number().optional(),
});

export async function generateMeal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Processing meal generation request');

  try {
    const body = await request.json() as unknown;
    const params = generateMealSchema.parse(body);

    // Generate meal plan using Azure OpenAI
    const aiResponse = await openAI.generateMealPlan({
      fitnessGoal: params.fitnessGoal,
      dietaryPreference: params.dietaryPreference,
      targetCalories: params.targetCalories,
    });

    const aiData = JSON.parse(aiResponse);

    // Add IDs to ingredients and meals
    const mealsWithIds: Meal[] = aiData.meals.map((meal: any) => ({
      ...meal,
      id: randomUUID(),
      ingredients: meal.ingredients.map((ing: any) => ({
        ...ing,
        id: randomUUID(),
      })),
    }));

    // Create meal plan object
    const mealPlan: MealPlan = {
      id: randomUUID(),
      userId: 'dev-user-123', // TODO: Get from auth context
      name: aiData.name || `${params.dietaryPreference} ${params.fitnessGoal} Plan`,
      fitnessGoal: params.fitnessGoal,
      dietaryPreference: params.dietaryPreference,
      meals: mealsWithIds,
      totalCalories: aiData.totalCalories,
      macros: aiData.macros,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Cosmos DB
    await cosmosDB.init();
    const container = cosmosDB.getContainer('meals');
    await container.items.create(mealPlan);

    context.log('✅ Meal plan generated and saved:', mealPlan.id);

    return {
      status: 200,
      jsonBody: mealPlan,
    };
  } catch (error: any) {
    context.error('❌ Error generating meal plan:', error);

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
        error: 'Failed to generate meal plan',
        message: error.message,
      },
    };
  }
}

app.http('generateMeal', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'meals/generate',
  handler: generateMeal,
});
