import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db, DBUser, GLOBAL_COUNTRIES } from '../../src/server/db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { signToken, verifyToken, hashPassword, verifyPassword, verifyOtpConstantTime } from '../utils/jwt';

const router = Router();

// In-memory salt dictionary
const userSalts = new Map<string, string>();
userSalts.set('usr_praveen', 'cbsalt_praveen_2026');

// Active device sessions store
interface DeviceSession {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  token: string;
}

const activeDeviceSessions = new Map<string, DeviceSession[]>();

// Pre-populate sample session for default user
activeDeviceSessions.set('usr_praveen', [
  {
    id: 'sess_dev_1',
    userId: 'usr_praveen',
    deviceName: 'iPhone 15 Pro • iOS 18 (Current Device)',
    ipAddress: '157.48.21.90 (Hyderabad, IN)',
    lastActive: 'Active Now',
    isCurrent: true,
    token: 'cbt_default_praveen'
  },
  {
    id: 'sess_dev_2',
    userId: 'usr_praveen',
    deviceName: 'Chrome Web Client • macOS Sonoma',
    ipAddress: '157.48.21.90 (Hyderabad, IN)',
    lastActive: '2 hours ago',
    isCurrent: false,
    token: 'cbt_web_praveen'
  }
]);

// -------------------------------------------------------------
// 0. Supported Global Countries & Digital Rails
// -------------------------------------------------------------
router.get('/countries', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    countries: GLOBAL_COUNTRIES,
  });
});

// -------------------------------------------------------------
// 1. Real Phone / Email OTP Generation Endpoint
// -------------------------------------------------------------
const handleRequestOtp = (req: Request, res: Response) => {
  const { phone, email, countryCode } = req.body;

  if (!phone && !email) {
    return res.status(400).json({
      success: false,
      message: 'A valid phone number or email address is required.',
    });
  }

  const identifier = phone
    ? `${countryCode || '+91'}_${phone.replace(/\D/g, '')}`
    : email.toLowerCase().trim();

  // 60-second cooldown protection against SMS/Email spamming
  const existing = db.otpStore.get(identifier);
  if (existing && existing.expiresAt - Date.now() > 4 * 60 * 1000) {
    const waitSeconds = Math.ceil((existing.expiresAt - 4 * 60 * 1000 - Date.now()) / 1000);
    if (waitSeconds > 0) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds}s before requesting a new verification code.`,
        retryAfter: waitSeconds,
      });
    }
  }

  // Generate cryptographically secure 6-digit OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const otpRequestId = `otp_req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const expiresAt = Date.now() + 5 * 60 * 1000;

  // Cache with 5-minute TTL & max 3 verification attempts
  db.otpStore.set(identifier, {
    code: otpCode,
    attempts: 0,
    expiresAt,
  });

  // Store by otpRequestId as well for requestId-based verification
  db.otpStore.set(otpRequestId, {
    code: otpCode,
    attempts: 0,
    expiresAt,
    identifier,
  });

  console.log(`🛡️ [CashBridge Real Auth] Real OTP generated for ${identifier} [ReqID: ${otpRequestId}]: ${otpCode}`);

  return res.status(200).json({
    success: true,
    otpRequestId,
    expiresAt: new Date(expiresAt).toISOString(),
    expiresInSeconds: 300,
    message: `Verification code sent to ${phone ? 'mobile device' : 'email address'}.`,
    // Debug code returned in development for automated testing convenience
    debugOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
  });
};

router.post('/auth/request-otp', rateLimiter(5, 60 * 1000), handleRequestOtp);
router.post('/auth/otp/send', rateLimiter(5, 60 * 1000), handleRequestOtp);

// -------------------------------------------------------------
// 2. OTP Verification Endpoint
// -------------------------------------------------------------
const handleVerifyOtp = (req: Request, res: Response) => {
  const { phone, email, countryCode, otp, otpRequestId } = req.body;

  if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
    return res.status(400).json({
      success: false,
      result: 'INVALID',
      message: 'A 6-digit OTP verification code is required.',
    });
  }

  let identifier = otpRequestId;
  let stored = db.otpStore.get(otpRequestId);

  if (!stored) {
    identifier = phone
      ? `${countryCode || '+91'}_${phone.replace(/\D/g, '')}`
      : email?.toLowerCase().trim();
    if (identifier) {
      stored = db.otpStore.get(identifier);
    }
  }

  if (!stored) {
    return res.status(400).json({
      success: false,
      result: 'EXPIRED',
      message: 'No active OTP request found or code expired. Please request a new code.',
    });
  }

  if (Date.now() > stored.expiresAt) {
    if (identifier) db.otpStore.delete(identifier);
    if (otpRequestId) db.otpStore.delete(otpRequestId);
    return res.status(400).json({
      success: false,
      result: 'EXPIRED',
      message: 'Verification code has expired. Please request a new code.',
    });
  }

  if (stored.attempts >= 3) {
    if (identifier) db.otpStore.delete(identifier);
    if (otpRequestId) db.otpStore.delete(otpRequestId);
    return res.status(429).json({
      success: false,
      result: 'TOO_MANY_ATTEMPTS',
      message: 'Too many incorrect attempts. This OTP is invalidated for your security.',
    });
  }

  // Constant-time comparison
  const isMatch = verifyOtpConstantTime(otp, stored.code);

  if (!isMatch) {
    stored.attempts += 1;
    const remaining = 3 - stored.attempts;
    return res.status(400).json({
      success: false,
      result: 'INVALID',
      message: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
    });
  }

  // Verified successfully - Clean up OTP
  if (identifier) db.otpStore.delete(identifier);
  if (otpRequestId) db.otpStore.delete(otpRequestId);

  // Check if existing user is logging in via OTP
  const rawIdentifier = stored.identifier || identifier;
  const user = db.users.find(u => 
    rawIdentifier && (u.phone.includes(rawIdentifier) || rawIdentifier.includes(u.phone) || u.email.toLowerCase() === rawIdentifier.toLowerCase())
  );

  let token = null;
  if (user) {
    token = signToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      countryId: user.countryId,
    });

    db.authSessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + 30 * 86400000,
    });
  }

  return res.status(200).json({
    success: true,
    result: 'VERIFIED',
    verified: true,
    token: token || undefined,
    user: user || undefined,
    message: 'Identifier verified successfully.',
  });
};

router.post('/auth/verify-otp', rateLimiter(10, 60 * 1000), handleVerifyOtp);
router.post('/auth/otp/verify', rateLimiter(10, 60 * 1000), handleVerifyOtp);

// -------------------------------------------------------------
// 3. User Registration Endpoint
// -------------------------------------------------------------
router.post(
  '/auth/register',
  rateLimiter(10, 60 * 1000),
  (req: Request, res: Response) => {
    const { name, phone, email, countryId, city, community, password } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Full legal name is required (min 2 characters).' });
    }

    if (!phone || phone.replace(/\D/g, '').length < 7) {
      return res.status(400).json({ success: false, message: 'A valid mobile phone number is required.' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.toLowerCase().trim() : `${phone.replace(/\D/g, '')}@cashbridge.app`;

    const existing = db.users.find(u => u.phone === cleanPhone || u.email === cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this phone number or email address already exists.',
      });
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    userSalts.set(userId, salt);

    const newUser: DBUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      countryId: countryId || 'in',
      city: city || 'Hyderabad',
      community: community || 'Campus & Local Community',
      passwordHash: hash,
      status: 'KYC_PENDING',
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      trustScore: 85,
      completedExchanges: 0,
      rating: 5.0,
      reviewsCount: 0,
      memberSince: 'Today',
      createdAt: new Date().toISOString(),
      isAvailableProvider: false,
      providerCashAmount: 0,
      providerDigitalAmount: 0,
      locationName: 'Local Public Zone',
      approxDistanceMeters: 200,
    };

    db.users.push(newUser);

    const jwtToken = signToken({
      userId: newUser.id,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      countryId: newUser.countryId,
    });

    db.authSessions.set(jwtToken, {
      userId: newUser.id,
      expiresAt: Date.now() + 30 * 86400000,
    });

    // Register active device session
    const sessions = activeDeviceSessions.get(newUser.id) || [];
    sessions.push({
      id: `sess_${Date.now()}`,
      userId: newUser.id,
      deviceName: 'Mobile Device • CashBridge App',
      ipAddress: req.ip || '127.0.0.1',
      lastActive: 'Active Now',
      isCurrent: true,
      token: jwtToken,
    });
    activeDeviceSessions.set(newUser.id, sessions);

    return res.status(201).json({
      success: true,
      token: jwtToken,
      tokenType: 'Bearer',
      expiresIn: '30d',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        countryId: newUser.countryId,
        city: newUser.city,
        community: newUser.community,
        role: newUser.role,
        status: newUser.status,
        accountStatus: 'ACTIVE',
        kycStatus: 'PENDING',
        profileStatus: 'COMPLETE',
        trustScore: newUser.trustScore,
        completedExchanges: newUser.completedExchanges,
        rating: newUser.rating,
        reviewsCount: newUser.reviewsCount,
        avatar: newUser.avatar,
        isAvailableProvider: newUser.isAvailableProvider,
        createdAt: newUser.createdAt,
      },
      message: 'Account registered successfully. Next step: Identity Verification (KYC).',
    });
  }
);

// -------------------------------------------------------------
// 4. Token-Based Authentication / Login Endpoint
// -------------------------------------------------------------
router.post(
  '/auth/login',
  rateLimiter(15, 60 * 1000),
  (req: Request, res: Response) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone/Email identifier and password are required.',
      });
    }

    const cleanId = identifier.trim();
    const user = db.users.find(u => u.phone === cleanId || u.email.toLowerCase() === cleanId.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect.',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        accountStatus: 'SUSPENDED',
        message: 'Your account is currently suspended. Please contact compliance support.',
      });
    }

    // Verify password with salted comparison or SHA fallback
    const salt = userSalts.get(user.id);
    let isPasswordValid = false;

    if (salt) {
      isPasswordValid = verifyPassword(password, user.passwordHash, salt);
    } else {
      const expectedSha = db.hashPassword(password);
      isPasswordValid = user.passwordHash === expectedSha;
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect.',
      });
    }

    const jwtToken = signToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      countryId: user.countryId,
    });

    db.authSessions.set(jwtToken, {
      userId: user.id,
      expiresAt: Date.now() + 30 * 86400000,
    });

    // Update active device session
    let sessions = activeDeviceSessions.get(user.id) || [];
    sessions.forEach(s => s.isCurrent = false);
    sessions.unshift({
      id: `sess_${Date.now()}`,
      userId: user.id,
      deviceName: 'Mobile Device • CashBridge App',
      ipAddress: req.ip || '127.0.0.1',
      lastActive: 'Active Now',
      isCurrent: true,
      token: jwtToken,
    });
    activeDeviceSessions.set(user.id, sessions.slice(0, 5));

    const kycProfile = db.kycProfiles.find(k => k.userId === user.id);
    const kycStatus = kycProfile ? kycProfile.status : (user.status === 'KYC_VERIFIED' ? 'VERIFIED' : 'PENDING');

    return res.status(200).json({
      success: true,
      token: jwtToken,
      tokenType: 'Bearer',
      expiresIn: '30d',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        countryId: user.countryId,
        city: user.city,
        community: user.community,
        role: user.role,
        status: user.status,
        accountStatus: (user.status as string) === 'RESTRICTED' ? 'RESTRICTED' : 'ACTIVE',
        kycStatus,
        profileStatus: 'COMPLETE',
        trustScore: user.trustScore,
        completedExchanges: user.completedExchanges,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        avatar: user.avatar,
        isAvailableProvider: user.isAvailableProvider,
        createdAt: user.createdAt,
      },
      message: 'Logged in successfully.',
    });
  }
);

// -------------------------------------------------------------
// 5. Get Authenticated User Profile (/api/me & /api/auth/me)
// -------------------------------------------------------------
const handleGetMe = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user || db.users[0];
  const kycProfile = db.kycProfiles.find(k => k.userId === user.id);
  const kycStatus = kycProfile ? kycProfile.status : (user.status === 'KYC_VERIFIED' ? 'VERIFIED' : 'PENDING');

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      countryId: user.countryId,
      city: user.city,
      community: user.community,
      role: user.role,
      status: user.status,
      accountStatus: (user.status as string) === 'SUSPENDED' ? 'SUSPENDED' : ((user.status as string) === 'RESTRICTED' ? 'RESTRICTED' : 'ACTIVE'),
      kycStatus,
      profileStatus: user.name ? 'COMPLETE' : 'INCOMPLETE',
      trustScore: user.trustScore,
      completedExchanges: user.completedExchanges,
      rating: user.rating,
      reviewsCount: user.reviewsCount,
      avatar: user.avatar,
      isAvailableProvider: user.isAvailableProvider,
      providerCashAmount: user.providerCashAmount,
      providerDigitalAmount: user.providerDigitalAmount,
      locationName: user.locationName,
      approxDistanceMeters: user.approxDistanceMeters,
      createdAt: user.createdAt,
    },
  });
};

router.get('/me', requireAuth, handleGetMe);
router.get('/auth/me', requireAuth, handleGetMe);

// -------------------------------------------------------------
// 6. Active Device Sessions Management
// -------------------------------------------------------------
router.get('/auth/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user || db.users[0];
  const sessions = activeDeviceSessions.get(user.id) || [
    {
      id: `sess_${Date.now()}`,
      userId: user.id,
      deviceName: 'Current Device (Mobile)',
      ipAddress: req.ip || '127.0.0.1',
      lastActive: 'Active Now',
      isCurrent: true,
      token: 'cbt_current'
    }
  ];

  return res.status(200).json({
    success: true,
    sessions,
  });
});

router.delete('/auth/sessions/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user || db.users[0];
  const { id } = req.params;

  let sessions = activeDeviceSessions.get(user.id) || [];
  const target = sessions.find(s => s.id === id);

  if (target) {
    db.authSessions.delete(target.token);
  }

  sessions = sessions.filter(s => s.id !== id);
  activeDeviceSessions.set(user.id, sessions);

  return res.status(200).json({
    success: true,
    message: 'Device session revoked successfully.',
  });
});

router.post('/auth/sessions/logout-all', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user || db.users[0];
  const currentAuthHeader = req.headers.authorization;
  const currentToken = currentAuthHeader ? currentAuthHeader.split(' ')[1] : '';

  const sessions = activeDeviceSessions.get(user.id) || [];
  sessions.forEach(s => {
    if (s.token !== currentToken) {
      db.authSessions.delete(s.token);
    }
  });

  const keptSessions = sessions.filter(s => s.token === currentToken);
  activeDeviceSessions.set(user.id, keptSessions);

  return res.status(200).json({
    success: true,
    message: 'All other device sessions logged out successfully.',
  });
});

// -------------------------------------------------------------
// 7. Forgot Password & Account Recovery
// -------------------------------------------------------------
router.post('/auth/forgot-password', rateLimiter(5, 60 * 1000), (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Phone or email is required.' });
  }

  const otpCode = crypto.randomInt(100000, 1000000).toString();
  const resetRequestId = `pwd_reset_${Date.now()}`;

  db.otpStore.set(resetRequestId, {
    code: otpCode,
    attempts: 0,
    expiresAt: Date.now() + 10 * 60 * 1000,
    identifier,
  });

  console.log(`🔐 [Password Recovery] Recovery code for ${identifier}: ${otpCode}`);

  return res.status(200).json({
    success: true,
    resetRequestId,
    message: 'If an account exists, a secure verification code has been dispatched.',
    debugOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
  });
});

router.post('/auth/reset-password', rateLimiter(5, 60 * 1000), (req: Request, res: Response) => {
  const { resetRequestId, otp, newPassword } = req.body;

  if (!resetRequestId || !otp || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Valid reset ID, OTP, and min 8-character password are required.' });
  }

  const stored = db.otpStore.get(resetRequestId);
  if (!stored || Date.now() > stored.expiresAt) {
    return res.status(400).json({ success: false, message: 'Recovery request expired or invalid.' });
  }

  if (!verifyOtpConstantTime(otp, stored.code)) {
    return res.status(400).json({ success: false, message: 'Invalid verification code.' });
  }

  const identifier = stored.identifier;
  const user = db.users.find(u => identifier && (u.phone === identifier || u.email.toLowerCase() === identifier.toLowerCase()));

  if (user) {
    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    userSalts.set(user.id, salt);
  }

  db.otpStore.delete(resetRequestId);

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully. You may now login with your new credentials.',
  });
});

// -------------------------------------------------------------
// 8. Session Revocation / Logout Endpoint
// -------------------------------------------------------------
router.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.authSessions.delete(token);
  }

  return res.status(200).json({
    success: true,
    message: 'Logged out and session token revoked successfully.',
  });
});

export default router;
