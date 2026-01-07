import type { MealPlan, Meal, Ingredient, Macros, BodyArea, FitnessGoal, DietaryPreference, MealType, ProteinPreference } from '../types';
import { mockDelay } from './api';

/**
 * Meal planning service with mock data
 */

// Protein source options with their calorie/macro profiles
const proteinSources: Record<ProteinPreference, { calories: number; protein: number; name: string }> = {
  any: { calories: 200, protein: 30, name: 'Protein Source' },
  chicken: { calories: 165, protein: 31, name: 'Chicken Breast' },
  beef: { calories: 250, protein: 26, name: 'Lean Beef' },
  fish: { calories: 145, protein: 27, name: 'White Fish' },
  salmon: { calories: 206, protein: 22, name: 'Salmon' },
  tuna: { calories: 130, protein: 29, name: 'Tuna' },
  pork: { calories: 200, protein: 28, name: 'Pork Tenderloin' },
  turkey: { calories: 135, protein: 30, name: 'Turkey Breast' },
  eggs: { calories: 140, protein: 12, name: 'Eggs' },
  tofu: { calories: 144, protein: 15, name: 'Tofu' },
  tempeh: { calories: 195, protein: 20, name: 'Tempeh' },
  legumes: { calories: 230, protein: 15, name: 'Beans/Lentils' },
};

const generateMockIngredients = (
  mealType: MealType,
  dietary: DietaryPreference,
  proteinPref?: ProteinPreference
): Ingredient[] => {
  // Determine protein source based on preferences and dietary restrictions
  let proteinKey: ProteinPreference = proteinPref || 'any';
  
  // Override with dietary restrictions
  if (dietary === 'vegetarian') {
    const vegProteins: ProteinPreference[] = ['tofu', 'tempeh', 'legumes', 'eggs'];
    proteinKey = proteinPref && vegProteins.includes(proteinPref) ? proteinPref : 'tofu';
  }
  
  const protein = proteinSources[proteinKey] || proteinSources.chicken;
  
  const ingredients: Record<MealType, Ingredient[]> = {
    breakfast: [
      { id: '1', name: 'Oats', amount: '1 cup', calories: 150 },
      { id: '2', name: 'Banana', amount: '1 medium', calories: 105 },
      { id: '3', name: proteinKey === 'eggs' ? 'Eggs' : 'Protein Powder', amount: proteinKey === 'eggs' ? '2 large' : '1 scoop', calories: proteinKey === 'eggs' ? 140 : 120 },
    ],
    lunch: [
      { id: '4', name: protein.name, amount: '6 oz', calories: protein.calories },
      { id: '5', name: 'Brown Rice', amount: '1 cup', calories: 215 },
      { id: '6', name: 'Broccoli', amount: '1 cup', calories: 55 },
    ],
    dinner: [
      { id: '7', name: protein.name, amount: '6 oz', calories: protein.calories },
      { id: '8', name: 'Sweet Potato', amount: '1 medium', calories: 180 },
      { id: '9', name: 'Asparagus', amount: '1 cup', calories: 40 },
    ],
    snack: [
      { id: '10', name: dietary === 'dairyfree' ? 'Almond Yogurt' : 'Greek Yogurt', amount: '1 cup', calories: 130 },
      { id: '11', name: 'Mixed Berries', amount: '1/2 cup', calories: 40 },
    ],
  };

  return ingredients[mealType];
};

const generateMockMeal = (
  mealType: MealType,
  dietary: DietaryPreference,
  proteinPref?: ProteinPreference
): Meal => {
  const ingredients = generateMockIngredients(mealType, dietary, proteinPref);
  const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);

  const mealNames: Record<MealType, string> = {
    breakfast: 'Power Breakfast Bowl',
    lunch: 'Balanced Lunch Plate',
    dinner: 'Wholesome Dinner',
    snack: 'Healthy Snack',
  };

  // Determine which protein was used
  let usedProtein: ProteinPreference | undefined;
  if (mealType === 'lunch' || mealType === 'dinner') {
    usedProtein = proteinPref || (dietary === 'vegetarian' ? 'tofu' : 'chicken');
  } else if (mealType === 'breakfast' && proteinPref === 'eggs') {
    usedProtein = 'eggs';
  }

  return {
    id: `meal-${mealType}-${Date.now()}`,
    name: mealNames[mealType],
    type: mealType,
    protein: usedProtein,
    calories: totalCalories,
    macros: {
      protein: Math.round(totalCalories * 0.3 / 4),
      carbs: Math.round(totalCalories * 0.4 / 4),
      fats: Math.round(totalCalories * 0.3 / 9),
    },
    ingredients,
    instructions: 'Prepare all ingredients and combine according to your preference. Cook protein sources thoroughly.',
    prepTime: 20,
  };
};

const generateMockMealPlan = (
  bodyArea: BodyArea,
  fitnessGoal: FitnessGoal,
  dietary: DietaryPreference,
  proteinPrefs?: ProteinPreference[]
): MealPlan => {
  const meals: Meal[] = [
    generateMockMeal('breakfast', dietary, proteinPrefs?.[0]),
    generateMockMeal('lunch', dietary, proteinPrefs?.[1]),
    generateMockMeal('dinner', dietary, proteinPrefs?.[2]),
    generateMockMeal('snack', dietary),
  ];

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalMacros: Macros = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.macros.protein,
      carbs: acc.carbs + meal.macros.carbs,
      fats: acc.fats + meal.macros.fats,
    }),
    { protein: 0, carbs: 0, fats: 0 }
  );

  const goalLabels: Record<FitnessGoal, string> = {
    toning: 'Toning',
    muscle: 'Muscle Building',
    cardio: 'Cardio Focused',
    weightloss: 'Weight Loss',
    strength: 'Strength Building',
  };

  const dietaryLabels: Record<DietaryPreference, string> = {
    standard: 'Balanced',
    vegetarian: 'Vegetarian',
    keto: 'Keto',
    highprotein: 'High Protein',
    glutenfree: 'Gluten-Free',
    dairyfree: 'Dairy-Free',
  };

  return {
    id: `mealplan-${Date.now()}`,
    name: `${goalLabels[fitnessGoal]} ${dietaryLabels[dietary]} Plan`,
    bodyArea,
    fitnessGoal,
    dietaryPreference: dietary,
    proteinPreferences: proteinPrefs,
    meals,
    totalCalories,
    macros: totalMacros,
    createdAt: new Date(),
  };
};

// Service methods
export const mealService = {
  /**
   * Generate a meal plan based on fitness goal and dietary preference
   */
  generateMealPlan: async (
    bodyArea: BodyArea,
    fitnessGoal: FitnessGoal,
    dietary: DietaryPreference,
    proteinPrefs?: ProteinPreference[]
  ): Promise<MealPlan> => {
    try {
      const response = await fetch('http://localhost:3000/api/meals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bodyArea, fitnessGoal, dietaryPreference: dietary, proteinPreferences: proteinPrefs }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // Fallback to mock data if API fails
      await mockDelay(800);
      return generateMockMealPlan(bodyArea, fitnessGoal, dietary, proteinPrefs);
    }
  },

  /**
   * Regenerate a specific meal with a different protein
   */
  regenerateMealWithProtein: async (
    mealPlan: MealPlan,
    mealType: MealType,
    newProtein: ProteinPreference
  ): Promise<Meal> => {
    try {
      const response = await fetch('http://localhost:3000/api/meals/regenerate-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mealPlanId: mealPlan.id,
          mealType, 
          protein: newProtein,
          dietaryPreference: mealPlan.dietaryPreference 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to regenerate meal');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error regenerating meal:', error);
      // Fallback to mock data
      await mockDelay(500);
      return generateMockMeal(mealType, mealPlan.dietaryPreference, newProtein);
    }
  },

  /**
   * Get saved meal plans
   */
  getMealPlans: async (): Promise<MealPlan[]> => {
    try {
      const response = await fetch('http://localhost:3000/api/meals');
      if (!response.ok) throw new Error('Failed to fetch meal plans');
      return await response.json();
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      return [];
    }
  },

  /**
   * Save a meal plan
   */
  saveMealPlan: async (mealPlan: MealPlan): Promise<MealPlan> => {
    try {
      const response = await fetch('http://localhost:3000/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealPlan),
      });
      if (!response.ok) throw new Error('Failed to save meal plan');
      return await response.json();
    } catch (error) {
      console.error('Error saving meal plan:', error);
      return mealPlan;
    }
  },
};
