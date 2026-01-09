import { AzureOpenAI } from 'openai';
import { env } from './env';

class OpenAIClient {
  private client: AzureOpenAI | null = null;

  private getClient(): AzureOpenAI {
    if (!this.client) {
      this.client = new AzureOpenAI({
        endpoint: env.AZURE_OPENAI_ENDPOINT,
        apiKey: env.AZURE_OPENAI_KEY,
        apiVersion: '2024-08-01-preview',
        defaultHeaders: {
          'api-key': env.AZURE_OPENAI_KEY,
        },
      });
    }
    return this.client;
  }

  async generateChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      responseFormat?: 'json' | 'text';
    }
  ): Promise<string> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: env.AZURE_OPENAI_DEPLOYMENT,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
        response_format:
          options?.responseFormat === 'json'
            ? { type: 'json_object' }
            : undefined,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      return content;
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateWorkoutPlan(params: {
    bodyArea: string;
    fitnessGoal: string;
    difficulty: string;
  }): Promise<string> {
    const systemPrompt = `You are an expert fitness trainer creating personalized workout plans.
Generate detailed, safe, and effective workouts in JSON format.`;

    const userPrompt = `Create a ${params.difficulty} workout plan for ${params.bodyArea} focused on ${params.fitnessGoal}.

Return a JSON object with this structure:
{
  "name": "Workout name",
  "description": "Brief description",
  "estimatedDuration": 45,
  "caloriesBurned": 300,
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 12,
      "duration": 30,
      "description": "How to perform",
      "formTips": ["tip1", "tip2"]
    }
  ]
}`;

    return this.generateChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { responseFormat: 'json', temperature: 0.8 }
    );
  }

  async generateMealPlan(params: {
    fitnessGoal: string;
    dietaryPreference: string;
    targetCalories?: number;
  }): Promise<string> {
    const systemPrompt = `You are a certified nutritionist creating personalized meal plans.
Generate balanced, nutritious meal plans in JSON format.`;

    const userPrompt = `Create a daily meal plan for ${params.fitnessGoal} following a ${params.dietaryPreference} diet.

${params.targetCalories ? `Target calories: ${params.targetCalories}` : ''}

Return a JSON object with this structure:
{
  "name": "Plan name",
  "totalCalories": 2000,
  "macros": { "protein": 150, "carbs": 200, "fats": 60 },
  "meals": [
    {
      "type": "breakfast",
      "name": "Meal name",
      "calories": 500,
      "macros": { "protein": 30, "carbs": 50, "fats": 15 },
      "ingredients": [
        { "name": "Ingredient", "amount": "1 cup", "calories": 100 }
      ],
      "instructions": "Cooking instructions",
      "prepTime": 15
    }
  ]
}`;

    return this.generateChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { responseFormat: 'json', temperature: 0.7 }
    );
  }
}

export const openAI = new OpenAIClient();
