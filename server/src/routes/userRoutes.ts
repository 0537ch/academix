import express, { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Profile routes handlers
const getProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.getProfile(req, res);
  } catch (error) {
    next(error);
  }
};

const updateProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
};

// Profile routes
router.get('/profile', getProfileHandler);
router.put('/profile', updateProfileHandler);

export default router;
