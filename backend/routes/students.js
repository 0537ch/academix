const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single student
router.get('/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new student
router.post('/', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if email already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const student = new User({
      ...req.body,
      role: 'student',
      username: req.body.email.split('@')[0]
    });

    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student
router.patch('/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Don't allow role changes through this endpoint
    delete req.body.role;
    
    // Don't update password through this endpoint
    delete req.body.password;

    Object.keys(req.body).forEach(key => {
      student[key] = req.body[key];
    });

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.remove();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's courses
router.get('/:id/courses', async (req, res) => {
  try {
    const courses = await Course.find({ students: req.params.id })
      .populate('teacher', 'firstName lastName');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's grades
router.get('/:id/grades', async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.id })
      .populate('course', 'name code');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
