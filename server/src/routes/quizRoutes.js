import { Router } from 'express';
import {
  generateQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getQuizResults,
} from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/generate', protect, generateQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', protect, submitQuizAttempt);
router.get('/results/:id', protect, getQuizResults);

export default router;
