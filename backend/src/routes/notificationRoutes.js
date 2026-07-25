import { Router } from 'express';
import * as ctrl from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', ctrl.listNotifications);
router.patch('/:id/read', ctrl.markAsRead);
router.post('/', authorize('admin'), ctrl.createNotification);
export default router;
