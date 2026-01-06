import type { MealPlan, Meal, Ingredient, Macros, BodyArea, FitnessGoal, DietaryPreference, MealType } from '../types';
import { mockDelay } from './api';

/**
 * Meal planning service with mock data
 */

const generateMockIngredients = (mealType: MealType, dietary: DietaryPreference): Ingredient[] => {
  const ingredients: Record<MealType, Ingredient[]> = {
    breakfast: [
      { id: '1', name: 'Oats', amount: '1 cup', calories: 150 },
      { id: '2', name: 'Banana', amount: '1 medium', calories: 105 },
      { id: '3', name: 'Almond Butter', amount: '2 tbsp', calories: 190 },
    ],
    lunch: [
      { id: '4', name: 'Chicken Breast', amount: '6 oz', calories: 280 },
      { id: '5', name: 'Brown Rice', amount: '1 cup', calories: 215 },
      { id: '6', name: 'Broccoli', amount: '1 cup', calories: 55 },
    ],
    dinner: [
      { id: '7', name: 'Salmon', amount: '6 oz', calories: 350 },
      { id: '8', name: 'Sweet Potato', amount: '1 medium', calories: 180 },
      { id: '9', name: 'Asparagus', amount: '1 cup', calories: 40 },
    ],
    snack: [
      { id: '10', name: 'Greek Yogurt', amount: '1 cup', calories: 130 },
      { id: '11', name: 'Mixed Berries', amount: '1/2 cup', calories: 40 },
    ],
  };

  // Modify based on dietary preference
  if (dietary === 'vegetarian') {
    if (mealType === 'lunch') {
      ingredients.lunch[0] = { id: '4v', name: 'Tofu', amount: '6 oz', calories: 180 };
    }
    if (mealType === 'dinner') {
      ingredients.dinner[0] = { id: '7v', name: 'Tempeh', amount: '6 oz', calories: 220 };
    }
  }

  return ingredients[mealType];
};

const generateMockMeal = (mealType: MealType, dietary: DietaryPreference): Meal => {
  const ingredients = generateMockIngredients(mealType, dietary);
  const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);

  const mealNames: Record<MealType, string> = {
    breakfast: 'Power Breakfast Bowl',
    lunch: 'Balanced Lunch Plate',
    dinner: 'Wholesome Dinner',
    snack: 'Healthy Snack',
  };

  return {
    id: `meal-${mealType}-${Date.now()}`,
    name: mealNames[mealType],
    type: mealType,
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
  dietary: DietaryPreference
): MealPlan => {
  const meals: Meal[] = [
    generateMockMeal('breakfast', dietary),
    generateMockMeal('lunch', dietary),
    generateMockMeal('dinner', dietary),
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
    dietary: DietaryPreference
  ): Promise<MealPlan> => {
    try {
      const response = await fetch('http://localhost:3000/api/meals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bodyArea, fitnessGoal, dietaryPreference: dietary }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating meal plan:', error);
      // Fallback to mock data if API fails
      await mockDelay(800);
      return generateMockMealPlan(bodyArea, fitnessGoal, dietary);
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
