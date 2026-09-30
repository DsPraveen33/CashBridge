import React, { createContext, useContext, useState } from 'react';
import { MobileScreen, MobilePeer, MobileTransaction, ChatMsg, ExchangeType } from '../types/mobileTypes';

export const MOCK_PEERS: MobilePeer[] = [
  {
    id: 'p_rahul',
    name: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    completedExchanges: 32,
    avgResponseMinutes: 2,
    distanceMeters: 120,
    availableAmount: 2000,
    provides: 'cash',
    currentLocationName: 'Near Main Academic Block',
    collegeCommunity: 'AITS College Community Member',
    memberSince: '2024'
  },
  {
    id: 'p_sneha',
    name: 'Sneha Reddy',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.6,
    reviewCount: 18,
    completedExchanges: 28,
    avgResponseMinutes: 3,
    distanceMeters: 250,
    availableAmount: 3000,
    provides: 'cash',
    currentLocationName: 'Near Central Library',
    collegeCommunity: 'AITS College (Hostel Block C)',
    memberSince: '2024'
  },
  {
    id: 'p_vikram',
    name: 'Vikram',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.7,
    reviewCount: 32,
    completedExchanges: 50,
    avgResponseMinutes: 2,
    distanceMeters: 400,
    availableAmount: 5000,
    provides: 'cash',
    currentLocationName: 'Cafeteria Square',
    collegeCommunity: 'AITS College Community Member',
    memberSince: '2023'
  },
  {
    id: 'p_pooja',
    name: 'Pooja Verma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.9,
    reviewCount: 15,
    completedExchanges: 22,
    avgResponseMinutes: 1,
    distanceMeters: 550,
    availableAmount: 1500,
    provides: 'upi',
    currentLocationName: 'Metro Station Gate 1',
    collegeCommunity: 'AITS College Community Member',
    memberSince: '2024'
  }
];

interface MobileAppContextType {
  screen: MobileScreen;
  setScreen: (screen: MobileScreen) => void;
  navigate: (screen: MobileScreen) => void;
  goBack: () => void;
  
  // User
  userName: string;
  userCommunity: string;
  trustScore: number;
  
  // Request
  requestType: ExchangeType;
  setRequestType: (type: ExchangeType) => void;
  amount: number;
  setAmount: (amt: number) => void;
  urgency: string;
  setUrgency: (urg: string) => void;
  radius: string;
  setRadius: (rad: string) => void;
  circleFilter: string;
  setCircleFilter: (filter: string) => void;

  // Peers & Active
  peers: MobilePeer[];
  selectedPeer: MobilePeer;
  setSelectedPeer: (peer: MobilePeer) => void;
  activeTx: MobileTransaction | null;
  startExchange: (peer: MobilePeer) => void;
  advanceStep: () => void;
  completePayment: () => void;
  cancelTx: () => void;

  // Chat
  chatMessages: ChatMsg[];
  sendChat: (text: string) => void;

  // Provider & Settings
  isAvailable: boolean;
  setIsAvailable: (avail: boolean) => void;
  campusOnly: boolean;
  setCampusOnly: (campus: boolean) => void;
  
  // History & Notifications
  history: MobileTransaction[];
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
}

const MobileAppContext = createContext<MobileAppContextType | undefined>(undefined);

export const MobileAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screenHistory, setScreenHistory] = useState<MobileScreen[]>(['home']);
  const screen = screenHistory[screenHistory.length - 1] || 'home';

  const [userName] = useState('Praveen');
  const [userCommunity] = useState('AITS College Community');
  const [trustScore] = useState(92);

  const [requestType, setRequestType] = useState<ExchangeType>('upi_to_cash');
  const [amount, setAmount] = useState(2000);
  const [urgency, setUrgency] = useState('Within 15 min');
  const [radius, setRadius] = useState('500 m');
  const [circleFilter, setCircleFilter] = useState('Everyone');

  const [peers] = useState<MobilePeer[]>(MOCK_PEERS);
  const [selectedPeer, setSelectedPeer] = useState<MobilePeer>(MOCK_PEERS[0]);
  const [activeTx, setActiveTx] = useState<MobileTransaction | null>(null);

  const [isAvailable, setIsAvailable] = useState(false);
  const [campusOnly, setCampusOnly] = useState(true);

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: '1', sender: 'system', text: '🛡️ Safety Reminder: Keep communication inside CashBridge. Never share OTPs or passwords.', time: '10:24 AM' },
    { id: '2', sender: 'peer', text: 'Hi! I am at AITS College Main Gate near Cabin 1.', time: '10:25 AM' },
  ]);

  const [history, setHistory] = useState<MobileTransaction[]>([
    {
      id: 'tx_1',
      code: 'CB-4821',
      securityPin: '4821',
      amount: 2000,
      type: 'upi_to_cash',
      peer: MOCK_PEERS[0],
      meetingPoint: 'AITS College Main Gate',
      meetingPointDistance: '500 m',
      step: 7,
      startedAt: 'Today, 10:24 AM',
      completedAt: 'Today • 10:42 PM',
      status: 'completed'
    },
    {
      id: 'tx_2',
      code: 'CB-3189',
      securityPin: '3189',
      amount: 1000,
      type: 'cash_to_upi',
      peer: MOCK_PEERS[1],
      meetingPoint: 'Central Library Canteen',
      meetingPointDistance: '250 m',
      step: 7,
      startedAt: 'Yesterday',
      completedAt: 'Yesterday • 7:21 PM',
      status: 'completed'
    },
    {
      id: 'tx_3',
      code: 'CB-2104',
      securityPin: '2104',
      amount: 500,
      type: 'upi_to_cash',
      peer: MOCK_PEERS[2],
      meetingPoint: 'Cafeteria Square',
      meetingPointDistance: '400 m',
      step: 7,
      startedAt: '12 Mar',
      completedAt: '12 Mar • 3:15 PM',
      status: 'completed'
    }
  ]);

  const [notifications] = useState([
    { id: 'n1', title: 'New match found nearby: Rahul Kumar (120m)', time: '2 min ago', read: false },
    { id: 'n2', title: 'Rahul accepted your exchange request', time: '5 min ago', read: false },
    { id: 'n3', title: 'Meeting point confirmed at AITS Main Gate', time: '10 min ago', read: true },
    { id: 'n4', title: 'Exchange completed. Trust score +2 points', time: '1 hour ago', read: true }
  ]);

  const navigate = (nextScreen: MobileScreen) => {
    setScreenHistory(prev => [...prev, nextScreen]);
  };

  const setScreen = (s: MobileScreen) => {
    setScreenHistory([s]);
  };

  const goBack = () => {
    setScreenHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : ['home']));
  };

  const startExchange = (peer: MobilePeer) => {
    setSelectedPeer(peer);
    const newTx: MobileTransaction = {
      id: `tx_${Date.now()}`,
      code: 'CB-4821',
      securityPin: '4821',
      amount,
      type: requestType,
      peer,
      meetingPoint: 'AITS College Main Gate',
      meetingPointDistance: '500 m',
      step: 4, // Meeting Point step
      startedAt: '10:24 AM',
      status: 'active'
    };
    setActiveTx(newTx);
    navigate('match_confirmation');
  };

  const advanceStep = () => {
    if (!activeTx) return;
    setActiveTx(prev => prev ? { ...prev, step: Math.min(prev.step + 1, 7) } : null);
  };

  const completePayment = () => {
    if (!activeTx) return;
    const finished: MobileTransaction = {
      ...activeTx,
      step: 7,
      status: 'completed',
      completedAt: '10:42 PM'
    };
    setActiveTx(finished);
    setHistory(prev => [finished, ...prev]);
    navigate('exchange_completed');
  };

  const cancelTx = () => {
    setActiveTx(null);
    setScreen('home');
  };

  const sendChat = (text: string) => {
    const msg: ChatMsg = {
      id: `m_${Date.now()}`,
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);

    setTimeout(() => {
      const peerMsg: ChatMsg = {
        id: `m_${Date.now() + 1}`,
        sender: 'peer',
        text: 'Okay! I am standing right next to Security Cabin 1.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, peerMsg]);
    }, 1000);
  };

  return (
    <MobileAppContext.Provider value={{
      screen,
      setScreen,
      navigate,
      goBack,
      userName,
      userCommunity,
      trustScore,
      requestType,
      setRequestType,
      amount,
      setAmount,
      urgency,
      setUrgency,
      radius,
      setRadius,
      circleFilter,
      setCircleFilter,
      peers,
      selectedPeer,
      setSelectedPeer,
      activeTx,
      startExchange,
      advanceStep,
      completePayment,
      cancelTx,
      chatMessages,
      sendChat,
      isAvailable,
      setIsAvailable,
      campusOnly,
      setCampusOnly,
      history,
      notifications
    }}>
      {children}
    </MobileAppContext.Provider>
  );
};

export const useMobileApp = () => {
  const ctx = useContext(MobileAppContext);
  if (!ctx) throw new Error('useMobileApp must be used within MobileAppProvider');
  return ctx;
};
