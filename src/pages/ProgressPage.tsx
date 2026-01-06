import { useProgress } from '../hooks';
import { ProgressDashboard } from '../components/Progress';
import { Loading } from '../components/Common';

export default function ProgressPage() {
  const { stats, isLoading } = useProgress();

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
