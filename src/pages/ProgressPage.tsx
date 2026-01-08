import { useProgress } from '../hooks';
import { ProgressDashboard } from '../components/Progress';
import { Loading, Button } from '../components/Common';
import { useAuth0Context } from '../hooks/useAuth0Context';

export default function ProgressPage() {
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect } = useAuth0Context();
  const { stats, isLoading } = useProgress();

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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to track your progress
            </h2>
            <p className="text-gray-600 mb-6">
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
        <h1 className="text-3xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-600 mt-2">
          Track your fitness journey and celebrate your achievements
        </p>
      </div>

      <ProgressDashboard stats={stats} />
    </div>
  );
}
