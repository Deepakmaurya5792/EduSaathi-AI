import { Router } from 'express';
import {
  getAssignedStudents,
  getStudentProgressDetail,
  getClassInsights,
} from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Only teachers and admins can access teacher analytics
router.use(protect);
router.use(authorize('teacher', 'admin'));

router.get('/students', getAssignedStudents);
router.get('/students/:studentId/progress', getStudentProgressDetail);
router.get('/class-insights', getClassInsights);

export default router;
