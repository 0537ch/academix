import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export const authController = {
  async login(req: Request, res: Response) {
    try {
      console.log('Login attempt for:', req.body.email);
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AuthError('Email and password are required', 400);
      }

      const user = await User.findOne({ email }).exec();
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        throw new AuthError('Invalid credentials', 401);
      }

      try {
        const isValidPassword = await user.comparePassword(password);
        console.log('Password valid:', isValidPassword ? 'Yes' : 'No');
        
        if (!isValidPassword) {
          throw new AuthError('Invalid credentials', 401);
        }
      } catch (error) {
        console.error('Password comparison error:', error);
        throw new AuthError('Error validating credentials', 401);
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Convert MongoDB ObjectId to string for response
      const userId = user._id instanceof mongoose.Types.ObjectId 
        ? user._id.toString() 
        : user._id;

      const responseData = {
        token,
        user: {
          _id: userId,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledCourses: user.enrolledCourses.map(id => id.toString())
        }
      };

      console.log('Login successful for:', email);
      res.json(responseData);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AuthError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ 
          message: 'An error occurred during login. Please try again.',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        });
      }
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        throw new AuthError('Email already registered', 400);
      }

      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: role || 'student'
      });

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          enrolledCourses: []
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof AuthError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ 
          message: 'Registration failed. Please try again.',
          error: process.env.NODE_ENV === 'development' ? error : undefined
        });
      }
    }
  }
};
