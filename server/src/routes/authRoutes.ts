import express, { Router, Request, Response, NextFunction } from 'express';
import { authController } from '../controllers/authController';

const router: Router = express.Router();

// Authentication routes
const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
};

const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    next(error);
  }
};

router.post('/login', loginHandler);
router.post('/register', registerHandler);

export default router;
