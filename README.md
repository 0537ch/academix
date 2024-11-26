# Academic Information System

A modern web-based Academic Information System built with React.js, Node.js, and MongoDB.

## Features

- Beautiful and responsive UI using Argon Dashboard
- Student management
- Course management
- Grade tracking
- Academic schedule
- Teacher management
- Performance analytics

## Tech Stack

- Frontend:
  - React.js
  - React Router v6
  - Argon Dashboard UI
  - Chart.js for analytics
  - Reactstrap components

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Bcrypt for password hashing

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Create a `.env` file in the backend directory with your MongoDB URI:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

4. Run the application:
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from client directory)
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
academic-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Static assets (images, css)
│   │   ├── components/    # Reusable components
│   │   ├── layouts/       # Page layouts
│   │   ├── views/         # Page components
│   │   └── variables/     # Chart configurations
│   └── package.json
│
└── backend/               # Backend Node.js application
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── server.js         # Express application
    └── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
