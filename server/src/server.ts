import app from './app';
import { config } from './config';

// Load environment variables
// dotenv.config();

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
