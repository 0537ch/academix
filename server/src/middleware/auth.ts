import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Authenticating token...');
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: 'Authentication token required' });
    return;
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
    console.log('Token decoded:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
