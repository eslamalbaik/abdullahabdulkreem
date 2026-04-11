import { Router } from 'express';
import * as controller from '../controllers/dynamicQuestionnaireController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.get('/public/:slug', controller.getPublicQuestionnaire);
router.post('/public/:slug/submit', controller.submitResponse);

// Admin routes (Protected)
router.use(protect);
router.use(authorize('admin'));

router.get('/', controller.getQuestionnaires);
router.post('/', controller.createQuestionnaire);
router.get('/:id', controller.getQuestionnaireById);
router.patch('/:id', controller.updateQuestionnaire);
router.delete('/:id', controller.deleteQuestionnaire);

router.get('/:id/responses', controller.getResponses);

router.post('/:id/questions', controller.addQuestion);
router.patch('/:id/questions/:questionId', controller.updateQuestion);
router.delete('/:id/questions/:questionId', controller.deleteQuestion);

export default router;
