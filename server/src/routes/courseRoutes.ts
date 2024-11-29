import express from 'express';
import { courseController } from '../controllers/courseController';
import { authenticateToken as auth } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes (authentication required)
router.use(auth);

// Admin only routes
router.post('/', async (req, res, next) => {
  try {
    await adminOnly(req, res, next);
    await courseController.createCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await adminOnly(req, res, next);
    await courseController.updateCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await adminOnly(req, res, next);
    await courseController.deleteCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Student routes
router.post('/:id/enroll', courseController.enrollInCourse);
router.post('/:id/unenroll', courseController.unenrollFromCourse);

export default router;
