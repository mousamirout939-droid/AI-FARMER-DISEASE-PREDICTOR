import { Router } from 'express';
import * as ctrl from '../controllers/diseaseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.listDiseases);
router.get('/:id', ctrl.getDisease);
router.post('/', protect, authorize('admin', 'expert'), ctrl.createDisease);
router.put('/:id', protect, authorize('admin', 'expert'), ctrl.updateDisease);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteDisease);

export default router;
