import { Router } from 'express';
import * as ctrl from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, ctrl.listPosts);
router.post('/', protect, ctrl.createPost);
router.post('/:id/like', protect, ctrl.likePost);
router.post('/:id/comments', protect, ctrl.commentOnPost);
router.delete('/:id', protect, ctrl.deletePost);
export default router;
