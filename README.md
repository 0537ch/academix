# Academic Management System

A comprehensive academic management system built with TypeScript, React, Node.js, Express, and MongoDB.

## Features

- User Authentication (JWT-based)
- Role-based Access Control (Admin, Teacher, Student)
- Course Management
- Student Enrollment
- Modern UI with Framer Motion animations
- Comprehensive Error Handling
- TypeScript Support

## Tech Stack

### Frontend
- React with TypeScript
- React Router DOM for routing
- Axios for API requests
- React Toastify for notifications
- Framer Motion for animations
- Tailwind CSS for styling

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/0537ch/academix
cd academic-system
```

2. Install dependencies:

For the backend:
```bash
cd server
npm install
```

For the frontend:
```bash
cd client
npm install
```

3. Set up environment variables:

Create a `.env` file in the server directory:
```env
PORT=7000
MONGODB_URI=mongodb://127.0.0.1:27017/academic_system
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Running the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the backend server:
```bash
cd server
npm start
```

3. Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000 or http://localhost:5173
- Backend API: http://localhost:7000

## Default Admin Account

Use these credentials to log in as admin:
- Email: abrar@abrar.com
- Password: abrar

## API Endpoints

### Authentication
- POST /api/auth/login - Login
- POST /api/auth/register - Register new user

### Users
- GET /api/users - Get all users (Admin only)
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user (Admin only)

### Courses
- GET /api/courses - Get all courses
- POST /api/courses - Create new course (Admin/Teacher only)
- GET /api/courses/:id - Get course by ID
- PUT /api/courses/:id - Update course (Admin/Teacher only)
- DELETE /api/courses/:id - Delete course (Admin only)

### Students
- GET /api/students/courses - Get enrolled courses
- POST /api/students/enroll/:courseId - Enroll in course
- DELETE /api/students/withdraw/:courseId - Withdraw from course

## Error Handling

The system includes comprehensive error handling:
- Custom error classes for different types of errors
- Detailed error messages in development
- Sanitized error messages in production
- Frontend toast notifications for errors
- Network error handling
- Authentication error handling

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- CORS configuration
- Error message sanitization
- Password field exclusion from queries


