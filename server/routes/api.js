const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const courseController = require('../controllers/courseController');

// Student routes
router.get('/students', studentController.getAllStudents);
router.get('/students/:id', studentController.getStudent);
router.post('/students', studentController.createStudent);
router.put('/students/:id', studentController.updateStudent);
router.delete('/students/:id', studentController.deleteStudent);

// Course routes
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:id', courseController.getCourse);
router.post('/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// Enrollment routes
router.post('/courses/:courseId/students/:studentId', courseController.enrollStudent);
router.delete('/courses/:courseId/students/:studentId', courseController.removeStudent);

module.exports = router;
