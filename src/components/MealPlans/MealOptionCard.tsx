import React from 'react';
import { Meal } from '../../types';
import { Card } from '../Common';

interface MealOptionCardProps {
  meal: Meal;
  dailyCalorieTarget: number;
  onClick: () => void;
}

export const MealOptionCard: React.FC<MealOptionCardProps> = ({
  meal,
  dailyCalorieTarget,
  onClick,
}) => {
  const percentOfDaily = Math.round((meal.calories / dailyCalorieTarget) * 100);

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex flex-col h-full">
        {/* Meal Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {meal.name}
        </h3>

        {/* Meal Type Badge */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium capitalize">
            {meal.type}
          </span>
          {meal.isAiGenerated !== undefined && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              meal.isAiGenerated 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}>
              {meal.isAiGenerated ? 'AI Generated' : 'Mock Data'}
            </span>
          )}
        </div>

        {/* Calories */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {meal.calories}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">cal</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {percentOfDaily}% of daily target
          </div>
        </div>

        {/* Macros */}
        <div className="flex gap-3 mb-4 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Protein</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{meal.macros.protein}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Carbs</span>
            <span className="font-semibold text-green-600 dark:text-green-400">{meal.macros.carbs}g</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400 text-xs">Fats</span>
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">{meal.macros.fats}g</span>
          </div>
        </div>

        {/* Time & Difficulty */}
        {(meal.totalTime || meal.difficulty) && (
          <div className="flex gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
            {meal.totalTime && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {meal.totalTime} min
              </div>
            )}
            {meal.difficulty && (
              <div className="flex items-center gap-1 capitalize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {meal.difficulty}
              </div>
            )}
          </div>
        )}

        {/* View Button */}
        <button
          onClick={onClick}
          className="mt-auto w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </Card>
  );
};
