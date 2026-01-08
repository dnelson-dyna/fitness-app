import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const { isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      navigate('/');
    }
  }, [isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 to-pink-200">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="mt-4 text-white text-lg">Logging in...</p>
      </div>
    </div>
  );
}
