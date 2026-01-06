import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto mb-16 md:mb-0">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} FitFlow. Empowering your fitness journey.
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
              About
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
              Settings
            </Link>
            <Link to="/feedback" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
