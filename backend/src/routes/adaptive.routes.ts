import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAdaptiveState, analyzeProgress, updateRecommendationStatus, askAiAssistant, getAiUsage } from '../controllers/adaptive.controller';

const router = Router();

// Protect ALL adaptive learning routes with student JWT authentication
router.use(authenticate);

router.get('/', getAdaptiveState);
router.post('/analyze', analyzeProgress);
router.patch('/recommendations/:id', updateRecommendationStatus);
router.get('/assistant/usage', getAiUsage);
router.post('/assistant', askAiAssistant);

export default router;
