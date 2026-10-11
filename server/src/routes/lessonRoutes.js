import { Router } from 'express';
import {
  getLessons,
  getLessonById,
  toggleBookmark,
  getBookmarks,
} from '../controllers/lessonController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getLessons);
router.get('/bookmarks/all', protect, getBookmarks);
router.get('/:id', getLessonById);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
