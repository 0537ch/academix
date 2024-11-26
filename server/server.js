require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import middleware
const { auth, authorize } = require('./middleware/auth');
const { errorHandler, catchAsync, AppError } = require('./middleware/errorHandler');
const { validateStudent, validate } = require('./middleware/validator');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');

// Import models
const Student = require('./models/Student');

// Import routes
const apiRoutes = require('./routes/api');

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(apiLimiter); // Rate limiting for all routes

// Request logging
app.use((req, res, next) => {
    console.log('--------------------');
    console.log('Incoming request:');
    console.log(`${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('--------------------');
    next();
});

// API routes
app.use('/api', auth, apiRoutes);

// Auth routes
app.post('/api/auth/login', authLimiter, catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
        throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = jwt.sign(
        { id: student._id, role: student.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
    );

    res.json({ token });
}));

// Student routes
app.post('/api/students', 
    validateStudent,
    validate,
    catchAsync(async (req, res) => {
        // Hash password if provided
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const student = new Student(req.body);
        const result = await student.save();
        res.status(201).json(result);
    })
);

app.get('/api/students',
    auth,
    authorize(['admin', 'teacher']),
    catchAsync(async (req, res) => {
        const students = await Student.find();
        res.json(students);
    })
);

app.get('/api/students/:id',
    auth,
    catchAsync(async (req, res) => {
        const student = await Student.findById(req.params.id);
        if (!student) {
            throw new AppError('Student not found', 404);
        }
        res.json(student);
    })
);

app.put('/api/students/:id',
    auth,
    validateStudent,
    validate,
    catchAsync(async (req, res) => {
        // Only allow users to update their own profile unless they're an admin
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            throw new AppError('You can only update your own profile', 403);
        }

        // Hash password if it's being updated
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const result = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!result) {
            throw new AppError('Student not found', 404);
        }

        res.json(result);
    })
);

app.delete('/api/students/:id',
    auth,
    authorize(['admin']),
    catchAsync(async (req, res) => {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) {
            throw new AppError('Student not found', 404);
        }
        res.json({ message: 'Student deleted successfully' });
    })
);

// Global error handling
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/academic_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('\nAvailable endpoints:');
        console.log('Auth:');
        console.log('- POST   /api/auth/login');
        console.log('\nStudents:');
        console.log('- GET    /api/students         (Admin, Teacher)');
        console.log('- GET    /api/students/:id     (Authenticated)');
        console.log('- POST   /api/students');
        console.log('- PUT    /api/students/:id     (Owner, Admin)');
        console.log('- DELETE /api/students/:id     (Admin)');
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});
