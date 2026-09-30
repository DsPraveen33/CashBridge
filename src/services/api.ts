export interface CountryData {
  id: string;
  name: string;
  code: string;
  currency: string;
  symbol: string;
  flag: string;
  paymentMethods: PaymentMethodData[];
}

export interface PaymentMethodData {
  id: string;
  name: string;
  type: 'UPI' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'INSTANT_PAY';
  description: string;
  icon: string;
  supportedCurrencies: string[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryId: string;
  city: string;
  community: string;
  status: 'NEW' | 'EMAIL_PHONE_VERIFIED' | 'KYC_PENDING' | 'KYC_IN_REVIEW' | 'KYC_VERIFIED' | 'KYC_REJECTED' | 'RESTRICTED' | 'SUSPENDED';
  accountStatus?: 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED';
  kycStatus?: 'NOT_STARTED' | 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RETRY_REQUIRED';
  profileStatus?: 'COMPLETE' | 'INCOMPLETE';
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar: string;
  trustScore: number;
  completedExchanges: number;
  rating: number;
  reviewsCount: number;
  memberSince?: string;
  isAvailableProvider: boolean;
  providerCashAmount: number;
  providerDigitalAmount: number;
  locationName: string;
  approxDistanceMeters: number;
  createdAt?: string;
}

export interface FeeQuoteData {
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

export interface ExchangeSessionData {
  id: string;
  code: string;
  securityPin: string;
  requesterId: string;
  providerId: string;
  exchangeType: 'digital_to_cash' | 'cash_to_digital';
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

export interface ChatMessageData {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSecurityAlert?: boolean;
}

export interface AdminStatsData {
  totalUsers: number;
  verifiedUsers: number;
  pendingKyc: number;
  activeExchanges: number;
  completedExchanges: number;
  totalVolume: number;
  totalFees: number;
  openDisputes: number;
  suspendedAccounts: number;
}

export interface KycQueueItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  userCountry: string;
  documentType: string;
  idReference: string;
  frontUploaded: boolean;
  backUploaded: boolean;
  selfieVerified: boolean;
  status: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RETRY_REQUIRED';
  providerReference: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface CommissionRuleData {
  id: string;
  name: string;
  countryId: string;
  currency: string;
  paymentMethodId: string;
  baseFee: number;
  percentageFee: number;
  distanceFeePerKm: number;
  urgencyFee15Min: number;
  urgencyFeeImmediate: number;
  minimumFee: number;
  maximumFee: number;
  taxRatePercent: number;
  updatedBy: string;
  updatedAt?: string;
}

export interface DisputeData {
  id: string;
  exchangeId: string;
  reportedBy: string;
  reportedUserId: string;
  reason: string;
  details: string;
  status: 'PENDING_REVIEW' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface AuditLogData {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface DeviceSessionData {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

// REST API CLIENT
class ApiService {
  private token: string | null = null;
  private adminToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('cashbridge_token');
      this.adminToken = localStorage.getItem('cashbridge_admin_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('cashbridge_token', token);
    else localStorage.removeItem('cashbridge_token');
  }

  public getToken(): string | null {
    return this.token;
  }

  public setAdminToken(token: string | null) {
    this.adminToken = token;
    if (token) localStorage.setItem('cashbridge_admin_token', token);
    else localStorage.removeItem('cashbridge_admin_token');
  }

  public getAdminToken(): string | null {
    return this.adminToken;
  }

  private headers(isAdmin = false): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (isAdmin && this.adminToken) {
      h['Authorization'] = `Bearer ${this.adminToken}`;
    } else if (this.token) {
      h['Authorization'] = `Bearer ${this.token}`;
    }
    return h;
  }

  // 1. Countries
  async getCountries(): Promise<CountryData[]> {
    const res = await fetch('/api/countries');
    const data = await res.json();
    return data.countries || [];
  }

  // 2. Real Auth & OTP
  async sendOtp(phone?: string, countryCode?: string, email?: string) {
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ phone, countryCode, email })
    });
    return res.json();
  }

  async verifyOtp(otp: string, otpRequestId?: string, phone?: string, countryCode?: string, email?: string) {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ otp, otpRequestId, phone, countryCode, email })
    });
    const data = await res.json();
    if (data.token) this.setToken(data.token);
    return data;
  }

  async register(params: { name: string; phone: string; email?: string; countryId?: string; city?: string; community?: string; password: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (data.token) this.setToken(data.token);
    return data;
  }

  async login(identifier: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (data.token) this.setToken(data.token);
    return data;
  }

  async getMe(): Promise<UserData | null> {
    try {
      const res = await fetch('/api/me', { headers: this.headers() });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: this.headers()
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.setToken(null);
    }
  }

  // Active Device Sessions
  async getSessions(): Promise<DeviceSessionData[]> {
    try {
      const res = await fetch('/api/auth/sessions', { headers: this.headers() });
      const data = await res.json();
      return data.sessions || [];
    } catch {
      return [];
    }
  }

  async revokeSession(sessionId: string) {
    const res = await fetch(`/api/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: this.headers()
    });
    return res.json();
  }

  async logoutAllSessions() {
    const res = await fetch('/api/auth/sessions/logout-all', {
      method: 'POST',
      headers: this.headers()
    });
    return res.json();
  }

  // Forgot / Reset Password
  async forgotPassword(identifier: string) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ identifier })
    });
    return res.json();
  }

  async resetPassword(resetRequestId: string, otp: string, newPassword: string) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ resetRequestId, otp, newPassword })
    });
    return res.json();
  }

  // 3. KYC Provider
  async startKyc() {
    const res = await fetch('/api/kyc/start', {
      method: 'POST',
      headers: this.headers()
    });
    return res.json();
  }

  async submitKyc(documentType: string, idReference: string) {
    const res = await fetch('/api/kyc/submit', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ documentType, idReference })
    });
    return res.json();
  }

  async getKycStatus() {
    const res = await fetch('/api/kyc/status', {
      headers: this.headers()
    });
    return res.json();
  }

  // 4. Dynamic Commission Fee Calculation
  async calculateQuote(params: { amount: number; countryId: string; paymentMethodId: string; urgency?: string; distanceKm?: number }) {
    const res = await fetch('/api/commission/quote', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(params)
    });
    return res.json();
  }

  // 5. Database Provider Matches
  async getMatches(countryId?: string, minAmount?: number): Promise<UserData[]> {
    const q = new URLSearchParams();
    if (countryId) q.append('countryId', countryId);
    if (minAmount) q.append('minAmount', minAmount.toString());
    const res = await fetch(`/api/matches?${q.toString()}`, { headers: this.headers() });
    const data = await res.json();
    return data.matches || [];
  }

  async updateProviderAvailability(isAvailable: boolean, cashAmount?: number, digitalAmount?: number) {
    const res = await fetch('/api/provider/availability', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ isAvailable, cashAmount, digitalAmount })
    });
    return res.json();
  }

  // 6. Exchange Session State Machine
  async createExchange(params: { peerId: string; amount: number; exchangeType: string; quoteId: string; paymentMethodId: string; meetingPointName?: string }) {
    const res = await fetch('/api/exchanges/create', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(params)
    });
    return res.json();
  }

  async advanceExchange(exchangeId: string) {
    const res = await fetch(`/api/exchanges/${exchangeId}/advance`, {
      method: 'POST',
      headers: this.headers()
    });
    return res.json();
  }

  async confirmExchangePayment(exchangeId: string) {
    const res = await fetch(`/api/exchanges/${exchangeId}/confirm-payment`, {
      method: 'POST',
      headers: this.headers()
    });
    return res.json();
  }

  async disputeExchange(exchangeId: string, reason: string, details?: string) {
    const res = await fetch(`/api/exchanges/${exchangeId}/dispute`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ reason, details })
    });
    return res.json();
  }

  // 7. Chat
  async getChat(sessionId: string): Promise<ChatMessageData[]> {
    const res = await fetch(`/api/chat/${sessionId}`, { headers: this.headers() });
    const data = await res.json();
    return data.messages || [];
  }

  async sendChatMessage(sessionId: string, text: string, senderName?: string) {
    const res = await fetch(`/api/chat/${sessionId}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ text, senderName })
    });
    return res.json();
  }

  // 8. Admin APIs
  async adminLogin(email: string, pass: string, mfaCode?: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ email, password: pass, mfaCode })
    });
    const data = await res.json();
    if (data.token) this.setAdminToken(data.token);
    return data;
  }

  async getAdminStats(): Promise<AdminStatsData | null> {
    const res = await fetch('/api/admin/dashboard-stats', { headers: this.headers(true) });
    const data = await res.json();
    return data.stats || null;
  }

  async getAdminKycQueue(): Promise<KycQueueItem[]> {
    const res = await fetch('/api/admin/kyc-queue', { headers: this.headers(true) });
    const data = await res.json();
    return data.queue || [];
  }

  async adminKycAction(kycId: string, action: 'APPROVE' | 'REJECT' | 'RETRY', rejectionReason?: string) {
    const res = await fetch('/api/admin/kyc-action', {
      method: 'POST',
      headers: this.headers(true),
      body: JSON.stringify({ kycId, action, rejectionReason })
    });
    return res.json();
  }

  async getAdminCommissionRules(): Promise<CommissionRuleData[]> {
    const res = await fetch('/api/admin/commission-rules', { headers: this.headers(true) });
    const data = await res.json();
    return data.rules || [];
  }

  async adminUpdateCommissionRule(params: Partial<CommissionRuleData> & { ruleId: string }) {
    const res = await fetch('/api/admin/commission-rules', {
      method: 'POST',
      headers: this.headers(true),
      body: JSON.stringify(params)
    });
    return res.json();
  }

  async getAdminUsers(): Promise<UserData[]> {
    const res = await fetch('/api/admin/users', { headers: this.headers(true) });
    const data = await res.json();
    return data.users || [];
  }

  async adminUserAction(userId: string, action: 'SUSPEND' | 'UNSUSPEND' | 'RESTRICT', reason?: string) {
    const res = await fetch('/api/admin/user-action', {
      method: 'POST',
      headers: this.headers(true),
      body: JSON.stringify({ userId, action, reason })
    });
    return res.json();
  }

  async getAdminDisputes(): Promise<DisputeData[]> {
    const res = await fetch('/api/admin/disputes', { headers: this.headers(true) });
    const data = await res.json();
    return data.disputes || [];
  }

  async getAdminAuditLogs(): Promise<AuditLogData[]> {
    const res = await fetch('/api/admin/audit-logs', { headers: this.headers(true) });
    const data = await res.json();
    return data.auditLogs || [];
  }
}

export const api = new ApiService();
