const Student = require('../models/Student');
const mongoose = require('mongoose'); // mongoose is required for ObjectId validation

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single student
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update allowed fields
    if (updates.firstName) student.firstName = updates.firstName;
    if (updates.lastName) student.lastName = updates.lastName;
    if (updates.email) student.email = updates.email;
    
    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
};
