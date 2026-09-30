import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'cashbridge_jwt_secret_production_key_2026_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export interface JWTPayload {
  userId: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  countryId: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a new JWT access token with user payload
 */
export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn = JWT_EXPIRES_IN): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

/**
 * Verify and decode an incoming JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Hash password securely using PBKDF2 with unique cryptographic salt
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const userSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, userSalt, 100000, 64, 'sha512');
  return {
    hash: derivedKey.toString('hex'),
    salt: userSalt,
  };
}

/**
 * Constant-time password verification against stored salt and hash
 */
export function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  try {
    const derivedKey = crypto.pbkdf2Sync(password, storedSalt, 100000, 64, 'sha512');
    const inputHash = derivedKey.toString('hex');
    const bufferA = Buffer.from(inputHash, 'hex');
    const bufferB = Buffer.from(storedHash, 'hex');

    if (bufferA.length !== bufferB.length) return false;
    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

/**
 * Constant-time OTP verification
 */
export function verifyOtpConstantTime(inputOtp: string, expectedOtp: string): boolean {
  try {
    const a = Buffer.from(inputOtp.trim());
    const b = Buffer.from(expectedOtp.trim());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
