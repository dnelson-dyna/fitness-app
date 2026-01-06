import type { WorkoutStats } from '../../types';
import { Card } from '../Common';
import StatsCard from './StatsCard';
import Charts from './Charts';
import { WorkoutCard } from '../Workouts';

interface ProgressDashboardProps {
  stats: WorkoutStats;
}

export default function ProgressDashboard({ stats }: ProgressDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Workouts"
            value={stats.totalWorkouts}
            subtitle="All time"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatsCard
            title="Calories Burned"
            value={stats.totalCaloriesBurned}
            subtitle="Total kcal"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            }
          />
          <StatsCard
            title="Avg Duration"
            value={`${Math.round(stats.averageDuration)} min`}
            subtitle="Per workout"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            title="This Week"
            value={stats.recentWorkouts.filter(w => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return w.completedDate && new Date(w.completedDate) > weekAgo;
            }).length}
            subtitle="Workouts completed"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Charts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Breakdown</h2>
        <Charts workoutsByGoal={stats.workoutsByGoal} workoutsByArea={stats.workoutsByArea} />
      </div>

      {/* Recent Workouts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Workouts</h2>
        {stats.recentWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts yet</h3>
              <p className="text-gray-600 mb-4">Start your fitness journey today!</p>
            </div>
          </Card>
        )}
      </div>

      {/* Motivation Card */}
      {stats.totalWorkouts > 0 && (
        <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold mb-2">
              Keep Going!
            </h3>
            <p className="text-white/90">
              You've completed {stats.totalWorkouts} workout{stats.totalWorkouts !== 1 ? 's' : ''} and burned {stats.totalCaloriesBurned} calories.
              Your dedication is inspiring!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
