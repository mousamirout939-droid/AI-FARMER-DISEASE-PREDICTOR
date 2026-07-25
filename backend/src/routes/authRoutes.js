import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  ctrl.register
);

router.post(
  '/login',
  authLimiter,
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  ctrl.login
);

router.post('/google', authLimiter, ctrl.googleLogin);
router.post('/otp/request', authLimiter, [body('email').isEmail()], validate, ctrl.requestOtp);
router.post('/otp/verify', authLimiter, [body('email').isEmail(), body('otp').notEmpty()], validate, ctrl.verifyOtp);
router.post('/forgot-password', authLimiter, [body('email').isEmail()], validate, ctrl.forgotPassword);
router.post(
  '/reset-password',
  authLimiter,
  [body('token').notEmpty(), body('password').isLength({ min: 6 })],
  validate,
  ctrl.resetPassword
);
router.post('/refresh-token', ctrl.refreshToken);
router.post('/logout', protect, ctrl.logout);
router.get('/me', protect, ctrl.getMe);

export default router;
