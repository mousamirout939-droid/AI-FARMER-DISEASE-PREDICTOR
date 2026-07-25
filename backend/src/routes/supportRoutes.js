import { Router } from 'express';
import * as ctrl from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.post('/', ctrl.createTicket);
router.get('/my', ctrl.listMyTickets);
router.get('/', authorize('admin'), ctrl.listAllTickets);
router.post('/:id/respond', authorize('admin', 'expert'), ctrl.respondToTicket);
export default router;
