import { useAuth0 } from '@auth0/auth0-react';

export const useAuth0Context = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    userId: user?.sub, // Auth0 unique user ID
  };
};
