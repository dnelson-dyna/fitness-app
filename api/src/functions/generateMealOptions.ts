import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { openAI } from '../config/openai';

const generateMealOptionsSchema = z.object({
  userId: z.string(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  fitnessGoal: z.enum(['muscle', 'toning', 'cardio', 'weightloss', 'strength']),
  dietaryPreference: z.enum(['standard', 'vegetarian', 'keto', 'highprotein', 'glutenfree', 'dairyfree']),
  proteinPreference: z.string(),
  dailyCalorieTarget: z.number().min(1200).max(5000),
});

export async function generateMealOptions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Generating meal options');

  try {
    const body = await request.json() as unknown;
    const params = generateMealOptionsSchema.parse(body);

    let meals: any[];
    let isAiGenerated = false;

    // Try AI generation first, fallback to mock data if it fails
    try {
      // Get AI prompt
      const prompt = getMealOptionsPrompt(params);

      // Generate meals with AI
      const response = await openAI.generateChatCompletion(
        [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        { responseFormat: 'json', temperature: 0.8, maxTokens: 2500 }
      );

      // Parse response with error handling
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (parseError) {
        // Try to clean up common JSON errors
        context.log('⚠️ JSON parse error, attempting cleanup...');
        const cleanedResponse = cleanupJsonString(response);
        parsedResponse = JSON.parse(cleanedResponse);
      }
      
      // Handle both array and object responses
      if (Array.isArray(parsedResponse)) {
        meals = parsedResponse;
      } else if (parsedResponse.meals && Array.isArray(parsedResponse.meals)) {
        meals = parsedResponse.meals;
      } else {
        throw new Error('AI response format invalid - expected array or object with meals array');
      }
      
      isAiGenerated = true;
      context.log('✅ Generated meals using AI');
    } catch (aiError) {
      context.log('⚠️ AI generation failed, using mock data:', aiError instanceof Error ? aiError.message : 'Unknown error');
      
      // Generate mock meals as fallback
      meals = generateMockMeals(params);
      isAiGenerated = false;
    }
    
    // Ensure meals is an array
    if (!Array.isArray(meals)) {
      throw new Error('AI response is not an array');
    }

    // Add UUIDs to meals, ingredients, and instructions
    meals = meals.map((meal: any) => ({
      ...meal,
      id: randomUUID(),
      ingredients: meal.ingredients?.map((ing: any) => ({
        ...ing,
        id: randomUUID(),
      })) || [],
      substitutions: meal.substitutions || [],
      isAiGenerated: isAiGenerated,
    }));

    // Calculate meal type calorie ranges
    const mealTypeRanges: Record<string, string> = {
      breakfast: '350-500 cal',
      lunch: '500-700 cal',
      dinner: '500-700 cal',
      snack: '150-250 cal',
    };

    context.log(`✅ Generated ${meals.length} meal options for ${params.mealType}`);

    return {
      status: 200,
      jsonBody: {
        meals,
        dailyCalorieTarget: params.dailyCalorieTarget,
        mealTypeCalorieRange: mealTypeRanges,
      }
    };
  } catch (error: any) {
    context.error('❌ Error generating meal options:', error.message || String(error));

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
        error: 'Failed to generate meal options',
        message: error.message
      }
    };
  }
}

function getMealOptionsPrompt(params: {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  fitnessGoal: string;
  dietaryPreference: string;
  proteinPreference: string;
  dailyCalorieTarget: number;
}): { system: string; user: string } {
  const mealCalorieTargets: Record<string, { low: number; mid: number; high: number }> = {
    breakfast: { low: 350, mid: 420, high: 500 },
    lunch: { low: 500, mid: 600, high: 700 },
    dinner: { low: 500, mid: 600, high: 700 },
    snack: { low: 150, mid: 200, high: 250 },
  };

  const targets = mealCalorieTargets[params.mealType];

  return {
    system: `You are a certified nutritionist creating personalized meal plans. Generate balanced, nutritious meals in VALID JSON format. 

CRITICAL JSON RULES - MUST FOLLOW:
1. NEVER use double quotes (") inside any text values - use apostrophes (') instead
2. Example: "Season the chicken and let it rest" NOT "Season the \"chicken\" and let it rest"
3. Keep text simple - avoid special characters that need escaping
4. All numeric values must be numbers, not strings
5. Arrays must not have trailing commas

Each meal should include detailed step-by-step cooking instructions and ingredient substitution suggestions. Meals should vary in calorie content (low, medium, high) to give users options.`,
    
    user: `Create 3 DIFFERENT ${params.mealType} meal options for someone with a ${params.fitnessGoal} fitness goal following a ${params.dietaryPreference} diet.

CONSTRAINTS:
- Daily calorie target: ${params.dailyCalorieTarget} calories
- Meal type calorie range: ${targets.low}-${targets.high} calories
- Generate 3 meals with varying calories: ${targets.low}, ${targets.mid}, ${targets.high}
- All meals MUST feature ${params.proteinPreference} as the primary protein
- Meals must be DIFFERENT (different dishes, not variations of same meal)
- Each meal must be realistic and achievable for home cooking

For EACH meal, return JSON object with this EXACT structure:
{
  "name": "Descriptive meal name",
  "type": "${params.mealType}",
  "calories": <number>,
  "macros": {
    "protein": <grams>,
    "carbs": <grams>,
    "fats": <grams>
  },
  "ingredients": [
    {
      "name": "Ingredient name",
      "amount": "1 cup" or "6 oz" (include unit)",
      "calories": <number>
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "First step of cooking (be specific and detailed)"
    },
    {
      "step": 2,
      "description": "Second step..."
    }
  ],
  "prepTime": <minutes as number>,
  "cookTime": <minutes as number>,
  "totalTime": <minutes as number>,
  "difficulty": "easy|moderate|advanced",
  "substitutions": [
    {
      "ingredient": "Original ingredient name",
      "alternatives": [
        {
          "name": "Alternative ingredient name",
          "amount": "amount with unit (can differ from original)",
          "calories": <estimated calories>,
          "notes": "Why this works (e.g., similar nutrition, dietary restriction, flavor profile)"
        }
      ]
    }
  ]
}

RETURN as JSON array with 3 meal objects: [meal1, meal2, meal3]

CRITICAL - OUTPUT FORMAT:
- Response must be ONLY the JSON array - no extra text before or after
- NO markdown code blocks, NO explanations, ONLY valid JSON
- Use apostrophes (') not quotes (") inside text values
- Example good: "description": "Heat the pan and add oil"
- Example bad: "description": "Heat the \"pan\" and add oil"
- Instructions must be 4-8 steps, detailed but simple language
- Each meal needs 2-3 substitution options`
  };
}

function cleanupJsonString(jsonStr: string): string {
  // Remove any potential BOM or leading/trailing whitespace
  let cleaned = jsonStr.trim();
  
  // Fix common issues with escaped characters in strings
  // This is a simple approach - find content between quotes and ensure proper escaping
  try {
    // Try to extract just the JSON array/object if there's extra text
    const jsonMatch = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    // Remove any trailing commas before closing brackets
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    
    // Attempt to fix common unescaped quote issues in text values
    // This is a heuristic approach and may not catch all cases
    cleaned = cleaned.replace(/([^\\])"([^"]*)"(\s*:)/g, '$1\\"$2\\"$3');
    
    return cleaned;
  } catch (e) {
    // If cleanup fails, return original
    return jsonStr;
  }
}

function generateMockMeals(params: z.infer<typeof generateMealOptionsSchema>): any[] {
  const { mealType, proteinPreference } = params;
  
  const calorieRanges = {
    breakfast: [350, 420, 500],
    lunch: [500, 600, 700],
    dinner: [500, 600, 700],
    snack: [150, 200, 250],
  };
  
  const calories = calorieRanges[mealType];
  
  return calories.map((cal, index) => ({
    name: `${proteinPreference.charAt(0).toUpperCase() + proteinPreference.slice(1)} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Option ${index + 1}`,
    type: mealType,
    calories: cal,
    macros: {
      protein: Math.round(cal * 0.3 / 4),
      carbs: Math.round(cal * 0.4 / 4),
      fats: Math.round(cal * 0.3 / 9),
    },
    ingredients: [
      {
        name: `${proteinPreference.charAt(0).toUpperCase() + proteinPreference.slice(1)}`,
        amount: '6 oz',
        calories: Math.round(cal * 0.5),
      },
      {
        name: 'Mixed Vegetables',
        amount: '1 cup',
        calories: Math.round(cal * 0.2),
      },
      {
        name: 'Whole Grains',
        amount: '0.5 cup',
        calories: Math.round(cal * 0.3),
      },
    ],
    instructions: [
      { step: 1, description: 'Preheat cooking surface to medium-high heat.' },
      { step: 2, description: `Season ${proteinPreference} with salt, pepper, and your favorite spices.` },
      { step: 3, description: `Cook ${proteinPreference} for 6-8 minutes per side until fully cooked.` },
      { step: 4, description: 'Prepare vegetables by steaming or sautéing for 5 minutes.' },
      { step: 5, description: 'Cook grains according to package instructions.' },
      { step: 6, description: 'Plate the meal and serve hot.' },
    ],
    prepTime: 10,
    cookTime: 20,
    totalTime: 30,
    difficulty: 'easy',
    substitutions: [
      {
        ingredient: proteinPreference.charAt(0).toUpperCase() + proteinPreference.slice(1),
        alternatives: [
          {
            name: 'Tofu',
            amount: '8 oz',
            calories: Math.round(cal * 0.4),
            notes: 'Plant-based alternative with similar protein content',
          },
          {
            name: 'Tempeh',
            amount: '6 oz',
            calories: Math.round(cal * 0.45),
            notes: 'Fermented soy option with nutty flavor',
          },
        ],
      },
    ],
  }));
}

app.http('generateMealOptions', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'meals/options',
  handler: generateMealOptions,
});
