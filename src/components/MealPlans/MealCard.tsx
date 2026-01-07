import { useState } from 'react';
import type { Meal, ProteinPreference, MealType } from '../../types';
import { Card, Button } from '../Common';

interface MealCardProps {
  meal: Meal;
  onChangeProtein?: (mealType: MealType, newProtein: ProteinPreference) => void;
  dietaryPreference?: string;
}

const proteinOptions: { id: ProteinPreference; label: string }[] = [
  { id: 'chicken', label: 'Chicken' },
  { id: 'turkey', label: 'Turkey' },
  { id: 'beef', label: 'Beef' },
  { id: 'pork', label: 'Pork' },
  { id: 'salmon', label: 'Salmon' },
  { id: 'tuna', label: 'Tuna' },
  { id: 'fish', label: 'White Fish' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'tofu', label: 'Tofu' },
  { id: 'tempeh', label: 'Tempeh' },
  { id: 'legumes', label: 'Beans/Lentils' },
];

export default function MealCard({ meal, onChangeProtein, dietaryPreference }: MealCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showProteinOptions, setShowProteinOptions] = useState(false);

  const handleProteinChange = (newProtein: ProteinPreference) => {
    if (onChangeProtein) {
      onChangeProtein(meal.type, newProtein);
      setShowProteinOptions(false);
    }
  };

  // Filter proteins based on dietary preference
  const availableProteins = proteinOptions.filter(protein => {
    if (dietaryPreference === 'vegetarian') {
      return ['eggs', 'tofu', 'tempeh', 'legumes'].includes(protein.id);
    }
    return true;
  });

  const mealTypeColors: Record<string, string> = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-blue-100 text-blue-800',
    dinner: 'bg-purple-100 text-purple-800',
    snack: 'bg-green-100 text-green-800',
  };

  return (
    <Card>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${mealTypeColors[meal.type]}`}>
              {meal.type.toUpperCase()}
            </span>
            <h3 className="font-semibold text-gray-900 mt-2">{meal.name}</h3>
            {meal.protein && (
              <p className="text-sm text-gray-600 mt-1">
                Protein: <span className="font-medium">{meal.protein}</span>
              </p>
            )}
            {meal.prepTime && (
              <p className="text-sm text-gray-600 mt-1">Prep time: {meal.prepTime} min</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{meal.calories}</p>
            <p className="text-xs text-gray-600">calories</p>
          </div>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-600">Protein</p>
            <p className="font-semibold text-gray-900">{meal.macros.protein}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Carbs</p>
            <p className="font-semibold text-gray-900">{meal.macros.carbs}g</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Fats</p>
            <p className="font-semibold text-gray-900">{meal.macros.fats}g</p>
          </div>
        </div>

        {/* Change Protein Button */}
        {meal.protein && onChangeProtein && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProteinOptions(!showProteinOptions)}
              fullWidth
            >
              {showProteinOptions ? 'Cancel' : 'Change Protein'}
            </Button>
            
            {showProteinOptions && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {availableProteins.map((protein) => (
                  <button
                    key={protein.id}
                    onClick={() => handleProteinChange(protein.id)}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      meal.protein === protein.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                        : 'border-gray-200 hover:border-primary-300 text-gray-700'
                    }`}
                    disabled={meal.protein === protein.id}
                  >
                    {protein.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium text-left"
        >
          {showDetails ? 'Hide' : 'Show'} Ingredients & Instructions
        </button>

        {/* Details */}
        {showDetails && (
          <div className="space-y-3 pt-3 border-t">
            {/* Ingredients */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
              <ul className="space-y-1">
                {meal.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-sm text-gray-700 flex justify-between">
                    <span>• {ingredient.name} - {ingredient.amount}</span>
                    <span className="text-gray-500">{ingredient.calories} cal</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
              <p className="text-sm text-gray-700">{meal.instructions}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
