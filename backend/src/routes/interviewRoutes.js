import { Router } from 'express';
import {
    createSession,
    getSessions,
    getSession,
    startSession,
    answerTurn,
    getAssessment,
    getReport,
} from '../controllers/interviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.post('/', createSession);
router.get('/', getSessions);

router.get('/:id', getSession);
router.post('/:id/start', startSession);
router.post('/:id/answer', answerTurn);
router.get('/:id/assessment', getAssessment);
router.get('/:id/report', getReport);

export default router;
