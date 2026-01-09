import { useEffect } from 'react';
import { useProgress, useMealTracking } from '../hooks';
import { ProgressDashboard } from '../components/Progress';
import { Loading, Button } from '../components/Common';
import { useAuth0Context } from '../hooks/useAuth0Context';
import { useNavigate } from 'react-router-dom';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect, user } = useAuth0Context();
  const { stats, isLoading } = useProgress();
  const { dailyLog, isLoading: mealLogLoading, getDailyLog } = useMealTracking();

  // Load today's meal log when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      getDailyLog(user.sub);
    }
  }, [isAuthenticated, user, getDailyLog]);

  // Show loading while checking auth
  if (authLoading) {
    return <Loading text="Loading..." />;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
          <p className="text-gray-600 mt-2">
            Track your fitness journey and celebrate your achievements
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sign in to track your progress
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create an account or sign in to track your workouts, meals, and weight over time.
            </p>
            <Button onClick={() => loginWithRedirect()} variant="primary">
              Sign In to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (isLoading) {
    return <Loading text="Loading your progress..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Progress</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your fitness journey and celebrate your achievements
        </p>
      </div>

      {/* Today's Meals Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Meals</h2>
          <Button onClick={() => navigate('/meals')} variant="outline" size="sm">
            Add Meal
          </Button>
        </div>

        {mealLogLoading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading meals...</div>
        ) : dailyLog && dailyLog.meals.length > 0 ? (
          <>
            {/* Calorie Summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dailyLog.totalCalories}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total Calories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dailyLog.totalMacros.protein}g</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{dailyLog.totalMacros.carbs}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{dailyLog.totalMacros.fats}g</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Fats</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal List */}
            <div className="space-y-3">
              {dailyLog.meals.map((entry) => (
                <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium capitalize mb-2">
                        {entry.mealType}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{entry.meal.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{entry.meal.calories} cal</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(entry.loggedAt).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="text-blue-600 dark:text-blue-400">P: {entry.meal.macros.protein}g</span>
                    <span className="text-green-600 dark:text-green-400">C: {entry.meal.macros.carbs}g</span>
                    <span className="text-yellow-600 dark:text-yellow-400">F: {entry.meal.macros.fats}g</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-4">No meals logged today</p>
            <Button onClick={() => navigate('/meals')} variant="primary">
              Log Your First Meal
            </Button>
          </div>
        )}
      </div>

      <ProgressDashboard stats={stats} />
    </div>
  );
}
