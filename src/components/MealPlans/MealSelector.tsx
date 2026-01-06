import { useState } from 'react';
import type { BodyArea, FitnessGoal, DietaryPreference, BodyAreaOption, FitnessGoalOption, DietaryPreferenceOption } from '../../types';
import { Button, Card } from '../Common';

interface MealSelectorProps {
  onGenerate: (bodyArea: BodyArea, fitnessGoal: FitnessGoal, dietary: DietaryPreference) => void;
  isLoading: boolean;
}

const bodyAreas: BodyAreaOption[] = [
  { id: 'fullbody', label: 'General', description: 'Balanced nutrition' },
  { id: 'muscle', label: 'Muscle Focus', description: 'High protein' },
  { id: 'cardio', label: 'Cardio Focus', description: 'Energy boost' },
];

const fitnessGoals: FitnessGoalOption[] = [
  { id: 'toning', label: 'Toning', description: 'Lean muscle' },
  { id: 'muscle', label: 'Muscle Building', description: 'Gain mass' },
  { id: 'cardio', label: 'Endurance', description: 'Sustained energy' },
  { id: 'weightloss', label: 'Weight Loss', description: 'Calorie deficit' },
  { id: 'strength', label: 'Strength', description: 'Power and performance' },
];

const dietaryPreferences: DietaryPreferenceOption[] = [
  { id: 'standard', label: 'No Restrictions', description: 'Balanced meals' },
  { id: 'vegetarian', label: 'Vegetarian', description: 'Plant-based protein' },
  { id: 'keto', label: 'Keto/Low-Carb', description: 'High fat, low carb' },
  { id: 'highprotein', label: 'High Protein', description: 'Protein focused' },
  { id: 'glutenfree', label: 'Gluten-Free', description: 'No gluten' },
  { id: 'dairyfree', label: 'Dairy-Free', description: 'No dairy products' },
];

export default function MealSelector({ onGenerate, isLoading }: MealSelectorProps) {
  const [selectedBodyArea] = useState<BodyArea>('fullbody'); // Default for simplicity
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference | null>(null);

  const handleGenerate = () => {
    if (selectedGoal && selectedDietary) {
      onGenerate(selectedBodyArea, selectedGoal, selectedDietary);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fitness Goal Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900">Select Fitness Goal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fitnessGoals.map((goal) => (
            <Card
              key={goal.id}
              padding="sm"
              hover
              onClick={() => setSelectedGoal(goal.id)}
              className={`cursor-pointer transition-all ${
                selectedGoal === goal.id
                  ? 'ring-2 ring-secondary-500 bg-secondary-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <h3 className="font-medium text-gray-900">{goal.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Dietary Preference Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900">Select Dietary Preference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dietaryPreferences.map((pref) => (
            <Card
              key={pref.id}
              padding="sm"
              hover
              onClick={() => setSelectedDietary(pref.id)}
              className={`cursor-pointer transition-all ${
                selectedDietary === pref.id
                  ? 'ring-2 ring-primary-500 bg-primary-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <h3 className="font-medium text-gray-900">{pref.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{pref.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!selectedGoal || !selectedDietary}
        isLoading={isLoading}
        fullWidth
        size="lg"
      >
        Generate Meal Plan
      </Button>
    </div>
  );
}
