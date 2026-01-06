import { AzureOpenAI } from 'openai';
import { env } from './env.js';

class OpenAIClient {
  private client: AzureOpenAI;

  constructor() {
    this.client = new AzureOpenAI({
      endpoint: env.AZURE_OPENAI_ENDPOINT,
      apiKey: env.AZURE_OPENAI_KEY,
      apiVersion: env.AZURE_OPENAI_API_VERSION,
    });
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
      const response = await this.client.chat.completions.create({
        model: env.AZURE_OPENAI_DEPLOYMENT_NAME,
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
    userProfile?: {
      age?: number;
      experience?: string;
      limitations?: string[];
    };
  }): Promise<string> {
    const systemPrompt = `You are an expert fitness trainer creating personalized workout plans.
Generate detailed, safe, and effective workouts in JSON format.`;

    const userPrompt = `Create a ${params.difficulty} workout plan for ${params.bodyArea} focused on ${params.fitnessGoal}.

${params.userProfile ? `User profile:
- Age: ${params.userProfile.age}
- Experience: ${params.userProfile.experience}
- Limitations: ${params.userProfile.limitations?.join(', ')}` : ''}

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
    allergies?: string[];
  }): Promise<string> {
    const systemPrompt = `You are a certified nutritionist creating personalized meal plans.
Generate balanced, nutritious meal plans in JSON format.`;

    const userPrompt = `Create a daily meal plan for ${params.fitnessGoal} following a ${params.dietaryPreference} diet.

${params.targetCalories ? `Target calories: ${params.targetCalories}` : ''}
${params.allergies?.length ? `Allergies: ${params.allergies.join(', ')}` : ''}

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

  async generateMotivationalMessage(context: {
    recentWorkouts: number;
    totalCalories: number;
    fitnessGoal: string;
  }): Promise<string> {
    const systemPrompt = `You are a supportive fitness coach providing encouragement and motivation.
Keep messages positive, brief (1-2 sentences), and personalized.`;

    const userPrompt = `Generate a motivational message for someone who:
- Completed ${context.recentWorkouts} workouts recently
- Burned ${context.totalCalories} calories total
- Goal: ${context.fitnessGoal}`;

    return this.generateChatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.9, maxTokens: 100 }
    );
  }
}

export const openAI = new OpenAIClient();
