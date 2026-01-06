import { useState } from 'react';
import type { Exercise } from '../../types';
import { Card } from '../Common';

interface ExerciseItemProps {
  exercise: Exercise;
  onToggleComplete: (exerciseId: string, completed: boolean) => void;
}

export default function ExerciseItem({ exercise, onToggleComplete }: ExerciseItemProps) {
  const [showTips, setShowTips] = useState(false);

  return (
    <Card padding="md" className={exercise.completed ? 'bg-green-50' : ''}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={exercise.completed}
          onChange={(e) => onToggleComplete(exercise.id, e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        />

        {/* Exercise Details */}
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 ${exercise.completed ? 'line-through' : ''}`}>
            {exercise.name}
          </h3>

          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>{exercise.sets} sets</span>
            <span>•</span>
            <span>{exercise.reps} reps</span>
            {exercise.duration && (
              <>
                <span>•</span>
                <span>{exercise.duration}s hold</span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-700 mt-2">{exercise.description}</p>

          {/* Form Tips Toggle */}
          {exercise.formTips && exercise.formTips.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setShowTips(!showTips)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {showTips ? 'Hide' : 'Show'} Form Tips
              </button>

              {showTips && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {exercise.formTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
