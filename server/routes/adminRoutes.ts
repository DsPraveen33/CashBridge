import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { requireAdmin } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/admin/login', rateLimiter(10, 60000), AdminController.login);
router.get('/admin/dashboard-stats', requireAdmin(), AdminController.getDashboardStats);
router.get('/admin/kyc-queue', requireAdmin(['SUPER_ADMIN', 'KYC_REVIEWER']), AdminController.getKycQueue);
router.post('/admin/kyc-action', requireAdmin(['SUPER_ADMIN', 'KYC_REVIEWER']), AdminController.handleKycAction);
router.get('/admin/commission-rules', requireAdmin(), AdminController.getCommissionRules);
router.post('/admin/commission-rules', requireAdmin(['SUPER_ADMIN', 'PRICING_ADMIN']), AdminController.updateCommissionRule);
router.get('/admin/users', requireAdmin(), AdminController.getUsers);
router.post('/admin/user-action', requireAdmin(['SUPER_ADMIN', 'MODERATOR']), AdminController.handleUserAction);
router.get('/admin/disputes', requireAdmin(['SUPER_ADMIN', 'MODERATOR']), AdminController.getDisputes);
router.get('/admin/audit-logs', requireAdmin(['SUPER_ADMIN']), AdminController.getAuditLogs);

export default router;
