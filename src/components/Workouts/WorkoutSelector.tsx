import { useState } from 'react';
import type { BodyArea, FitnessGoal, Difficulty, BodyAreaOption, FitnessGoalOption } from '../../types';
import { Button, Card } from '../Common';

interface WorkoutSelectorProps {
  onGenerate: (bodyArea: BodyArea, fitnessGoal: FitnessGoal, difficulty: Difficulty) => void;
  isLoading: boolean;
}

const bodyAreas: BodyAreaOption[] = [
  { id: 'chest', label: 'Chest', description: 'Build upper body strength' },
  { id: 'back', label: 'Back', description: 'Strengthen your back' },
  { id: 'shoulders', label: 'Shoulders', description: 'Sculpt your shoulders' },
  { id: 'arms', label: 'Arms', description: 'Tone your arms' },
  { id: 'legs', label: 'Legs', description: 'Power up your legs' },
  { id: 'core', label: 'Core', description: 'Strengthen your core' },
  { id: 'fullbody', label: 'Full Body', description: 'Complete workout' },
];

const fitnessGoals: FitnessGoalOption[] = [
  { id: 'toning', label: 'Toning/Sculpting', description: 'Lean and defined' },
  { id: 'muscle', label: 'Building Muscle', description: 'Grow and strengthen' },
  { id: 'cardio', label: 'Cardio & Endurance', description: 'Build stamina' },
  { id: 'weightloss', label: 'Weight Loss', description: 'Burn calories' },
  { id: 'strength', label: 'Building Strength', description: 'Increase power' },
];

const difficulties: { id: Difficulty; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function WorkoutSelector({ onGenerate, isLoading }: WorkoutSelectorProps) {
  const [selectedBodyArea, setSelectedBodyArea] = useState<BodyArea | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner');

  const handleGenerate = () => {
    if (selectedBodyArea && selectedGoal) {
      onGenerate(selectedBodyArea, selectedGoal, selectedDifficulty);
    }
  };

  return (
    <div className="space-y-6">
      {/* Body Area Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Select Body Area</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {bodyAreas.map((area) => (
            <Card
              key={area.id}
              padding="sm"
              hover
              onClick={() => setSelectedBodyArea(area.id)}
              className={`cursor-pointer transition-all ${
                selectedBodyArea === area.id
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400 bg-primary-50 dark:bg-primary-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="text-center">
                <h3 className="font-medium text-gray-900 dark:text-white">{area.label}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{area.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fitness Goal Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Select Fitness Goal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {fitnessGoals.map((goal) => (
            <Card
              key={goal.id}
              padding="sm"
              hover
              onClick={() => setSelectedGoal(goal.id)}
              className={`cursor-pointer transition-all ${
                selectedGoal === goal.id
                  ? 'ring-2 ring-secondary-500 dark:ring-secondary-400 bg-secondary-50 dark:bg-secondary-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{goal.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Select Difficulty</h2>
        <div className="flex gap-3">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                selectedDifficulty === diff.id
                  ? 'bg-accent-500 dark:bg-accent-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!selectedBodyArea || !selectedGoal}
        isLoading={isLoading}
        fullWidth
        size="lg"
      >
        Generate Workout Plan
      </Button>
    </div>
  );
}
