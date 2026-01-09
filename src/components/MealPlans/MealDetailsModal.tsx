import React, { useState } from 'react';
import { Meal } from '../../types';

interface MealDetailsModalProps {
  meal: Meal;
  dailyCalorieTarget: number;
  onClose: () => void;
  onMakeIt: (meal: Meal) => void;
  isLoggingMeal?: boolean;
}

type TabType = 'overview' | 'ingredients' | 'instructions' | 'substitutions';

export const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  meal,
  dailyCalorieTarget,
  onClose,
  onMakeIt,
  isLoggingMeal = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const remainingCalories = dailyCalorieTarget - meal.calories;
  const percentOfDaily = Math.round((meal.calories / dailyCalorieTarget) * 100);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* Calorie Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Daily Target:</span>
                <span className="font-semibold">{dailyCalorieTarget} cal</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">This Meal:</span>
                <span className="font-semibold text-orange-600">{meal.calories} cal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="font-semibold text-green-600">{remainingCalories} cal</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                ({percentOfDaily}% of daily target)
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">{meal.macros.protein}g</div>
                <div className="text-xs text-gray-500 mt-1">Protein</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{meal.macros.carbs}g</div>
                <div className="text-xs text-gray-500 mt-1">Carbs</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-yellow-600">{meal.macros.fats}g</div>
                <div className="text-xs text-gray-500 mt-1">Fats</div>
              </div>
            </div>

            {/* Timing & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              {meal.prepTime && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Prep Time:</span>
                  <span className="font-medium">{meal.prepTime} min</span>
                </div>
              )}
              {meal.cookTime && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Cook Time:</span>
                  <span className="font-medium">{meal.cookTime} min</span>
                </div>
              )}
              {meal.totalTime && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Total Time:</span>
                  <span className="font-medium">{meal.totalTime} min</span>
                </div>
              )}
              {meal.difficulty && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="font-medium capitalize">{meal.difficulty}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'ingredients':
        return (
          <div className="space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id || index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{ingredient.name}</div>
                  <div className="text-sm text-gray-500">{ingredient.amount}</div>
                </div>
                <div className="text-sm font-semibold text-orange-600">
                  {ingredient.calories} cal
                </div>
              </div>
            ))}
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-3">
            {meal.instructions && meal.instructions.length > 0 ? (
              meal.instructions.map((instruction) => (
                <div key={instruction.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {instruction.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700">{instruction.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No instructions available for this meal.
              </p>
            )}
          </div>
        );

      case 'substitutions':
        return (
          <div className="space-y-4">
            {meal.substitutions && meal.substitutions.length > 0 ? (
              meal.substitutions.map((substitution, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 uppercase text-sm">
                    {substitution.ingredient}
                  </h4>
                  <div className="space-y-2">
                    {substitution.alternatives.map((alt, altIndex) => (
                      <div key={altIndex} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{alt.name}</span>
                          {alt.calories && (
                            <span className="text-sm text-orange-600 font-semibold">
                              {alt.calories} cal
                            </span>
                          )}
                        </div>
                        {alt.amount && (
                          <div className="text-sm text-gray-600 mb-1">{alt.amount}</div>
                        )}
                        {alt.notes && (
                          <div className="text-sm text-gray-500 italic">{alt.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No substitutions available for this meal.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{meal.name}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                  {meal.type}
                </span>
                {meal.isAiGenerated !== undefined && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    meal.isAiGenerated 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {meal.isAiGenerated ? 'AI Generated' : 'Mock Data'}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {(['overview', 'ingredients', 'instructions', 'substitutions'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onMakeIt(meal)}
            disabled={isLoggingMeal}
            className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors ${
              isLoggingMeal
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoggingMeal ? 'Logging...' : 'Make It'}
          </button>
        </div>
      </div>
    </div>
  );
};
