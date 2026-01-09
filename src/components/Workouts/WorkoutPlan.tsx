import type { Workout } from '../../types';
import { Button, Card } from '../Common';
import ExerciseItem from './ExerciseItem';

interface WorkoutPlanProps {
  workout: Workout;
  onToggleExercise: (exerciseId: string, completed: boolean) => void;
  onComplete: () => void;
  onSave: () => void;
  onBack: () => void;
}

export default function WorkoutPlan({
  workout,
  onToggleExercise,
  onComplete,
  onSave,
  onBack,
}: WorkoutPlanProps) {
  const completedExercises = workout.exercises.filter(ex => ex.completed).length;
  const totalExercises = workout.exercises.length;
  const progress = (completedExercises / totalExercises) * 100;
  const allCompleted = completedExercises === totalExercises;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Selection</span>
      </button>

      {/* Workout Header */}
      <Card>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{workout.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400">
                {workout.bodyArea}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-400">
                {workout.difficulty}
              </span>
              {workout.isAiGenerated !== undefined && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  workout.isAiGenerated 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {workout.isAiGenerated ? 'AI Generated' : 'Mock Data'}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{workout.estimatedDuration} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exercises</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{totalExercises}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{workout.caloriesBurned} kcal</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{completedExercises} / {totalExercises} exercises</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Exercise List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h2>
        {workout.exercises.map((exercise) => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onToggleComplete={onToggleExercise}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onSave} variant="outline" fullWidth>
          Save Workout
        </Button>
        <Button
          onClick={onComplete}
          variant="primary"
          fullWidth
          disabled={!allCompleted}
        >
          {allCompleted ? 'Complete Workout' : 'Complete All Exercises First'}
        </Button>
      </div>

      {allCompleted && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="text-center">
            <p className="text-lg font-semibold text-green-900 dark:text-green-400">
              Amazing! You completed all exercises!
            </p>
            <p className="text-sm text-green-700 dark:text-green-500 mt-1">
              Click "Complete Workout" to track your progress
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
