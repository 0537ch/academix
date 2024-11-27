const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');
const { apiLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/register', apiLimiter, authController.register);
router.post('/login', apiLimiter, authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.patch('/profile', auth, authController.updateProfile);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;
