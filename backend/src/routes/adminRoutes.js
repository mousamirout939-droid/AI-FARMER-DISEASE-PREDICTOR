import { Router } from 'express';
import * as ctrl from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect, authorize('admin'));
router.get('/stats', ctrl.getDashboardStats);
router.get('/users', ctrl.listUsers);
router.patch('/users/:id/status', ctrl.updateUserStatus);
router.patch('/users/:id/verify-expert', ctrl.verifyExpert);
router.get('/community', ctrl.listCommunityPostsAdmin);
export default router;
