import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addStudentToCourse,
  removeStudentFromCourse
} from '../controllers/courseController';

const router = express.Router();

// Protected routes
router.use(authenticateToken);

// Course routes
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Student enrollment routes
router.post('/:id/students', addStudentToCourse);
router.delete('/:id/students', removeStudentFromCourse);

export default router;
