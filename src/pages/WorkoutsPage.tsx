import { useWorkouts, useProgress } from '../hooks';
import { WorkoutSelector, WorkoutPlan } from '../components/Workouts';
import { Loading } from '../components/Common';

export default function WorkoutsPage() {
  const { currentWorkout, isLoading, generateWorkout, toggleExercise, completeWorkout, saveWorkout, clearCurrentWorkout } = useWorkouts();
  const { updateStats } = useProgress();

  const handleComplete = async () => {
    if (currentWorkout) {
      await completeWorkout(currentWorkout.id);
      updateStats({ ...currentWorkout, completed: true, completedDate: new Date() });
      alert('Congratulations! Workout completed! 🎉');
      clearCurrentWorkout();
    }
  };

  const handleSave = async () => {
    if (currentWorkout) {
      await saveWorkout(currentWorkout);
      alert('Workout saved successfully!');
    }
  };

  if (isLoading) {
    return <Loading text="Generating your personalized workout..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Workouts</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {currentWorkout
            ? 'Complete your exercises and track your progress'
            : 'Choose your focus area and fitness goal to generate a personalized workout'}
        </p>
      </div>

      {currentWorkout ? (
        <WorkoutPlan
          workout={currentWorkout}
          onToggleExercise={(exerciseId, completed) =>
            toggleExercise(currentWorkout.id, exerciseId, completed)
          }
          onComplete={handleComplete}
          onSave={handleSave}
          onBack={clearCurrentWorkout}
        />
      ) : (
        <WorkoutSelector onGenerate={generateWorkout} isLoading={isLoading} />
      )}
    </div>
  );
}
