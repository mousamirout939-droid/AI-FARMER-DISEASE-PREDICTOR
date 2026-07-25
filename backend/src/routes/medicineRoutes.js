import { Router } from 'express';
import * as ctrl from '../controllers/medicineController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.listMedicines);
router.post('/', protect, authorize('admin', 'expert'), ctrl.createMedicine);
router.put('/:id', protect, authorize('admin', 'expert'), ctrl.updateMedicine);
router.delete('/:id', protect, authorize('admin'), ctrl.deleteMedicine);

export default router;
