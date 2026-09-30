import { Router } from 'express';
import { ExchangeController } from '../controllers/exchangeController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/exchanges/create', requireAuth, ExchangeController.create);
router.post('/exchanges/:id/advance', requireAuth, ExchangeController.advance);
router.post('/exchanges/:id/confirm-payment', requireAuth, ExchangeController.confirmPayment);
router.post('/exchanges/:id/dispute', requireAuth, ExchangeController.dispute);

export default router;
