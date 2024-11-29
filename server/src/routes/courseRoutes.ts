import express, { Request, Response, NextFunction, Router } from 'express';
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

const router: Router = express.Router();

// Course routes handlers
const getCoursesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await getCourses(req, res);
  } catch (error) {
    next(error);
  }
};

const getCourseByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await getCourseById(req, res);
  } catch (error) {
    next(error);
  }
};

const createCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await createCourse(req, res);
  } catch (error) {
    next(error);
  }
};

const updateCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await updateCourse(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteCourse(req, res);
  } catch (error) {
    next(error);
  }
};

const addStudentHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await addStudentToCourse(req, res);
  } catch (error) {
    next(error);
  }
};

const removeStudentHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await removeStudentFromCourse(req, res);
  } catch (error) {
    next(error);
  }
};

// Routes with authentication
router.all('*', authenticateToken);

// Course routes
router.get('/', getCoursesHandler);
router.get('/:id', getCourseByIdHandler);
router.post('/', createCourseHandler);
router.put('/:id', updateCourseHandler);
router.delete('/:id', deleteCourseHandler);

// Student enrollment routes
router.post('/:id/students', addStudentHandler);
router.delete('/:id/students', removeStudentHandler);

export default router;
