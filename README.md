# Academic Management System

A comprehensive web application for managing academic activities, built with React and Node.js.

## Features

- 🔐 **Authentication & Authorization**
  - User registration and login
  - Role-based access control (Admin/User)
  - Protected routes
  - Token-based authentication

- 👨‍💼 **Admin Dashboard**
  - Comprehensive admin interface
  - Course management
  - Student management
  - User management
  - Profile settings

- 📚 **Course Management**
  - Create, read, update, and delete courses
  - Student enrollment
  - Course scheduling
  - Teacher assignment

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Framer Motion for animations
- Material Tailwind components

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- TypeScript for type safety

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/0537ch/academix.git
cd academic-system
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:
Create `.env` files in both client and server directories:

Server `.env`:
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/academic-system
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:

For backend:
```bash
cd server
npm run dev
```

For frontend:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5002

## Project Structure

```
academic-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main application component
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   └── app.ts         # Express application setup
    └── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Courses
- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get course by ID
- POST `/api/courses` - Create new course
- PUT `/api/courses/:id` - Update course
- DELETE `/api/courses/:id` - Delete course
- POST `/api/courses/:id/enroll` - Enroll student in course
- DELETE `/api/courses/:id/enroll` - Remove student from course

### Users
- GET `/api/users` - Get all users (admin only)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
