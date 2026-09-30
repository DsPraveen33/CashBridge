import { Router, Request, Response } from 'express';
import authRoutes from './auth';
import kycRoutes from './kycRoutes';
import commissionRoutes from './commissionRoutes';
import matchingRoutes from './matchingRoutes';
import exchangeRoutes from './exchangeRoutes';
import chatRoutes from './chatRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

// Health Check & Cloud Run Ping
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'CashBridge Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root API Explorer
router.all('/info', (req: Request, res: Response) => {
  const name = req.body?.name || req.query?.name || 'Developer';
  res.status(200).json({
    success: true,
    message: `Hello ${name}! Welcome to CashBridge Hyperlocal Cash ↔ UPI Exchange API.`,
    endpoints: {
      health: 'GET /api/health',
      countries: 'GET /api/countries',
      auth: {
        requestOtp: 'POST /api/auth/request-otp',
        verifyOtp: 'POST /api/auth/verify-otp',
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/me'
      },
      pricing: 'POST /api/commission/quote',
      matches: 'GET /api/matches',
      exchanges: 'POST /api/exchanges/create',
      kyc: 'POST /api/kyc/submit',
      admin: 'POST /api/admin/login'
    }
  });
});

router.use(authRoutes);
router.use(kycRoutes);
router.use(commissionRoutes);
router.use(matchingRoutes);
router.use(exchangeRoutes);
router.use(chatRoutes);
router.use(adminRoutes);

export default router;
