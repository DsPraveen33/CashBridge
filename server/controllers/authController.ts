import { Request, Response } from 'express';
import crypto from 'crypto';
import { db, GLOBAL_COUNTRIES, DBUser } from '../../src/server/db';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  public static getCountries(_req: Request, res: Response) {
    res.json({ success: true, countries: GLOBAL_COUNTRIES });
  }

  public static sendOtp(req: Request, res: Response) {
    const { phone, countryCode } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const otpNumber = crypto.randomInt(100000, 999999).toString();
    const phoneKey = `${countryCode || '+91'}_${phone}`;

    db.otpStore.set(phoneKey, {
      code: otpNumber,
      attempts: 0,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log(`[Modular Auth Controller] Generated OTP ${otpNumber} for ${phoneKey}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresInSeconds: 300,
      debugOtp: otpNumber
    });
  }

  public static verifyOtp(req: Request, res: Response) {
    const { phone, countryCode, otp } = req.body;
    const phoneKey = `${countryCode || '+91'}_${phone}`;
    const stored = db.otpStore.get(phoneKey);

    if (!stored) {
      return res.status(400).json({ success: false, message: 'No active OTP request found.' });
    }

    if (Date.now() > stored.expiresAt) {
      db.otpStore.delete(phoneKey);
      return res.status(400).json({ success: false, message: 'OTP has expired.' });
    }

    if (stored.attempts >= 3) {
      db.otpStore.delete(phoneKey);
      return res.status(429).json({ success: false, message: 'Too many failed attempts.' });
    }

    if (stored.code !== otp?.trim()) {
      stored.attempts += 1;
      return res.status(400).json({ success: false, message: 'Incorrect OTP code.' });
    }

    db.otpStore.delete(phoneKey);
    res.json({ success: true, message: 'Phone number verified successfully' });
  }

  public static register(req: Request, res: Response) {
    const { name, phone, email, countryId, city, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone, and password are required' });
    }

    const existing = db.users.find(u => u.phone === phone || (email && u.email === email));
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this phone or email already exists' });
    }

    const newUser: DBUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      name,
      email: email || `${phone.replace(/\D/g, '')}@cashbridge.app`,
      phone,
      countryId: countryId || 'in',
      city: city || 'Hyderabad',
      community: 'Campus & Local Community',
      passwordHash: db.hashPassword(password),
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
      approxDistanceMeters: 200
    };

    db.users.push(newUser);

    const token = `cbt_${crypto.randomBytes(24).toString('hex')}`;
    db.authSessions.set(token, {
      userId: newUser.id,
      expiresAt: Date.now() + 30 * 86400000
    });

    res.json({
      success: true,
      token,
      user: newUser,
      message: 'Account created successfully. Status: KYC_PENDING'
    });
  }

  public static login(req: Request, res: Response) {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required' });
    }

    const user = db.users.find(u => u.phone === identifier || u.email === identifier);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ success: false, message: 'Account is suspended.' });
    }

    if (user.passwordHash !== db.hashPassword(password)) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = `cbt_${crypto.randomBytes(24).toString('hex')}`;
    db.authSessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + 30 * 86400000
    });

    res.json({
      success: true,
      token,
      user,
      message: 'Logged in successfully'
    });
  }

  public static getMe(req: AuthenticatedRequest, res: Response) {
    const user = req.user || db.users.find(u => u.id === 'usr_praveen') || db.users[0];
    res.json({ success: true, user });
  }
}
