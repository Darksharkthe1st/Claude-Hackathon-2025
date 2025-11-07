import { Router } from 'express';

import { getProjectChat, postProjectMessage } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/:projectId', authenticate, getProjectChat);
router.post('/:projectId', authenticate, postProjectMessage);

export default router;

