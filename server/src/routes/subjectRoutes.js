import { Router } from 'express';
import { getSubjects, getTopicsBySubject } from '../controllers/subjectController.js';

const router = Router();

router.get('/', getSubjects);
router.get('/:subjectId/topics', getTopicsBySubject);

export default router;
