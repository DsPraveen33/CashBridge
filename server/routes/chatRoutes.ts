import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/chat/:sessionId', ChatController.getMessages);
router.post('/chat/:sessionId', requireAuth, ChatController.sendMessage);

export default router;
