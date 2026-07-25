import { Router } from 'express';
import * as ctrl from '../controllers/weatherController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, ctrl.getWeatherByLocation);
export default router;
