import { Link } from 'react-router-dom';
import { Card, Button } from '../components/Common';
import { useProgress } from '../hooks';

export default function Home() {
  const { stats } = useProgress();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">FitFlow</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your personalized fitness companion for achieving your goals with AI-powered workouts and meal plans
        </p>
      </div>

      {/* Quick Stats */}
      {stats.totalWorkouts > 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalWorkouts}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Workouts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCaloriesBurned}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Calories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(stats.averageDuration)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Minutes</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workouts Card */}
        <Card padding="lg" hover className="border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized workout plans tailored to your fitness goals and body area focus
            </p>
            <Link to="/workouts">
              <Button variant="primary" fullWidth size="lg">
                Start Workout
              </Button>
            </Link>
          </div>
        </Card>

        {/* Meal Plans Card */}
        <Card padding="lg" hover className="border-2 border-transparent hover:border-secondary-200 dark:hover:border-secondary-800">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meal Plans</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover nutrition plans designed for your fitness goals and dietary preferences
            </p>
            <Link to="/meals">
              <Button variant="secondary" fullWidth size="lg">
                View Meal Plans
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Features */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Why Choose FitFlow?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI-Powered</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Personalized recommendations based on your goals</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Track Progress</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your journey with detailed analytics</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Stay Motivated</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get encouragement and tips along the way</p>
          </div>
        </div>
      </Card>

      {/* CTA */}
      {stats.totalWorkouts === 0 && (
        <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center">
          <div className="py-8">
            <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Join thousands of users who are achieving their fitness goals with FitFlow
            </p>
            <Link to="/workouts">
              <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                Get Started Now
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
