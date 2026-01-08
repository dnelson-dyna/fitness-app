import React, { ReactNode } from 'react';
import { Auth0Provider as Auth0ProviderOrig } from '@auth0/auth0-react';

interface Auth0ProviderProps {
  children: ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'fitflow-dev.us.auth0.com';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
  
  // Determine redirect URI based on environment
  const redirectUri = 
    window.location.origin + '/callback' || 
    (import.meta.env.DEV 
      ? 'http://localhost:5173/callback'
      : 'https://blue-rock-0765eaa0f.1.azurestaticapps.net/callback'
    );

  return (
    <Auth0ProviderOrig
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      }}
    >
      {children}
    </Auth0ProviderOrig>
  );
};
