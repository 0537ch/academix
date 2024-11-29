import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { config } from '../config';

const users = [
  {
    email: 'jane.smith@example.com',
    password: 'password123', // This will be hashed
    role: 'teacher',
    firstName: 'Jane',
    lastName: 'Smith'
  },
  {
    email: 'admin@example.com',
    password: 'admin123', // This will be hashed
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    email: 'student@example.com',
    password: 'student123', // This will be hashed
    role: 'student',
    firstName: 'John',
    lastName: 'Doe'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Insert users
    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();
