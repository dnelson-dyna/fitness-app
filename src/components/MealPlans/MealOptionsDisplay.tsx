import React from 'react';
import { Meal } from '../../types';
import { MealOptionCard } from './MealOptionCard';
import { Button } from '../Common';

interface MealOptionsDisplayProps {
  meals: Meal[];
  dailyCalorieTarget: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onSelectMeal: (meal: Meal) => void;
  onMoreOptions: () => void;
  isLoadingMore: boolean;
}

const mealTypeRanges: Record<string, string> = {
  breakfast: '350-500 cal',
  lunch: '500-700 cal',
  dinner: '500-700 cal',
  snack: '150-250 cal',
};

export const MealOptionsDisplay: React.FC<MealOptionsDisplayProps> = ({
  meals,
  dailyCalorieTarget,
  mealType,
  onSelectMeal,
  onMoreOptions,
  isLoadingMore,
}) => {
  return (
    <div className="space-y-6">
      {/* Info Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
              {mealType} Options
            </h2>
            <p className="text-sm text-gray-600">
              Choose one of these meals to fit your goals
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Daily Target:</span>
              <span className="text-lg font-bold text-blue-600">{dailyCalorieTarget} cal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Recommended Range:</span>
              <span className="text-lg font-semibold text-gray-700">
                {mealTypeRanges[mealType]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <MealOptionCard
            key={meal.id}
            meal={meal}
            dailyCalorieTarget={dailyCalorieTarget}
            onClick={() => onSelectMeal(meal)}
          />
        ))}
      </div>

      {/* More Options Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onMoreOptions}
          variant="outline"
          disabled={isLoadingMore}
          className="min-w-[200px]"
        >
          {isLoadingMore ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            'More Options'
          )}
        </Button>
      </div>
    </div>
  );
};
