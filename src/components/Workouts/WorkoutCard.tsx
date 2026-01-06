import type { Workout } from '../../types';
import { Card } from '../Common';

interface WorkoutCardProps {
  workout: Workout;
  onClick?: () => void;
}

export default function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <Card hover={!!onClick} onClick={onClick} className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{workout.name}</h3>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary-100 text-primary-800">
              {workout.bodyArea}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary-100 text-secondary-800">
              {workout.difficulty}
            </span>
            {workout.completed && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                Completed
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{workout.estimatedDuration} min</span>
            </div>
            <div className="flex justify-between">
              <span>Exercises:</span>
              <span className="font-medium">{workout.exercises.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Calories:</span>
              <span className="font-medium">{workout.caloriesBurned} kcal</span>
            </div>
          </div>
        </div>

        {workout.completedDate && (
          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            Completed: {new Date(workout.completedDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  );
}
