import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0Context } from '../../hooks/useAuth0Context';
import { Button } from '../Common';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0Context();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FitFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/workouts"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Workouts
            </Link>
            <Link
              to="/meals"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Meal Plans
            </Link>
            <Link
              to="/progress"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Progress
            </Link>
            
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
                    <span className="text-sm text-gray-700">{user?.name}</span>
                    <Link
                      to="/settings"
                      className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    >
                      Settings
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
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
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/workouts"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workouts
              </Link>
              <Link
                to="/meals"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Meal Plans
              </Link>
              <Link
                to="/progress"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
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
                        className="text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout({ logoutParams: { returnTo: window.location.origin } });
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-left text-gray-700 hover:text-primary-600 transition-colors font-medium py-2"
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
