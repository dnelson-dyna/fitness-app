import { Card } from '../Common';
import type { FitnessGoal, BodyArea, WorkoutBodyArea } from '../../types';

interface ChartsProps {
  workoutsByGoal: Record<FitnessGoal, number>;
  workoutsByArea: Partial<Record<BodyArea, number>>;
}

export default function Charts({ workoutsByGoal, workoutsByArea }: ChartsProps) {
  const goalLabels: Record<FitnessGoal, string> = {
    toning: 'Toning',
    muscle: 'Muscle',
    cardio: 'Cardio',
    weightloss: 'Weight Loss',
    strength: 'Strength',
  };

  const areaLabels: Record<WorkoutBodyArea, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    arms: 'Arms',
    legs: 'Legs',
    core: 'Core',
    fullbody: 'Full Body',
  };

  const totalGoalWorkouts = Object.values(workoutsByGoal).reduce((a, b) => a + b, 0);
  const totalAreaWorkouts = Object.values(workoutsByArea).reduce((a, b) => a + b, 0);

  // Simple bar chart representation
  const renderBar = (label: string, value: number, total: number, color: string) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <div key={label} className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">{label}</span>
          <span className="text-gray-900 font-medium">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Workouts by Goal */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Workouts by Goal</h3>
        {totalGoalWorkouts > 0 ? (
          <div className="space-y-3">
            {Object.entries(workoutsByGoal).map(([goal, count]) =>
              renderBar(goalLabels[goal as FitnessGoal], count, totalGoalWorkouts, 'bg-primary-500')
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            Complete your first workout to see progress!
          </p>
        )}
      </Card>

      {/* Workouts by Body Area */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Workouts by Body Area</h3>
        {totalAreaWorkouts > 0 ? (
          <div className="space-y-3">
            {Object.entries(workoutsByArea).map(([area, count]) =>
              renderBar(areaLabels[area as BodyArea], count, totalAreaWorkouts, 'bg-secondary-500')
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            Complete your first workout to see progress!
          </p>
        )}
      </Card>
    </div>
  );
}
