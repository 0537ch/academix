import express, { Request, Response, NextFunction } from 'express';
import { studentController } from '../controllers/studentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Student routes handlers
const createStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.createStudent(req, res);
  } catch (error) {
    next(error);
  }
};

const getStudentsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.getStudents(req, res);
  } catch (error) {
    next(error);
  }
};

const getStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.getStudent(req, res);
  } catch (error) {
    next(error);
  }
};

const updateStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.updateStudent(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.deleteStudent(req, res);
  } catch (error) {
    next(error);
  }
};

const addCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.addCourse(req, res);
  } catch (error) {
    next(error);
  }
};

const removeCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await studentController.removeCourse(req, res);
  } catch (error) {
    next(error);
  }
};

// Student routes
router.post('/', createStudentHandler);
router.get('/', getStudentsHandler);
router.get('/:id', getStudentHandler);
router.put('/:id', updateStudentHandler);
router.delete('/:id', deleteStudentHandler);

// Course management routes
router.post('/:id/courses', addCourseHandler);
router.delete('/:id/courses', removeCourseHandler);

export default router;
