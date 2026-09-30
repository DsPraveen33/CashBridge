import { Router } from 'express';
import { MatchingController } from '../controllers/matchingController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/matches', MatchingController.getMatches);
router.post('/provider/availability', requireAuth, MatchingController.updateAvailability);

export default router;
