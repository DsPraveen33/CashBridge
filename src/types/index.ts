export type ExchangeType = 'upi_to_cash' | 'cash_to_upi'; // upi_to_cash = I Need Cash (have UPI); cash_to_upi = I Need Digital (have Cash)

export type MobileScreen = 
  | '1_splash'
  | '2_welcome'
  | '3_select_country'
  | '4_signup'
  | '5_otp_verify'
  | '6_create_password'
  | '7_kyc_start'
  | '8_upload_id'
  | '9_selfie_verify'
  | '10_kyc_review'
  | '11_kyc_verified'
  | '12_home'
  | '13_request_exchange'
  | '14_search_matches'
  | '15_nearby_matches'
  | '16_user_profile'
  | '17_exchange_details'
  | '18_meeting_point'
  | '19_in_app_chat'
  | '20_payment_verify'
  | '21_success'
  | '22_transaction_history'
  | '23_safety_center'
  | '24_profile_settings'
  | 'circle_manage'
  | 'provider_mode';

export type BottomNavTab = 'home' | 'nearby' | 'requests' | 'messages' | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  country: string;
  countryFlag: string;
  city: string;
  collegeCommunity: string;
  isKycVerified: boolean;
  trustScore: number;
  completedExchanges: number;
  rating: number;
  reviewsCount: number;
  memberSince: string;
  idDocumentType?: string;
  activeProvider: boolean;
}

export interface PeerUser {
  id: string;
  name: string;
  avatar: string;
  distance: string;
  distanceMeters: number;
  provides: 'cash' | 'upi';
  availableAmount: number;
  trustScore: number;
  rating: number;
  reviewsCount: number;
  completedExchanges: number;
  isKycVerified: boolean;
  currentLocationName: string;
  isOnline: boolean;
  responseTime: string;
  inTrustedCircle?: boolean;
}

export interface MeetingPoint {
  id: string;
  name: string;
  category: 'Mall Entrance' | 'Metro Station' | 'Café / Coffee Shop' | 'Community Center' | 'College Gate';
  distance: string;
  isCctvMonitored: boolean;
  isWellLit: boolean;
  address: string;
  image: string;
  tag: string;
}

export interface ExchangeTransaction {
  id: string;
  code: string;
  securityPin: string;
  type: ExchangeType;
  amount: number;
  currency: string;
  fee?: number;
  peer: PeerUser;
  status: 'request_sent' | 'user_matched' | 'both_accepted' | 'accepted' | 'meeting_confirmed' | 'meeting_point_confirmed' | 'exchange_in_progress' | 'verify_payment' | 'completed' | 'cancelled' | 'disputed';
  timelineStep: number; // 1 to 7
  startedAt: string;
  completedAt?: string;
  meetingPoint: MeetingPoint;
  meetingTime?: string;
  urgency?: string;
  searchRange?: string;
  matchType?: 'everyone' | 'verified_only' | 'trusted_only';
  userConfirmedPayment?: boolean;
  peerConfirmedPayment?: boolean;
  ratingGiven?: number;
  ratingTags?: string[];
  disputeReason?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: 'user' | 'peer' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isSecurityAlert?: boolean;
}

export interface TrustedCircleItem {
  id: string;
  category: 'College' | 'Hostel' | 'Office' | 'Neighborhood';
  title: string;
  membersCount: number;
  verifiedRate: number;
  enabled: boolean;
  isJoined?: boolean;
}
