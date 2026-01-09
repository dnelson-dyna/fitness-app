import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0Context } from '../../hooks/useAuth0Context';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../Common';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0Context();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">FitFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/workouts"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Workouts
            </Link>
            <Link
              to="/meals"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Meal Plans
            </Link>
            <Link
              to="/progress"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Progress
            </Link>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {/* Auth Section */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {user?.picture && (
                      <img 
                        src={user.picture} 
                        alt={user.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name}</span>
                    <Link
                      to="/settings"
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                    >
                      Profile
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => loginWithRedirect()}>
                    Sign In with Google
                  </Button>
                )}
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-900 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link
                to="/workouts"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workouts
              </Link>
              <Link
                to="/meals"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meal Plans
              </Link>
              <Link
                to="/progress"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Progress
              </Link>
              
              {/* Mobile Auth Section */}
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/settings"
                        className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout({ logoutParams: { returnTo: window.location.origin } });
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2"
                      >
                        Sign Out ({user?.name})
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        loginWithRedirect();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left text-primary-600 hover:text-primary-700 transition-colors font-medium py-2"
                    >
                      Sign In with Google
                    </button>
                  )}
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
