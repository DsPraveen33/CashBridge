import crypto from 'crypto';

export interface CountryConfig {
  id: string;
  name: string;
  code: string;
  currency: string;
  symbol: string;
  flag: string;
  paymentMethods: PaymentMethodConfig[];
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: 'UPI' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'INSTANT_PAY';
  description: string;
  icon: string;
  supportedCurrencies: string[];
}

export interface DBUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryId: string;
  city: string;
  community: string;
  passwordHash: string;
  status: 'NEW' | 'EMAIL_PHONE_VERIFIED' | 'KYC_PENDING' | 'KYC_IN_REVIEW' | 'KYC_VERIFIED' | 'KYC_REJECTED' | 'RESTRICTED' | 'SUSPENDED';
  role: 'USER' | 'ADMIN';
  avatar: string;
  trustScore: number;
  completedExchanges: number;
  rating: number;
  reviewsCount: number;
  memberSince: string;
  createdAt: string;
  isAvailableProvider: boolean;
  providerCashAmount: number;
  providerDigitalAmount: number;
  locationName: string;
  approxDistanceMeters: number;
}

export interface DBKycProfile {
  id: string;
  userId: string;
  documentType: string;
  idReference: string;
  frontUploaded: boolean;
  backUploaded: boolean;
  selfieVerified: boolean;
  providerReference: string;
  status: 'NOT_STARTED' | 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RETRY_REQUIRED';
  rejectionReason?: string;
  submittedAt: string;
  verifiedAt?: string;
  reviewerAdminId?: string;
}

export interface DBCommissionRule {
  id: string;
  name: string;
  countryId: string;
  currency: string;
  paymentMethodId: string;
  baseFee: number;
  percentageFee: number; // e.g. 1.5 for 1.5%
  distanceFeePerKm: number;
  urgencyFee15Min: number;
  urgencyFeeImmediate: number;
  minimumFee: number;
  maximumFee: number;
  taxRatePercent: number; // e.g. 18 for 18% GST/VAT
  updatedBy: string;
  updatedAt: string;
}

export interface DBFeeQuote {
  quoteId: string;
  userId: string;
  exchangeAmount: number;
  currency: string;
  paymentMethodId: string;
  baseFee: number;
  percentageFee: number;
  distanceFee: number;
  urgencyFee: number;
  tax: number;
  totalFee: number;
  finalAmount: number;
  status: 'LOCKED' | 'EXPIRED' | 'USED';
  createdAt: string;
  validUntil: string;
}

export interface DBExchangeSession {
  id: string;
  code: string;
  securityPin: string;
  requesterId: string;
  providerId: string;
  exchangeType: 'digital_to_cash' | 'cash_to_digital'; // digital_to_cash: user pays digital & receives cash; cash_to_digital: user pays cash & receives digital
  amount: number;
  currency: string;
  paymentMethodId: string;
  quoteId: string;
  fee: number;
  status: 'REQUESTED' | 'MATCHED' | 'ACCEPTED' | 'MEETING_CONFIRMED' | 'EXCHANGE_STARTED' | 'PAYMENT_PENDING' | 'PAYMENT_CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  timelineStep: number;
  meetingPointName: string;
  meetingPointAddress: string;
  userConfirmedPayment: boolean;
  peerConfirmedPayment: boolean;
  startedAt: string;
  completedAt?: string;
  ratingGiven?: number;
  ratingTags?: string[];
  disputeReason?: string;
}

export interface DBChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSecurityAlert?: boolean;
}

export interface DBNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'MATCH' | 'KYC' | 'EXCHANGE' | 'SECURITY';
  isRead: boolean;
  createdAt: string;
}

export interface DBDispute {
  id: string;
  exchangeId: string;
  reportedBy: string;
  reportedUserId: string;
  reason: string;
  details: string;
  status: 'PENDING_REVIEW' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  resolutionNotes?: string;
  createdAt: string;
}

export interface DBAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface DBAdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'KYC_REVIEWER' | 'MODERATOR' | 'PRICING_ADMIN' | 'RISK_ANALYST';
  mfaCode: string;
  lastLogin?: string;
}

// Global Countries & Payment Rails Configuration
export const GLOBAL_COUNTRIES: CountryConfig[] = [
  {
    id: 'in',
    name: 'India',
    code: '+91',
    currency: 'INR',
    symbol: '₹',
    flag: '🇮🇳',
    paymentMethods: [
      { id: 'upi', name: 'UPI (Unified Payments Interface)', type: 'UPI', description: 'Instant 24/7 bank-to-bank via PhonePe, GPay, Paytm', icon: 'QrCode', supportedCurrencies: ['INR'] },
      { id: 'imps', name: 'IMPS / Instant NetBanking', type: 'BANK_TRANSFER', description: 'Direct 24/7 IMPS transfer', icon: 'Building2', supportedCurrencies: ['INR'] }
    ]
  },
  {
    id: 'us',
    name: 'United States',
    code: '+1',
    currency: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    paymentMethods: [
      { id: 'zelle', name: 'Zelle Instant Pay', type: 'INSTANT_PAY', description: 'Direct bank transfer via Zelle network', icon: 'Zap', supportedCurrencies: ['USD'] },
      { id: 'venmo', name: 'Venmo Balance / Direct', type: 'DIGITAL_WALLET', description: 'Venmo P2P payment', icon: 'QrCode', supportedCurrencies: ['USD'] },
      { id: 'cashapp', name: 'Cash App Pay', type: 'DIGITAL_WALLET', description: 'Instant $Cashtag payment', icon: 'Banknote', supportedCurrencies: ['USD'] }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    code: '+44',
    currency: 'GBP',
    symbol: '£',
    flag: '🇬🇧',
    paymentMethods: [
      { id: 'faster_payments', name: 'Faster Payments (FPS)', type: 'BANK_TRANSFER', description: 'Instant UK bank transfer', icon: 'Zap', supportedCurrencies: ['GBP'] },
      { id: 'revolut_uk', name: 'Revolut Pay', type: 'DIGITAL_WALLET', description: 'Direct Revolut tag transfer', icon: 'Repeat', supportedCurrencies: ['GBP', 'EUR'] }
    ]
  },
  {
    id: 'ca',
    name: 'Canada',
    code: '+1',
    currency: 'CAD',
    symbol: 'CA$',
    flag: '🇨🇦',
    paymentMethods: [
      { id: 'interac', name: 'Interac e-Transfer', type: 'INSTANT_PAY', description: 'Standard Canadian digital bank payment', icon: 'Zap', supportedCurrencies: ['CAD'] }
    ]
  },
  {
    id: 'ae',
    name: 'United Arab Emirates',
    code: '+971',
    currency: 'AED',
    symbol: 'AED',
    flag: '🇦🇪',
    paymentMethods: [
      { id: 'uae_instant', name: 'Aani / Instant Pay', type: 'INSTANT_PAY', description: 'Central Bank of UAE instant digital transfer', icon: 'Zap', supportedCurrencies: ['AED'] }
    ]
  },
  {
    id: 'sg',
    name: 'Singapore',
    code: '+65',
    currency: 'SGD',
    symbol: 'S$',
    flag: '🇸🇬',
    paymentMethods: [
      { id: 'paynow', name: 'PayNow Direct', type: 'INSTANT_PAY', description: 'Instant mobile/NRIC QR transfer in Singapore', icon: 'QrCode', supportedCurrencies: ['SGD'] }
    ]
  }
];

// In-Memory Real Relational Database Store
class InMemoryDatabase {
  public users: DBUser[] = [];
  public kycProfiles: DBKycProfile[] = [];
  public commissionRules: DBCommissionRule[] = [];
  public feeQuotes: DBFeeQuote[] = [];
  public exchangeSessions: DBExchangeSession[] = [];
  public chatMessages: DBChatMessage[] = [];
  public notifications: DBNotification[] = [];
  public disputes: DBDispute[] = [];
  public auditLogs: DBAuditLog[] = [];
  public adminUsers: DBAdminUser[] = [];
  public otpStore: Map<string, { code: string; attempts: number; expiresAt: number; identifier?: string }> = new Map();
  public authSessions: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor() {
    this.seedInitialData();
  }

  public hashPassword(pw: string): string {
    return crypto.createHash('sha256').update(pw + 'cashbridge_salt_2026').digest('hex');
  }

  private seedInitialData() {
    // 1. Seed Commission Rules
    this.commissionRules = [
      {
        id: 'cr_in_upi',
        name: 'India Standard UPI Rules',
        countryId: 'in',
        currency: 'INR',
        paymentMethodId: 'upi',
        baseFee: 15,
        percentageFee: 1.0, // 1%
        distanceFeePerKm: 10,
        urgencyFee15Min: 10,
        urgencyFeeImmediate: 20,
        minimumFee: 20,
        maximumFee: 150,
        taxRatePercent: 18,
        updatedBy: 'SUPER_ADMIN',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cr_us_zelle',
        name: 'US Zelle & Digital Pay Rules',
        countryId: 'us',
        currency: 'USD',
        paymentMethodId: 'zelle',
        baseFee: 1.5,
        percentageFee: 1.2,
        distanceFeePerKm: 0.5,
        urgencyFee15Min: 1.0,
        urgencyFeeImmediate: 2.0,
        minimumFee: 2.0,
        maximumFee: 15.0,
        taxRatePercent: 8,
        updatedBy: 'SUPER_ADMIN',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cr_uk_fps',
        name: 'UK Faster Payments Rules',
        countryId: 'uk',
        currency: 'GBP',
        paymentMethodId: 'faster_payments',
        baseFee: 1.2,
        percentageFee: 1.0,
        distanceFeePerKm: 0.4,
        urgencyFee15Min: 0.8,
        urgencyFeeImmediate: 1.5,
        minimumFee: 1.5,
        maximumFee: 12.0,
        taxRatePercent: 20,
        updatedBy: 'SUPER_ADMIN',
        updatedAt: new Date().toISOString()
      }
    ];

    // 2. Seed Super Admin User
    this.adminUsers = [
      {
        id: 'adm_super_01',
        email: 'admin@cashbridge.org',
        passwordHash: this.hashPassword('AdminPass@2026'),
        name: 'Chief Security Officer',
        role: 'SUPER_ADMIN',
        mfaCode: '123456',
        lastLogin: new Date().toISOString()
      },
      {
        id: 'adm_kyc_01',
        email: 'kyc.reviewer@cashbridge.org',
        passwordHash: this.hashPassword('KycPass@2026'),
        name: 'KYC Compliance Lead',
        role: 'KYC_REVIEWER',
        mfaCode: '123456',
        lastLogin: new Date().toISOString()
      }
    ];

    // 3. Seed Verified Database Users Pool
    this.users = [
      {
        id: 'usr_praveen',
        name: 'Praveen N',
        email: 'praveen@cashbridge.org',
        phone: '+91 98765 43210',
        countryId: 'in',
        city: 'Hyderabad',
        community: 'AITS College Campus',
        passwordHash: this.hashPassword('SecurePass@2026'),
        status: 'KYC_VERIFIED',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        trustScore: 94,
        completedExchanges: 48,
        rating: 4.9,
        reviewsCount: 42,
        memberSince: 'March 2024',
        createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
        isAvailableProvider: true,
        providerCashAmount: 5000,
        providerDigitalAmount: 5000,
        locationName: 'Central Campus Gate A',
        approxDistanceMeters: 100
      },
      {
        id: 'usr_peer_rahul',
        name: 'Rahul Kumar',
        email: 'rahul.k@aits.ac.in',
        phone: '+91 91234 56789',
        countryId: 'in',
        city: 'Hyderabad',
        community: 'AITS College Campus',
        passwordHash: this.hashPassword('SecurePass@2026'),
        status: 'KYC_VERIFIED',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        trustScore: 96,
        completedExchanges: 32,
        rating: 4.9,
        reviewsCount: 128,
        memberSince: 'January 2024',
        createdAt: new Date(Date.now() - 240 * 86400000).toISOString(),
        isAvailableProvider: true,
        providerCashAmount: 3500,
        providerDigitalAmount: 3500,
        locationName: 'AITS Main Gate / Central Plaza',
        approxDistanceMeters: 120
      },
      {
        id: 'usr_peer_sneha',
        name: 'Sneha Reddy',
        email: 'sneha.r@aits.ac.in',
        phone: '+91 98888 11111',
        countryId: 'in',
        city: 'Hyderabad',
        community: 'AITS College Campus',
        passwordHash: this.hashPassword('SecurePass@2026'),
        status: 'KYC_VERIFIED',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        trustScore: 92,
        completedExchanges: 19,
        rating: 4.8,
        reviewsCount: 64,
        memberSince: 'February 2024',
        createdAt: new Date(Date.now() - 200 * 86400000).toISOString(),
        isAvailableProvider: true,
        providerCashAmount: 2000,
        providerDigitalAmount: 2000,
        locationName: 'Campus Library Cafe',
        approxDistanceMeters: 240
      },
      {
        id: 'usr_peer_vikram',
        name: 'Vikram Sharma',
        email: 'vikram.s@techhub.in',
        phone: '+91 97777 22222',
        countryId: 'in',
        city: 'Hyderabad',
        community: 'Tech Hub Innovation District',
        passwordHash: this.hashPassword('SecurePass@2026'),
        status: 'KYC_VERIFIED',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        trustScore: 98,
        completedExchanges: 54,
        rating: 4.9,
        reviewsCount: 95,
        memberSince: 'November 2023',
        createdAt: new Date(Date.now() - 320 * 86400000).toISOString(),
        isAvailableProvider: true,
        providerCashAmount: 5000,
        providerDigitalAmount: 5000,
        locationName: 'Metro Station Gate 2',
        approxDistanceMeters: 450
      },
      {
        id: 'usr_peer_alex',
        name: 'Alex Vance',
        email: 'alex.vance@usglobal.org',
        phone: '+1 415 555 0192',
        countryId: 'us',
        city: 'San Francisco',
        community: 'Bay Area Tech Community',
        passwordHash: this.hashPassword('SecurePass@2026'),
        status: 'KYC_VERIFIED',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        trustScore: 97,
        completedExchanges: 61,
        rating: 4.95,
        reviewsCount: 110,
        memberSince: 'December 2023',
        createdAt: new Date(Date.now() - 300 * 86400000).toISOString(),
        isAvailableProvider: true,
        providerCashAmount: 300,
        providerDigitalAmount: 300,
        locationName: 'Mission Plaza Hub',
        approxDistanceMeters: 300
      },
      {
        id: 'usr_pending_amrita',
        name: 'Amrita Patel',
        email: 'amrita.p@aits.ac.in',
        phone: '+91 99999 88888',
        countryId: 'in',
        city: 'Hyderabad',
        community: 'AITS College Campus',
        passwordHash: this.hashPassword('SecurePass@2026'),
        status: 'KYC_IN_REVIEW',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        trustScore: 80,
        completedExchanges: 0,
        rating: 5.0,
        reviewsCount: 0,
        memberSince: 'Today',
        createdAt: new Date().toISOString(),
        isAvailableProvider: false,
        providerCashAmount: 0,
        providerDigitalAmount: 0,
        locationName: 'Hostel Block C',
        approxDistanceMeters: 500
      }
    ];

    // 4. Seed KYC Profiles
    this.kycProfiles = [
      {
        id: 'kyc_prof_praveen',
        userId: 'usr_praveen',
        documentType: 'Aadhaar Card (India)',
        idReference: 'UID-8492-XXXX-7102',
        frontUploaded: true,
        backUploaded: true,
        selfieVerified: true,
        providerReference: 'VERIFF_REF_981294',
        status: 'VERIFIED',
        submittedAt: new Date(Date.now() - 170 * 86400000).toISOString(),
        verifiedAt: new Date(Date.now() - 169 * 86400000).toISOString(),
        reviewerAdminId: 'adm_super_01'
      },
      {
        id: 'kyc_prof_amrita',
        userId: 'usr_pending_amrita',
        documentType: 'Aadhaar Card (India)',
        idReference: 'UID-3819-XXXX-4910',
        frontUploaded: true,
        backUploaded: true,
        selfieVerified: true,
        providerReference: 'ONFIDO_REF_441029',
        status: 'IN_REVIEW',
        submittedAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    // 5. Seed Initial Audit Logs
    this.auditLogs = [
      {
        id: 'aud_1',
        adminId: 'adm_super_01',
        adminName: 'Chief Security Officer',
        action: 'SYSTEM_BOOTSTRAP',
        targetType: 'CORE_DATABASE',
        targetId: 'SYS_INITIALIZED',
        details: 'CashBridge Global Backend initialized with dynamic commission engine and RBAC rules.',
        timestamp: new Date().toISOString()
      },
      {
        id: 'aud_2',
        adminId: 'adm_kyc_01',
        adminName: 'KYC Compliance Lead',
        action: 'KYC_APPROVED',
        targetType: 'USER_KYC',
        targetId: 'usr_praveen',
        details: 'Aadhaar biometric match and liveness confirmed via third-party KYC provider webhook.',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
}

export const db = new InMemoryDatabase();
