import mongoose from 'mongoose';
import User from '../models/User';

const createUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/academic_system');
    console.log('Connected to MongoDB');

    // Create new user
    const userData = {
      email: 'abrar@abrar.com',
      password: 'abrar',
      firstName: 'Abrar',
      lastName: 'User',
      role: 'admin'
    };

    // Delete existing user if exists
    await User.deleteOne({ email: userData.email });

    // Create new user
    const user = new User(userData);
    await user.save();

    console.log('User created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createUser();
