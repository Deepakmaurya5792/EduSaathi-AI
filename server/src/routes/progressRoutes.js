import { Router } from 'express';
import {
  getProgressOverview,
  getSubjectProgress,
  getWeakTopics,
  getRecommendations,
  getQuizHistory,
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/overview', protect, getProgressOverview);
router.get('/subjects', protect, getSubjectProgress);
router.get('/weak-topics', protect, getWeakTopics);
router.get('/recommendations', protect, getRecommendations);
router.get('/history', protect, getQuizHistory);

export default router;
