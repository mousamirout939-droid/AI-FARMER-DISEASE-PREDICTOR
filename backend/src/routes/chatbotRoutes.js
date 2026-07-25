import { Router } from 'express';
import * as ctrl from '../controllers/chatbotController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, ctrl.chatWithBot);
export default router;
