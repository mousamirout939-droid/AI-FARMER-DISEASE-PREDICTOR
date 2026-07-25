import { Router } from 'express';
import * as ctrl from '../controllers/marketController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/prices', protect, ctrl.getMarketPrices);
router.get('/schemes', protect, ctrl.getGovernmentSchemes);
export default router;
