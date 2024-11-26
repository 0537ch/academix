const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');

// Get all grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'firstName lastName')
      .populate('course', 'name code');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new grade
router.post('/', async (req, res) => {
  const grade = new Grade(req.body);
  try {
    const newGrade = await grade.save();
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get grade by ID
router.get('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'firstName lastName')
      .populate('course', 'name code');
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update grade
router.patch('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      grade[key] = req.body[key];
    });
    
    const updatedGrade = await grade.save();
    res.json(updatedGrade);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete grade
router.delete('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    await grade.remove();
    res.json({ message: 'Grade deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
