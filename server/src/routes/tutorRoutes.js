import { Router } from 'express';
import {
  chatWithTutor,
  getConversations,
  getConversationById,
} from '../controllers/tutorController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/chat', protect, chatWithTutor);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);

export default router;
