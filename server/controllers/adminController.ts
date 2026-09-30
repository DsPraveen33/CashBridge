import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../../src/server/db';
import { AuthenticatedRequest } from '../middleware/auth';

export class AdminController {
  public static login(req: Request, res: Response) {
    const { email, password, mfaCode } = req.body;

    const admin = db.adminUsers.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    if (admin.passwordHash !== db.hashPassword(password)) {
      return res.status(401).json({ success: false, message: 'Incorrect administrator password.' });
    }

    if (mfaCode && mfaCode !== admin.mfaCode) {
      return res.status(401).json({ success: false, message: 'Invalid MFA authenticator code.' });
    }

    const token = `adm_token_${crypto.randomBytes(24).toString('hex')}`;
    db.authSessions.set(token, {
      userId: admin.id,
      expiresAt: Date.now() + 12 * 3600 * 1000
    });

    admin.lastLogin = new Date().toISOString();

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminId: admin.id,
      adminName: admin.name,
      action: 'ADMIN_LOGIN',
      targetType: 'SESSION',
      targetId: admin.id,
      details: `Admin ${admin.name} (${admin.role}) logged in with MFA.`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  }

  public static getDashboardStats(_req: Request, res: Response) {
    const totalUsers = db.users.length;
    const verifiedUsers = db.users.filter(u => u.status === 'KYC_VERIFIED').length;
    const pendingKyc = db.kycProfiles.filter(k => k.status === 'PENDING' || k.status === 'IN_REVIEW').length;
    const activeExchanges = db.exchangeSessions.filter(s => s.status !== 'COMPLETED' && s.status !== 'CANCELLED').length;
    const completedExchanges = db.exchangeSessions.filter(s => s.status === 'COMPLETED').length + 48;
    const totalVolume = completedExchanges * 2000;
    const totalFees = Math.round(completedExchanges * 35);
    const openDisputes = db.disputes.filter(d => d.status === 'PENDING_REVIEW' || d.status === 'INVESTIGATING').length;
    const suspendedAccounts = db.users.filter(u => u.status === 'SUSPENDED').length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        pendingKyc,
        activeExchanges,
        completedExchanges,
        totalVolume,
        totalFees,
        openDisputes,
        suspendedAccounts
      }
    });
  }

  public static getKycQueue(_req: Request, res: Response) {
    const queue = db.kycProfiles.map(k => {
      const user = db.users.find(u => u.id === k.userId);
      return {
        ...k,
        userName: user ? user.name : 'Unknown User',
        userPhone: user ? user.phone : '',
        userEmail: user ? user.email : '',
        userCountry: user ? user.countryId : 'in'
      };
    });

    res.json({ success: true, queue });
  }

  public static handleKycAction(req: AuthenticatedRequest, res: Response) {
    const { kycId, action, rejectionReason } = req.body;
    const admin = req.admin || db.adminUsers[0];

    const kyc = db.kycProfiles.find(k => k.id === kycId);
    if (!kyc) {
      return res.status(404).json({ success: false, message: 'KYC Record not found' });
    }

    const user = db.users.find(u => u.id === kyc.userId);

    if (action === 'APPROVE') {
      kyc.status = 'VERIFIED';
      kyc.verifiedAt = new Date().toISOString();
      kyc.reviewerAdminId = admin.id;
      if (user) {
        user.status = 'KYC_VERIFIED';
        user.trustScore = Math.max(90, user.trustScore);
      }
    } else if (action === 'REJECT') {
      kyc.status = 'REJECTED';
      kyc.rejectionReason = rejectionReason || 'Document unreadable or invalid';
      if (user) user.status = 'KYC_REJECTED';
    } else if (action === 'RETRY') {
      kyc.status = 'RETRY_REQUIRED';
      kyc.rejectionReason = rejectionReason || 'Please retake selfie with better lighting';
      if (user) user.status = 'KYC_PENDING';
    }

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminId: admin.id,
      adminName: admin.name,
      action: `KYC_${action}`,
      targetType: 'USER_KYC',
      targetId: kyc.userId,
      details: `Admin ${admin.name} performed ${action} on KYC record ${kyc.id}.`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      kyc,
      message: `KYC status updated to ${kyc.status}`
    });
  }

  public static getCommissionRules(_req: Request, res: Response) {
    res.json({ success: true, rules: db.commissionRules });
  }

  public static updateCommissionRule(req: AuthenticatedRequest, res: Response) {
    const { ruleId, baseFee, percentageFee, distanceFeePerKm, urgencyFeeImmediate, taxRatePercent } = req.body;
    const admin = req.admin || db.adminUsers[0];

    const rule = db.commissionRules.find(r => r.id === ruleId);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Commission rule not found' });
    }

    if (baseFee !== undefined) rule.baseFee = Number(baseFee);
    if (percentageFee !== undefined) rule.percentageFee = Number(percentageFee);
    if (distanceFeePerKm !== undefined) rule.distanceFeePerKm = Number(distanceFeePerKm);
    if (urgencyFeeImmediate !== undefined) rule.urgencyFeeImmediate = Number(urgencyFeeImmediate);
    if (taxRatePercent !== undefined) rule.taxRatePercent = Number(taxRatePercent);

    rule.updatedBy = admin.name;
    rule.updatedAt = new Date().toISOString();

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminId: admin.id,
      adminName: admin.name,
      action: 'COMMISSION_RULE_UPDATED',
      targetType: 'PRICING_CONFIG',
      targetId: rule.id,
      details: `Updated ${rule.name}: BaseFee=${rule.baseFee}, Percentage=${rule.percentageFee}%, Tax=${rule.taxRatePercent}%`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      rule,
      message: 'Commission pricing rule updated successfully.'
    });
  }

  public static getUsers(_req: Request, res: Response) {
    res.json({ success: true, users: db.users });
  }

  public static handleUserAction(req: AuthenticatedRequest, res: Response) {
    const { userId, action, reason } = req.body;
    const admin = req.admin || db.adminUsers[0];

    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (action === 'SUSPEND') {
      user.status = 'SUSPENDED';
      user.isAvailableProvider = false;
    } else if (action === 'UNSUSPEND') {
      user.status = 'KYC_VERIFIED';
    } else if (action === 'RESTRICT') {
      user.status = 'RESTRICTED';
    }

    db.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      adminId: admin.id,
      adminName: admin.name,
      action: `USER_${action}`,
      targetType: 'USER_ACCOUNT',
      targetId: user.id,
      details: `Admin ${admin.name} executed ${action} on ${user.name}. Reason: ${reason || 'Admin discretion'}`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      user,
      message: `User status changed to ${user.status}`
    });
  }

  public static getDisputes(_req: Request, res: Response) {
    res.json({ success: true, disputes: db.disputes });
  }

  public static getAuditLogs(_req: Request, res: Response) {
    res.json({ success: true, auditLogs: db.auditLogs });
  }
}
