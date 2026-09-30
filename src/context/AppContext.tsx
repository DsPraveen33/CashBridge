import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  MobileScreen, 
  BottomNavTab, 
  UserProfile, 
  PeerUser, 
  MeetingPoint, 
  ExchangeTransaction, 
  ChatMessage, 
  TrustedCircleItem,
  ExchangeType
} from '../types';
import { 
  CURRENT_USER, 
  INITIAL_PEERS, 
  MEETING_POINTS, 
  INITIAL_TRANSACTIONS, 
  TRUSTED_CIRCLES_DATA,
  POPULAR_COUNTRIES 
} from '../data/mockData';
import { 
  api, 
  CountryData, 
  PaymentMethodData, 
  UserData, 
  FeeQuoteData, 
  ExchangeSessionData, 
  ChatMessageData,
  AdminStatsData,
  KycQueueItem,
  CommissionRuleData,
  AuditLogData,
  DeviceSessionData
} from '../services/api';

export type AuthState = 
  | 'INITIALIZING'
  | 'UNAUTHENTICATED'
  | 'AUTHENTICATING'
  | 'AUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'ACCOUNT_RESTRICTED'
  | 'ACCOUNT_SUSPENDED'
  | 'KYC_PENDING'
  | 'KYC_VERIFIED'
  | 'ERROR';

export type NetworkStatus = 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';

interface AppContextType {
  // Navigation
  currentScreen: MobileScreen;
  setCurrentScreen: (screen: MobileScreen) => void;
  activeTab: BottomNavTab;
  setActiveTab: (tab: BottomNavTab) => void;
  screenHistory: MobileScreen[];
  goBack: () => void;
  navigateTo: (screen: MobileScreen) => void;

  // Real Centralized Authentication State
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  networkStatus: NetworkStatus;
  authError: string | null;
  retryInitialization: () => Promise<void>;

  // Global Countries & Payment Rails
  countries: CountryData[];
  selectedCountry: CountryData;
  setSelectedCountry: (country: CountryData) => void;
  selectedPaymentMethod: PaymentMethodData | null;
  setSelectedPaymentMethod: (pm: PaymentMethodData | null) => void;

  // Real Auth Form State & Credentials
  authPhone: string;
  setAuthPhone: (phone: string) => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  authName: string;
  setAuthName: (name: string) => void;
  otpCode: string[];
  setOtpCode: (code: string[]) => void;
  passwordInput: string;
  setPasswordInput: (pw: string) => void;
  otpRequestId: string | null;
  isLoggedIn: boolean;

  // Real Authentication API Actions
  sendRealOtp: (phone?: string, email?: string) => Promise<{ success: boolean; message: string; otpRequestId?: string; debugOtp?: string }>;
  verifyRealOtp: (enteredOtp?: string) => Promise<{ success: boolean; message: string; verified?: boolean; token?: string }>;
  registerRealUser: () => Promise<{ success: boolean; message: string; user?: UserData }>;
  loginRealUser: (identifier: string, pass: string) => Promise<{ success: boolean; message: string; user?: UserData }>;
  logoutUser: () => Promise<void>;

  // Active Device Sessions
  deviceSessions: DeviceSessionData[];
  fetchDeviceSessions: () => Promise<void>;
  revokeDeviceSession: (sessionId: string) => Promise<void>;
  logoutAllOtherDevices: () => Promise<void>;

  // Real KYC State
  selectedIdDocType: string;
  setSelectedIdDocType: (doc: string) => void;
  kycStatus: 'NOT_STARTED' | 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RETRY_REQUIRED';
  startKycSession: () => Promise<void>;
  submitKycDocuments: () => Promise<void>;

  // User Profile
  currentUser: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;

  // Dynamic Commission & Fee Quote Engine
  exchangeType: ExchangeType; // upi_to_cash (Need Cash) | cash_to_upi (Need Digital)
  setExchangeType: (type: ExchangeType) => void;
  requestAmount: number;
  setRequestAmount: (amt: number) => void;
  urgency: 'Now' | 'Within 15 min' | 'Within 30 min';
  setUrgency: (urgency: 'Now' | 'Within 15 min' | 'Within 30 min') => void;
  searchRange: 'Within 1 km' | 'Within 5 km' | 'Within 10 km';
  setSearchRange: (range: 'Within 1 km' | 'Within 5 km' | 'Within 10 km') => void;
  preferredMatchType: 'everyone' | 'verified_only' | 'trusted_only';
  setPreferredMatchType: (type: 'everyone' | 'verified_only' | 'trusted_only') => void;
  activeFeeQuote: FeeQuoteData | null;
  fetchDynamicFeeQuote: () => Promise<FeeQuoteData | null>;

  // Real Database Matches
  peers: PeerUser[];
  selectedPeer: PeerUser;
  setSelectedPeer: (peer: PeerUser) => void;
  fetchDatabaseMatches: () => Promise<void>;
  isProviderActive: boolean;
  toggleProviderMode: (active: boolean) => Promise<void>;

  // Backend Exchange State Machine
  activeTransaction: ExchangeTransaction | null;
  startExchangeWithPeer: (peer: PeerUser) => Promise<void>;
  selectedMeetingPoint: MeetingPoint;
  setSelectedMeetingPoint: (mp: MeetingPoint) => void;
  confirmMeetingPoint: () => Promise<void>;
  advanceExchangeStep: () => Promise<void>;
  confirmReceivedPayment: () => Promise<void>;
  reportPaymentIssue: (reason: string) => Promise<void>;

  // Real Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;

  // History & Circles
  transactions: ExchangeTransaction[];
  trustedCircles: TrustedCircleItem[];
  toggleTrustedCircle: (id: string) => void;

  // Admin Portal State & Actions
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
  adminUser: { id: string; email: string; name: string; role: string } | null;
  adminStats: AdminStatsData | null;
  adminKycQueue: KycQueueItem[];
  adminCommissionRules: CommissionRuleData[];
  adminAuditLogs: AuditLogData[];
  loginAdmin: (email: string, pass: string, mfa?: string) => Promise<boolean>;
  approveKycAction: (kycId: string, action: 'APPROVE' | 'REJECT' | 'RETRY', reason?: string) => Promise<void>;
  updatePricingRule: (ruleId: string, updates: Partial<CommissionRuleData>) => Promise<void>;
  performUserModeration: (userId: string, action: 'SUSPEND' | 'UNSUSPEND' | 'RESTRICT', reason?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('1_splash');
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home');
  const [screenHistory, setScreenHistory] = useState<MobileScreen[]>(['1_splash']);

  // Real Authentication & Network State
  const [authState, setAuthState] = useState<AuthState>('INITIALIZING');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('CONNECTED');
  const [authError, setAuthError] = useState<string | null>(null);

  // Countries & Payment Rails
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(POPULAR_COUNTRIES[0] as unknown as CountryData);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodData | null>(null);

  // Auth Inputs
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [passwordInput, setPasswordInput] = useState('');
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Active Device Sessions
  const [deviceSessions, setDeviceSessions] = useState<DeviceSessionData[]>([]);

  // KYC State
  const [selectedIdDocType, setSelectedIdDocType] = useState('Aadhaar Card (India)');
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RETRY_REQUIRED'>('PENDING');

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);

  // Exchange Request Parameters
  const [exchangeType, setExchangeType] = useState<ExchangeType>('upi_to_cash'); // "I Need Cash"
  const [requestAmount, setRequestAmount] = useState<number>(2000);
  const [urgency, setUrgency] = useState<'Now' | 'Within 15 min' | 'Within 30 min'>('Now');
  const [searchRange, setSearchRange] = useState<'Within 1 km' | 'Within 5 km' | 'Within 10 km'>('Within 1 km');
  const [preferredMatchType, setPreferredMatchType] = useState<'everyone' | 'verified_only' | 'trusted_only'>('verified_only');
  const [activeFeeQuote, setActiveFeeQuote] = useState<FeeQuoteData | null>(null);

  // Peers & Matching State
  const [peers, setPeers] = useState<PeerUser[]>(INITIAL_PEERS);
  const [selectedPeer, setSelectedPeer] = useState<PeerUser>(INITIAL_PEERS[0]);
  const [isProviderActive, setIsProviderActive] = useState(false);

  // Exchange Sessions & Safe Meeting Points
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<MeetingPoint>(MEETING_POINTS[0]);
  const [activeTransaction, setActiveTransaction] = useState<ExchangeTransaction | null>(null);
  const [transactions, setTransactions] = useState<ExchangeTransaction[]>(INITIAL_TRANSACTIONS);
  const [trustedCircles, setTrustedCircles] = useState<TrustedCircleItem[]>(TRUSTED_CIRCLES_DATA);

  // Real Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_sys_0',
      senderId: 'system',
      senderName: 'CashBridge Security',
      text: '🛡️ Safety Reminder: Keep communication inside CashBridge. Never share passwords, bank OTPs, or private addresses.',
      timestamp: '10:24 AM',
      isSecurityAlert: true
    }
  ]);

  // Admin Portal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminUser, setAdminUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStatsData | null>(null);
  const [adminKycQueue, setAdminKycQueue] = useState<KycQueueItem[]>([]);
  const [adminCommissionRules, setAdminCommissionRules] = useState<CommissionRuleData[]>([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState<AuditLogData[]>([]);

  // -------------------------------------------------------------
  // Centralized App Initialization & Session Restoration
  // -------------------------------------------------------------
  const initApp = useCallback(async () => {
    setAuthState('INITIALIZING');
    setAuthError(null);
    setNetworkStatus('CONNECTED');

    // 10-second timeout guarantee
    const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
      setTimeout(() => resolve({ timeout: true }), 10000)
    );

    try {
      const result = await Promise.race([
        (async () => {
          // 1. Fetch Global Supported Countries
          const countryList = await api.getCountries();
          if (countryList && countryList.length > 0) {
            setCountries(countryList);
            setSelectedCountry(countryList[0]);
            if (countryList[0].paymentMethods?.length) {
              setSelectedPaymentMethod(countryList[0].paymentMethods[0]);
            }
          }

          // 2. Validate Session with Backend
          const me = await api.getMe();
          return { me, timeout: false };
        })(),
        timeoutPromise
      ]);

      if ('timeout' in result && result.timeout) {
        console.warn('⚠️ [Auth Startup] Initialization timeout after 10s.');
        setNetworkStatus('OFFLINE');
        setAuthState('ERROR');
        setAuthError('Unable to connect. Please check your internet connection.');
        return;
      }

      const { me } = result as { me: UserData | null };

      if (me) {
        // Authenticated User Session Found
        setCurrentUser({
          id: me.id,
          name: me.name,
          phone: me.phone,
          email: me.email,
          avatar: me.avatar,
          country: me.countryId === 'in' ? 'India' : 'United States',
          countryFlag: me.countryId === 'in' ? '🇮🇳' : '🇺🇸',
          city: me.city,
          collegeCommunity: me.community,
          isKycVerified: me.status === 'KYC_VERIFIED',
          trustScore: me.trustScore,
          completedExchanges: me.completedExchanges,
          rating: me.rating,
          reviewsCount: me.reviewsCount,
          memberSince: me.memberSince || 'Active Member',
          activeProvider: me.isAvailableProvider
        });

        setIsLoggedIn(true);

        // Check Account Restrictions & KYC state
        if (me.status === 'SUSPENDED' || me.accountStatus === 'SUSPENDED') {
          setAuthState('ACCOUNT_SUSPENDED');
          setScreenHistory(['1_splash']);
          setCurrentScreen('1_splash');
        } else if (me.status === 'RESTRICTED' || me.accountStatus === 'RESTRICTED') {
          setAuthState('ACCOUNT_RESTRICTED');
          setScreenHistory(['1_splash']);
          setCurrentScreen('1_splash');
        } else if (me.status === 'KYC_VERIFIED') {
          setAuthState('KYC_VERIFIED');
          setKycStatus('VERIFIED');
          setScreenHistory(['12_home']);
          setCurrentScreen('12_home');
        } else {
          setAuthState('KYC_PENDING');
          setKycStatus(me.status === 'KYC_IN_REVIEW' ? 'IN_REVIEW' : 'PENDING');
          setScreenHistory(['11_kyc_verified']);
          setCurrentScreen('11_kyc_verified');
        }

        // Fetch Initial Fee Quote
        const quoteRes = await api.calculateQuote({
          amount: 2000,
          countryId: me.countryId || 'in',
          paymentMethodId: 'upi',
          urgency: 'Now',
          distanceKm: 1
        });
        if (quoteRes?.quote) setActiveFeeQuote(quoteRes.quote);

        // Fetch Live Database Matches
        const dbMatches = await api.getMatches(me.countryId || 'in');
        if (dbMatches.length > 0) {
          const mappedPeers: PeerUser[] = dbMatches.map(m => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar,
            distance: `${m.approxDistanceMeters} m`,
            distanceMeters: m.approxDistanceMeters,
            provides: m.providerCashAmount > 0 ? 'cash' : 'upi',
            availableAmount: m.providerCashAmount || 3500,
            trustScore: m.trustScore,
            rating: m.rating,
            reviewsCount: m.reviewsCount,
            completedExchanges: m.completedExchanges,
            isKycVerified: m.status === 'KYC_VERIFIED',
            currentLocationName: m.locationName,
            isOnline: true,
            responseTime: '2 min',
            inTrustedCircle: true
          }));
          setPeers(mappedPeers);
          if (mappedPeers[0]) setSelectedPeer(mappedPeers[0]);
        }
      } else {
        // No Authenticated Session
        setIsLoggedIn(false);
        setAuthState('UNAUTHENTICATED');
        setScreenHistory(['1_splash']);
        setCurrentScreen('1_splash');
      }
    } catch (err) {
      console.error('❌ [Auth Startup Error]:', err);
      setAuthState('ERROR');
      setNetworkStatus('OFFLINE');
      setAuthError('Unable to connect to CashBridge verification backend.');
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  // -------------------------------------------------------------
  // Real-Time Background Synchronization (KYC & Account Status)
  // -------------------------------------------------------------
  useEffect(() => {
    if (authState !== 'AUTHENTICATED' && authState !== 'KYC_PENDING') return;

    const interval = setInterval(async () => {
      try {
        const me = await api.getMe();
        if (me) {
          if (me.status === 'KYC_VERIFIED' && kycStatus !== 'VERIFIED') {
            setKycStatus('VERIFIED');
            setAuthState('KYC_VERIFIED');
            setCurrentUser(prev => ({ ...prev, isKycVerified: true }));
            navigateTo('12_home');
          } else if (me.status === 'SUSPENDED') {
            setAuthState('ACCOUNT_SUSPENDED');
          }
        }
      } catch {
        // Silent background check failure
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [authState, kycStatus]);

  // Navigation Handlers
  const navigateTo = (screen: MobileScreen) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(previousScreen);
    } else {
      if (authState === 'KYC_VERIFIED' || authState === 'AUTHENTICATED') {
        setCurrentScreen('12_home');
      } else {
        setCurrentScreen('1_splash');
      }
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  // -------------------------------------------------------------
  // Real Auth API Handlers
  // -------------------------------------------------------------
  const sendRealOtp = async (phone?: string, email?: string) => {
    const targetPhone = phone || authPhone;
    const targetEmail = email || authEmail;
    const res = await api.sendOtp(targetPhone, selectedCountry.code, targetEmail);
    if (res.success && res.otpRequestId) {
      setOtpRequestId(res.otpRequestId);
    }
    return res;
  };

  const verifyRealOtp = async (enteredOtp?: string) => {
    const code = enteredOtp || otpCode.join('');
    const res = await api.verifyOtp(code, otpRequestId || undefined, authPhone, selectedCountry.code, authEmail);
    if (res.success && res.verified) {
      if (res.user) {
        setCurrentUser(prev => ({
          ...prev,
          id: res.user.id,
          name: res.user.name,
          phone: res.user.phone,
          email: res.user.email,
          isKycVerified: res.user.status === 'KYC_VERIFIED',
        }));
        setIsLoggedIn(true);
        if (res.user.status === 'KYC_VERIFIED') {
          setAuthState('KYC_VERIFIED');
          setKycStatus('VERIFIED');
        } else {
          setAuthState('KYC_PENDING');
          setKycStatus('PENDING');
        }
      }
    }
    return res;
  };

  const registerRealUser = async () => {
    const res = await api.register({
      name: authName,
      phone: authPhone,
      email: authEmail || undefined,
      countryId: selectedCountry.id,
      city: 'Hyderabad',
      community: 'Campus & Local Community',
      password: passwordInput,
    });

    if (res.success && res.user) {
      setCurrentUser(prev => ({
        ...prev,
        id: res.user.id,
        name: res.user.name,
        phone: res.user.phone,
        email: res.user.email,
        isKycVerified: false,
      }));
      setIsLoggedIn(true);
      setAuthState('KYC_PENDING');
      setKycStatus('PENDING');
    }
    return res;
  };

  const loginRealUser = async (identifier: string, pass: string) => {
    setAuthState('AUTHENTICATING');
    const res = await api.login(identifier, pass);

    if (res.success && res.user) {
      setCurrentUser(prev => ({
        ...prev,
        id: res.user.id,
        name: res.user.name,
        phone: res.user.phone,
        email: res.user.email,
        isKycVerified: res.user.status === 'KYC_VERIFIED',
      }));
      setIsLoggedIn(true);

      if (res.user.status === 'SUSPENDED') {
        setAuthState('ACCOUNT_SUSPENDED');
      } else if (res.user.status === 'RESTRICTED') {
        setAuthState('ACCOUNT_RESTRICTED');
      } else if (res.user.status === 'KYC_VERIFIED') {
        setAuthState('KYC_VERIFIED');
        setKycStatus('VERIFIED');
        setScreenHistory(['12_home']);
        setCurrentScreen('12_home');
      } else {
        setAuthState('KYC_PENDING');
        setKycStatus(res.user.status === 'KYC_IN_REVIEW' ? 'IN_REVIEW' : 'PENDING');
        setScreenHistory(['11_kyc_verified']);
        setCurrentScreen('11_kyc_verified');
      }
    } else {
      setAuthState('UNAUTHENTICATED');
    }
    return res;
  };

  const logoutUser = async () => {
    await api.logout();
    setIsLoggedIn(false);
    setAuthState('UNAUTHENTICATED');
    setActiveTransaction(null);
    setDeviceSessions([]);
    setScreenHistory(['1_splash']);
    setCurrentScreen('1_splash');
  };

  // Device Sessions
  const fetchDeviceSessions = async () => {
    const sessions = await api.getSessions();
    setDeviceSessions(sessions);
  };

  const revokeDeviceSession = async (sessionId: string) => {
    await api.revokeSession(sessionId);
    await fetchDeviceSessions();
  };

  const logoutAllOtherDevices = async () => {
    await api.logoutAllSessions();
    await fetchDeviceSessions();
  };

  // -------------------------------------------------------------
  // Real KYC Handlers
  // -------------------------------------------------------------
  const startKycSession = async () => {
    await api.startKyc();
  };

  const submitKycDocuments = async () => {
    const res = await api.submitKyc(selectedIdDocType, `ID-${Math.floor(100000 + Math.random() * 900000)}`);
    if (res.success) {
      setKycStatus('IN_REVIEW');
      setAuthState('KYC_PENDING');
      setCurrentUser(prev => ({ ...prev, isKycVerified: false }));
    }
  };

  // -------------------------------------------------------------
  // Dynamic Commission & Provider Matching
  // -------------------------------------------------------------
  const fetchDynamicFeeQuote = async (): Promise<FeeQuoteData | null> => {
    try {
      const dist = searchRange === 'Within 1 km' ? 1 : searchRange === 'Within 5 km' ? 3 : 8;
      const res = await api.calculateQuote({
        amount: requestAmount,
        countryId: selectedCountry.id || 'in',
        paymentMethodId: selectedPaymentMethod ? selectedPaymentMethod.id : 'upi',
        urgency,
        distanceKm: dist
      });
      if (res?.quote) {
        setActiveFeeQuote(res.quote);
        return res.quote;
      }
      return null;
    } catch {
      return null;
    }
  };

  const fetchDatabaseMatches = async () => {
    const dbMatches = await api.getMatches(selectedCountry.id, requestAmount);
    if (dbMatches.length > 0) {
      const mappedPeers: PeerUser[] = dbMatches.map(m => ({
        id: m.id,
        name: m.name,
        avatar: m.avatar,
        distance: `${m.approxDistanceMeters} m`,
        distanceMeters: m.approxDistanceMeters,
        provides: m.providerCashAmount > 0 ? 'cash' : 'upi',
        availableAmount: m.providerCashAmount || 3500,
        trustScore: m.trustScore,
        rating: m.rating,
        reviewsCount: m.reviewsCount,
        completedExchanges: m.completedExchanges,
        isKycVerified: m.status === 'KYC_VERIFIED',
        currentLocationName: m.locationName,
        isOnline: true,
        responseTime: '2 min',
        inTrustedCircle: true
      }));
      setPeers(mappedPeers);
      if (mappedPeers[0]) setSelectedPeer(mappedPeers[0]);
    }
  };

  const toggleProviderMode = async (active: boolean) => {
    setIsProviderActive(active);
    await api.updateProviderAvailability(active, active ? 5000 : 0, active ? 5000 : 0);
  };

  // -------------------------------------------------------------
  // Backend Exchange State Machine
  // -------------------------------------------------------------
  const startExchangeWithPeer = async (peer: PeerUser) => {
    setSelectedPeer(peer);
    const quote = activeFeeQuote || {
      quoteId: 'CQ-DEFAULT',
      totalFee: 35,
      exchangeAmount: requestAmount
    };

    const res = await api.createExchange({
      peerId: peer.id,
      amount: requestAmount,
      exchangeType: exchangeType === 'upi_to_cash' ? 'digital_to_cash' : 'cash_to_digital',
      quoteId: quote.quoteId,
      paymentMethodId: selectedPaymentMethod ? selectedPaymentMethod.id : 'upi',
      meetingPointName: selectedMeetingPoint.name
    });

    if (res.success && res.session) {
      const newTx: ExchangeTransaction = {
        id: res.session.id,
        code: res.session.code,
        securityPin: res.session.securityPin,
        type: exchangeType,
        amount: res.session.amount,
        fee: res.session.fee,
        currency: selectedCountry?.currency || 'INR',
        peer,
        meetingPoint: selectedMeetingPoint,
        meetingTime: 'In 12 minutes (ETA 10:36 AM)',
        status: 'both_accepted',
        timelineStep: 3,
        createdAt: res.session.startedAt,
        startedAt: res.session.startedAt,
        urgency,
        searchRange,
        matchType: preferredMatchType
      };
      setActiveTransaction(newTx);
      navigateTo('15_nearby_matches');
    }
  };

  const confirmMeetingPoint = async () => {
    if (!activeTransaction) return;
    const res = await api.advanceExchange(activeTransaction.id);
    if (res.success) {
      setActiveTransaction(prev => prev ? { ...prev, timelineStep: 4, status: 'meeting_point_confirmed' } : null);
      navigateTo('18_meeting_point');
    }
  };

  const advanceExchangeStep = async () => {
    if (!activeTransaction) return;
    const res = await api.advanceExchange(activeTransaction.id);
    if (res.success) {
      const nextStep = (activeTransaction.timelineStep + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
      setActiveTransaction(prev => prev ? { ...prev, timelineStep: nextStep } : null);
    }
  };

  const confirmReceivedPayment = async () => {
    if (!activeTransaction) return;
    const res = await api.confirmExchangePayment(activeTransaction.id);
    if (res.success) {
      const completedTx: ExchangeTransaction = {
        ...activeTransaction,
        timelineStep: 7,
        status: 'completed',
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setActiveTransaction(completedTx);
      setTransactions(prev => [completedTx, ...prev]);
      setCurrentUser(prev => ({
        ...prev,
        completedExchanges: prev.completedExchanges + 1,
        trustScore: Math.min(100, prev.trustScore + 1)
      }));
      navigateTo('21_success');
    }
  };

  const reportPaymentIssue = async (reason: string) => {
    if (!activeTransaction) return;
    await api.disputeExchange(activeTransaction.id, reason, 'User reported discrepancy in funds transfer');
    setActiveTransaction(prev => prev ? { ...prev, status: 'disputed' } : null);
    navigateTo('23_safety_center');
  };

  // Real Chat
  const sendChatMessage = async (text: string) => {
    const sessionId = activeTransaction ? activeTransaction.id : 'default';
    const res = await api.sendChatMessage(sessionId, text, currentUser.name);
    if (res.success && res.message) {
      setChatMessages(prev => [
        ...prev,
        {
          id: res.message.id,
          senderId: 'user',
          senderName: currentUser.name,
          text: res.message.text,
          timestamp: res.message.timestamp
        }
      ]);
    }
  };

  const toggleTrustedCircle = (id: string) => {
    setTrustedCircles(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  // Admin Handlers
  const loginAdmin = async (email: string, pass: string, mfa?: string): Promise<boolean> => {
    const res = await api.adminLogin(email, pass, mfa);
    if (res.success && res.admin) {
      setAdminUser(res.admin);
      const [stats, kycQ, rules, logs] = await Promise.all([
        api.getAdminStats(),
        api.getAdminKycQueue(),
        api.getAdminCommissionRules(),
        api.getAdminAuditLogs()
      ]);
      setAdminStats(stats);
      setAdminKycQueue(kycQ);
      setAdminCommissionRules(rules);
      setAdminAuditLogs(logs);
      return true;
    }
    return false;
  };

  const approveKycAction = async (kycId: string, action: 'APPROVE' | 'REJECT' | 'RETRY', reason?: string) => {
    await api.adminKycAction(kycId, action, reason);
    const updatedQ = await api.getAdminKycQueue();
    const updatedStats = await api.getAdminStats();
    const updatedLogs = await api.getAdminAuditLogs();
    setAdminKycQueue(updatedQ);
    setAdminStats(updatedStats);
    setAdminAuditLogs(updatedLogs);
  };

  const updatePricingRule = async (ruleId: string, updates: Partial<CommissionRuleData>) => {
    await api.adminUpdateCommissionRule({ ...updates, ruleId });
    const rules = await api.getAdminCommissionRules();
    const updatedLogs = await api.getAdminAuditLogs();
    setAdminCommissionRules(rules);
    setAdminAuditLogs(updatedLogs);
  };

  const performUserModeration = async (userId: string, action: 'SUSPEND' | 'UNSUSPEND' | 'RESTRICT', reason?: string) => {
    await api.adminUserAction(userId, action, reason);
    const updatedLogs = await api.getAdminAuditLogs();
    setAdminAuditLogs(updatedLogs);
  };

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      activeTab,
      setActiveTab,
      screenHistory,
      goBack,
      navigateTo,
      authState,
      setAuthState,
      networkStatus,
      authError,
      retryInitialization: initApp,
      countries,
      selectedCountry,
      setSelectedCountry,
      selectedPaymentMethod,
      setSelectedPaymentMethod,
      authPhone,
      setAuthPhone,
      authEmail,
      setAuthEmail,
      authName,
      setAuthName,
      otpCode,
      setOtpCode,
      passwordInput,
      setPasswordInput,
      otpRequestId,
      isLoggedIn,
      sendRealOtp,
      verifyRealOtp,
      registerRealUser,
      loginRealUser,
      logoutUser,
      deviceSessions,
      fetchDeviceSessions,
      revokeDeviceSession,
      logoutAllOtherDevices,
      selectedIdDocType,
      setSelectedIdDocType,
      kycStatus,
      startKycSession,
      submitKycDocuments,
      currentUser,
      updateUser,
      exchangeType,
      setExchangeType,
      requestAmount,
      setRequestAmount,
      urgency,
      setUrgency,
      searchRange,
      setSearchRange,
      preferredMatchType,
      setPreferredMatchType,
      activeFeeQuote,
      fetchDynamicFeeQuote,
      peers,
      selectedPeer,
      setSelectedPeer,
      fetchDatabaseMatches,
      isProviderActive,
      toggleProviderMode,
      activeTransaction,
      startExchangeWithPeer,
      selectedMeetingPoint,
      setSelectedMeetingPoint,
      confirmMeetingPoint,
      advanceExchangeStep,
      confirmReceivedPayment,
      reportPaymentIssue,
      chatMessages,
      sendChatMessage,
      transactions,
      trustedCircles,
      toggleTrustedCircle,
      showAdminModal,
      setShowAdminModal,
      adminUser,
      adminStats,
      adminKycQueue,
      adminCommissionRules,
      adminAuditLogs,
      loginAdmin,
      approveKycAction,
      updatePricingRule,
      performUserModeration
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
