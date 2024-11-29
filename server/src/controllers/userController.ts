import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      console.log('Getting profile for user:', req.user?.userId);
      const userId = req.user?.userId;
      if (!userId) {
        console.log('No user ID found in request');
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const user = await User.findById(userId).select('-password');
      console.log('Found user:', user);
      
      if (!user) {
        console.log('No user found with ID:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      const profile = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profilePicture: null,
        lastLogin: user.updatedAt,
        createdAt: user.createdAt
      };
      console.log('Returning profile:', profile);
      res.json(profile);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { name, currentPassword, newPassword } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If name is provided, update it
      if (name) {
        const [firstName, ...lastNameParts] = name.trim().split(' ');
        user.firstName = firstName;
        user.lastName = lastNameParts.join(' ') || firstName; // If no last name, use first name
      }

      // If password change is requested
      if (currentPassword && newPassword) {
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Current password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();

      res.json({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profilePicture: null,
        lastLogin: user.updatedAt,
        createdAt: user.createdAt
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  }
};
