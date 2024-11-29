import dotenv from 'dotenv';
import path from 'path';

// Determine environment
const environment = process.env.NODE_ENV || 'development';

// Log current working directory and environment
console.log('Current working directory:', process.cwd());
console.log('Current environment:', environment);

// Calculate config path
const configPath = path.resolve(process.cwd(), environment === 'test' ? '.env.test' : '.env');
console.log('Config path:', configPath);

// Load environment variables
const result = dotenv.config({ path: configPath });
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('.env file loaded successfully');
}

// Log environment variables
console.log('Environment variables after loading:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Configuration object with explicit types
interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  environment: string;
}

// Default values for development
const defaultConfig: Config = {
  port: 7000,
  mongoUri: 'mongodb://localhost:27017/academic-system',
  jwtSecret: 'your-secret-key',
  environment
};

// Create config object with environment variables or defaults
export const config: Config = {
  port: parseInt(process.env.PORT || String(defaultConfig.port), 10),
  mongoUri: process.env.MONGODB_URI || defaultConfig.mongoUri,
  jwtSecret: process.env.JWT_SECRET || defaultConfig.jwtSecret,
  environment
};

// Log final configuration
console.log('Final configuration:', config);
