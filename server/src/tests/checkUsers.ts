import mongoose from 'mongoose';
import User from '../models/User';
import { config } from '../config';

async function checkUsers() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    const users = await User.find().select('-password');
    console.log('Total users:', users.length);
    console.log('Users:', JSON.stringify(users, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
