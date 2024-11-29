import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-system';

async function resetDatabase() {
  try {
    // Ensure connection options are set to resolve potential undefined issues
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Explicitly check the connection
    if (!connection) {
      throw new Error('Failed to establish MongoDB connection');
    }

    console.log('Connected to MongoDB');

    // Ensure the connection is ready before dropping the database
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not fully established');
    }

    // Drop the database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');

  } catch (error) {
    console.error('Error in resetDatabase:', error);
    throw error; // Re-throw to ensure the error is not silently caught
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Use an Immediately Invoked Async Function Expression (IIFE) to handle async operations
(async () => {
  try {
    await resetDatabase();
  } catch (error) {
    console.error('Failed to reset database:', error);
    process.exit(1);
  }
})();
