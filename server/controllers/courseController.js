const Course = require('../models/Course');
const mongoose = require('mongoose');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    Object.keys(updates).forEach((key) => {
      course[key] = updates[key];
    });

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.remove();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enroll student in course
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid course or student ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    if (!course.canEnroll()) {
      return res.status(400).json({ message: 'Course enrollment limit reached' });
    }

    await course.enrollStudent(studentId);
    res.status(200).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove student from course
exports.removeStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid course or student ID' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not enrolled in this course' });
    }

    await course.removeStudent(studentId);
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
