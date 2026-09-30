import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Home, 
  Compass, 
  ArrowLeftRight, 
  MessageSquare, 
  User,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminPortalModal } from '../admin/AdminPortalModal';

// Import all 24 screen components
import { 
  Screen01Splash, 
  Screen02Welcome, 
  Screen03SelectCountry, 
  Screen04SignUp, 
  Screen05OtpVerify, 
  Screen06CreatePassword 
} from './screens1to6';

import { 
  Screen07KycStart, 
  Screen08UploadId, 
  Screen09SelfieVerify, 
  Screen11KycVerified 
} from './screens7to11';

import { 
  Screen12HomeScreen, 
  Screen13RequestExchange, 
  Screen14SearchMatches, 
  Screen15NearbyMatches, 
  Screen16UserProfile 
} from './screens12to16';

import { 
  Screen17ExchangeDetails, 
  Screen18MeetingPoint, 
  Screen19InAppChat, 
  Screen20PaymentVerify, 
  Screen21SuccessScreen 
} from './screens17to21';

import { 
  Screen22TransactionHistory, 
  Screen23SafetyCenter, 
  Screen24ProfileSettings 
} from './screens22to24';

export const MobileShell: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeTab, setActiveTab, navigateTo } = useApp();
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case '1_splash': return <Screen01Splash />;
      case '2_welcome': return <Screen02Welcome />;
      case '3_select_country': return <Screen03SelectCountry />;
      case '4_signup': return <Screen04SignUp />;
      case '5_otp_verify': return <Screen05OtpVerify />;
      case '6_create_password': return <Screen06CreatePassword />;
      case '7_kyc_start': return <Screen07KycStart />;
      case '8_upload_id': return <Screen08UploadId />;
      case '9_selfie_verify': return <Screen09SelfieVerify />;
      case '11_kyc_verified': return <Screen11KycVerified />;
      case '12_home': return <Screen12HomeScreen />;
      case '13_request_exchange': return <Screen13RequestExchange />;
      case '14_search_matches': return <Screen14SearchMatches />;
      case '15_nearby_matches': return <Screen15NearbyMatches />;
      case '16_user_profile': return <Screen16UserProfile />;
      case '17_exchange_details': return <Screen17ExchangeDetails />;
      case '18_meeting_point': return <Screen18MeetingPoint />;
      case '19_in_app_chat': return <Screen19InAppChat />;
      case '20_payment_verify': return <Screen20PaymentVerify />;
      case '21_success': return <Screen21SuccessScreen />;
      case '22_transaction_history': return <Screen22TransactionHistory />;
      case '23_safety_center': return <Screen23SafetyCenter />;
      case '24_profile_settings': return <Screen24ProfileSettings />;
      default: return <Screen12HomeScreen />;
    }
  };

  const showBottomNav = [
    '12_home',
    '15_nearby_matches',
    '22_transaction_history',
    '24_profile_settings'
  ].includes(currentScreen);

  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'home') navigateTo('12_home');
    if (tab === 'nearby') navigateTo('15_nearby_matches');
    if (tab === 'requests') navigateTo('13_request_exchange');
    if (tab === 'messages') navigateTo('19_in_app_chat');
    if (tab === 'profile') navigateTo('24_profile_settings');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center sm:py-4 px-0 select-none">
      {/* Separate Admin Portal Modal */}
      <AdminPortalModal />

      {/* Smartphone Container */}
      <div className="w-full sm:max-w-[400px] h-screen sm:h-[844px] bg-slate-900 sm:rounded-[48px] sm:border-[8px] sm:border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
        
        {/* Top Status Bar & Dynamic Island */}
        <div className="w-full bg-white z-50 flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-[13px] font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
            {currentTime}
          </span>

          <div className="w-24 h-5 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 px-2 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-slate-800"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse"></div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-900">
            <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="flex-1 w-full bg-white overflow-hidden relative flex flex-col">
          {renderActiveScreen()}
        </div>

        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <div className="w-full bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-50">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'home' && currentScreen === '12_home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => handleTabClick('nearby')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'nearby' && currentScreen === '15_nearby_matches' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px]">Explore</span>
            </button>

            <button
              onClick={() => handleTabClick('requests')}
              className="flex flex-col items-center -mt-5 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-blue-600 font-bold mt-0.5">Exchange</span>
            </button>

            <button
              onClick={() => handleTabClick('messages')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer relative ${
                activeTab === 'messages' && currentScreen === '19_in_app_chat' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px]">Messages</span>
              <span className="absolute top-0 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
            </button>

            <button
              onClick={() => handleTabClick('profile')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'profile' && currentScreen === '24_profile_settings' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        )}

        {/* Bottom Home Indicator */}
        <div className="bg-white py-1.5 flex justify-center z-50">
          <div 
            onClick={() => navigateTo('12_home')}
            className="w-32 h-1 bg-slate-300 hover:bg-slate-500 rounded-full cursor-pointer transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
