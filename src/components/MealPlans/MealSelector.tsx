import { useState } from 'react';
import type { BodyArea, FitnessGoal, DietaryPreference, ProteinPreference, FitnessGoalOption, DietaryPreferenceOption, ProteinPreferenceOption } from '../../types';
import { Button, Card } from '../Common';

interface MealSelectorProps {
  onGenerate: (bodyArea: BodyArea, fitnessGoal: FitnessGoal, dietary: DietaryPreference, proteinPrefs?: ProteinPreference[]) => void;
  isLoading: boolean;
}

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

const proteinOptions: ProteinPreferenceOption[] = [
  { id: 'any', label: 'Any Protein', description: 'No preference' },
  { id: 'chicken', label: 'Chicken', description: 'Lean poultry' },
  { id: 'turkey', label: 'Turkey', description: 'Lean poultry' },
  { id: 'beef', label: 'Beef', description: 'Red meat' },
  { id: 'pork', label: 'Pork', description: 'Pork tenderloin' },
  { id: 'salmon', label: 'Salmon', description: 'Fatty fish' },
  { id: 'tuna', label: 'Tuna', description: 'Lean fish' },
  { id: 'fish', label: 'White Fish', description: 'Cod, tilapia' },
  { id: 'eggs', label: 'Eggs', description: 'Versatile protein' },
  { id: 'tofu', label: 'Tofu', description: 'Plant-based' },
  { id: 'tempeh', label: 'Tempeh', description: 'Fermented soy' },
  { id: 'legumes', label: 'Beans/Lentils', description: 'Plant-based' },
];

export default function MealSelector({ onGenerate, isLoading }: MealSelectorProps) {
  const [selectedBodyArea] = useState<BodyArea>('fullbody'); // Default for simplicity
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference | null>(null);
  const [selectedProteins, setSelectedProteins] = useState<ProteinPreference[]>([]);
  const [showProteinSelector, setShowProteinSelector] = useState(false);

  const handleGenerate = () => {
    if (selectedGoal && selectedDietary) {
      onGenerate(selectedBodyArea, selectedGoal, selectedDietary, selectedProteins.length > 0 ? selectedProteins : undefined);
    }
  };

  const toggleProtein = (protein: ProteinPreference) => {
    setSelectedProteins(prev =>
      prev.includes(protein)
        ? prev.filter(p => p !== protein)
        : [...prev, protein]
    );
  };

  // Filter proteins based on dietary preference
  const availableProteins = proteinOptions.filter(protein => {
    if (selectedDietary === 'vegetarian') {
      return ['any', 'eggs', 'tofu', 'tempeh', 'legumes'].includes(protein.id);
    }
    return true;
  });

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

      {/* Protein Preferences (Optional) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Protein Preferences <span className="text-sm text-gray-500 font-normal">(Optional)</span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProteinSelector(!showProteinSelector)}
          >
            {showProteinSelector ? 'Hide' : 'Show'}
          </Button>
        </div>
        
        {showProteinSelector && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Select your preferred proteins (or leave empty for variety)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableProteins.map((protein) => (
                <button
                  key={protein.id}
                  onClick={() => toggleProtein(protein.id)}
                  className={`p-3 rounded-lg border-2 text-sm transition-all ${
                    selectedProteins.includes(protein.id)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{protein.label}</div>
                  <div className="text-xs opacity-75 mt-0.5">{protein.description}</div>
                </button>
              ))}
            </div>
            {selectedProteins.length > 0 && (
              <div className="text-sm text-gray-600">
                Selected: {selectedProteins.join(', ')}
              </div>
            )}
          </div>
        )}
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
