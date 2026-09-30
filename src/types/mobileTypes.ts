export type MobileScreen =
  | 'splash'
  | 'onboarding_1'
  | 'onboarding_2'
  | 'onboarding_3'
  | 'location_permission'
  | 'login'
  | 'otp'
  | 'home'
  | 'request_exchange'
  | 'finding_match'
  | 'nearby_matches'
  | 'user_profile'
  | 'match_confirmation'
  | 'exchange_room'
  | 'meeting_point'
  | 'chat'
  | 'transaction_code'
  | 'complete_exchange'
  | 'payment_verification'
  | 'exchange_completed'
  | 'rate_user'
  | 'nearby_tab'
  | 'requests_tab'
  | 'messages_tab'
  | 'trusted_circle'
  | 'i_can_help'
  | 'safety_center'
  | 'report_user'
  | 'notifications'
  | 'profile_tab'
  | 'transaction_history'
  | 'settings';

export type ExchangeType = 'upi_to_cash' | 'cash_to_upi';

export interface MobilePeer {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  completedExchanges: number;
  avgResponseMinutes: number;
  distanceMeters: number;
  availableAmount: number;
  provides: 'cash' | 'upi';
  currentLocationName: string;
  collegeCommunity: string;
  memberSince: string;
}

export interface MobileTransaction {
  id: string;
  code: string; // e.g. CB-4821
  securityPin: string; // e.g. 4821
  amount: number;
  type: ExchangeType;
  peer: MobilePeer;
  meetingPoint: string;
  meetingPointDistance: string;
  step: number; // 1 to 7
  startedAt: string;
  completedAt?: string;
  ratingGiven?: number;
  tags?: string[];
  status: 'active' | 'completed' | 'cancelled' | 'disputed';
}

export interface ChatMsg {
  id: string;
  sender: 'me' | 'peer' | 'system';
  text: string;
  time: string;
}
