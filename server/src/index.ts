import app from './app';
import { config } from './config';

console.log('Starting server...');
console.log('Configuration:', config);

const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
