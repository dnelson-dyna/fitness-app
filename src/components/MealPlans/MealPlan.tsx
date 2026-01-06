import type { MealPlan as MealPlanType } from '../../types';
import { Button, Card } from '../Common';
import MealCard from './MealCard';

interface MealPlanProps {
  mealPlan: MealPlanType;
  onSave: () => void;
  onBack: () => void;
}

export default function MealPlan({ mealPlan, onSave, onBack }: MealPlanProps) {
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Selection</span>
      </button>

      {/* Meal Plan Header */}
      <Card>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mealPlan.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                {mealPlan.fitnessGoal}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800">
                {mealPlan.dietaryPreference}
              </span>
            </div>
          </div>

          {/* Daily Totals */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600">Daily Total</p>
              <p className="text-3xl font-bold text-gray-900">{mealPlan.totalCalories}</p>
              <p className="text-xs text-gray-600">calories</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Protein</p>
                <p className="text-lg font-semibold text-gray-900">{mealPlan.macros.protein}g</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Carbs</p>
                <p className="text-lg font-semibold text-gray-900">{mealPlan.macros.carbs}g</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Fats</p>
                <p className="text-lg font-semibold text-gray-900">{mealPlan.macros.fats}g</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Meals for Today</h2>
        {mealPlan.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {/* Save Button */}
      <Button onClick={onSave} variant="primary" fullWidth size="lg">
        Save Meal Plan
      </Button>

      {/* Nutrition Tip */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <div className="flex gap-3">
          <div className="text-blue-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Nutrition Tip</h3>
            <p className="text-sm text-blue-800">
              Stay hydrated throughout the day! Aim for at least 8 glasses of water.
              Proper hydration supports your fitness goals and overall health.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
