import { Request, Response, NextFunction } from 'express';
import { db } from '../../src/server/db';
import { verifyToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: any;
  admin?: any;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];

  // Try decoding as cryptographically signed JWT token first
  const decoded = verifyToken(token);
  let userId = decoded ? decoded.userId : null;

  // Fallback to active memory session store
  if (!userId) {
    const session = db.authSessions.get(token);
    if (session && session.expiresAt >= Date.now()) {
      userId = session.userId;
    }
  }

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid token.' });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User account not found.' });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({ success: false, message: 'Account is suspended.' });
  }

  req.user = user;
  next();
}

export function requireAdmin(roles: string[] = ['SUPER_ADMIN', 'KYC_REVIEWER', 'MODERATOR', 'PRICING_ADMIN']) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['x-admin-authorization'] || req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Administrative access required.' });
    }

    const token = authHeader.split(' ')[1];

    // Check decoded JWT or session map
    const decoded = verifyToken(token);
    let userId = decoded ? decoded.userId : null;

    if (!userId) {
      const session = db.authSessions.get(token);
      if (session && session.expiresAt >= Date.now()) {
        userId = session.userId;
      }
    }

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Admin session expired or invalid.' });
    }

    const admin = db.adminUsers.find(a => a.id === userId);
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Unauthorized administrative role.' });
    }

    if (roles.length > 0 && !roles.includes(admin.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires role: ${roles.join(' or ')}` });
    }

    req.admin = admin;
    next();
  };
}
