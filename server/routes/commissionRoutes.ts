import { Router } from 'express';
import { CommissionController } from '../controllers/commissionController';

const router = Router();

router.post('/commission/quote', CommissionController.calculateQuote);

export default router;
