import { Router } from 'express';
import {
  getAdminAnalytics,
  getUsers,
  updateUserRole,
  createLesson,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Only admins can access admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getAdminAnalytics);
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.post('/lessons', createLesson);

export default router;
