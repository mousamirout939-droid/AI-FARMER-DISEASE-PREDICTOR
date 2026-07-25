import { Router } from 'express';
import * as ctrl from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/', authorize('farmer'), ctrl.bookAppointment);
router.get('/', ctrl.listAppointments);
router.patch('/:id/status', authorize('expert', 'admin'), ctrl.updateAppointmentStatus);
export default router;
