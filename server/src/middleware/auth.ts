import type { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

/**
 * Authentication middleware (placeholder for Azure AD B2C)
 * In production, this would validate JWT tokens from Azure AD B2C
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // For development/testing: Extract user from header or use mock user
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // In development, allow requests without auth
      // In production, this would return 401
      if (process.env.NODE_ENV === 'development') {
        // Mock user for development
        req.user = {
          id: 'dev-user-123',
          email: 'dev@example.com',
          name: 'Development User',
        };
        next();
        return;
      }

      res.status(401).json({ error: 'No authorization token provided' });
      return;
    }

    // TODO: Implement Azure AD B2C token validation
    // const token = authHeader.replace('Bearer ', '');
    // const validatedUser = await validateAzureB2CToken(token);
    // req.user = validatedUser;

    // For now, use mock user in development
    req.user = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User',
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

/**
 * Optional authentication - allows both authenticated and unauthenticated requests
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // Try to authenticate, but don't fail if it doesn't work
      await authenticateUser(req, res, () => {});
    }
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};
