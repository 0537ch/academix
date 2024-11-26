const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const studentsRouter = require('./routes/students');
const courseRoutes = require('./routes/courses');
const gradeRoutes = require('./routes/grades');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRouter);
app.use('/api/courses', courseRoutes);
app.use('/api/grades', gradeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
