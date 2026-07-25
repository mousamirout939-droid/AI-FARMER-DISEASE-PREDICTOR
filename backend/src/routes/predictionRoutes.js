import { Router } from 'express';
import * as ctrl from '../controllers/predictionController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect);
router.post('/', upload.single('image'), ctrl.createPrediction);
router.get('/', ctrl.getMyPredictions);
router.get('/:id', ctrl.getPredictionById);
router.get('/:id/report', ctrl.generateReport);
router.delete('/:id', ctrl.deletePrediction);

export default router;
