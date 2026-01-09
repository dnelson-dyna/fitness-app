import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const buildNumber = import.meta.env.VITE_BUILD_NUMBER || new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const isProduction = import.meta.env.PROD;

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto mb-16 md:mb-0 transition-colors">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {currentYear} FitFlow. Empowering your fitness journey.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Build {buildNumber} {isProduction ? '(Production)' : '(Development)'}
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
              About
            </Link>
            <Link to="/settings" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
              Profile
            </Link>
            <Link to="/feedback" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
