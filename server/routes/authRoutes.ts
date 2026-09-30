import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/countries', AuthController.getCountries);
router.post('/auth/otp/send', rateLimiter(10, 60000), AuthController.sendOtp);
router.post('/auth/otp/verify', rateLimiter(10, 60000), AuthController.verifyOtp);
router.post('/auth/register', AuthController.register);
router.post('/auth/login', rateLimiter(15, 60000), AuthController.login);
router.get('/auth/me', requireAuth, AuthController.getMe);

export default router;
