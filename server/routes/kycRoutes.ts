import { Router } from 'express';
import { KycController } from '../controllers/kycController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/kyc/start', requireAuth, KycController.startSession);
router.post('/kyc/submit', requireAuth, KycController.submit);
router.get('/kyc/status', requireAuth, KycController.getStatus);

export default router;
