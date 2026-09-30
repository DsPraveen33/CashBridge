import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Repeat, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Star, 
  Users, 
  PhoneCall, 
  AlertTriangle, 
  UserX, 
  Lock, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Building2,
  Compass,
  ShieldAlert,
  Smartphone,
  Laptop,
  Trash2,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// 22. Transaction History / Your Exchanges Screen
export const Screen22TransactionHistory: React.FC = () => {
  const { navigateTo, goBack, transactions, selectedCountry } = useApp();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const currency = selectedCountry?.symbol || '₹';

  const filtered = transactions.filter((t) => {
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'cancelled') return t.status === 'cancelled';
    return true;
  });

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-white text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 font-['Outfit']">Your Exchanges</h2>
        </div>

        <div className="flex p-1 bg-slate-200/80 rounded-2xl mb-3 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            All ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer ${
              filter === 'cancelled' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-0.5">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              onClick={() => navigateTo('17_exchange_details')}
              className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black font-['Space_Grotesk'] text-slate-900">
                      {currency} {tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                      Completed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Cash ↔ Digital • {tx.peer.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{tx.startedAt}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 text-center">
        <p className="text-[10px] text-slate-400">
          All exchanges verified by peer consensus and backend state machine
        </p>
      </div>
    </div>
  );
};

// 23. Safety Center Screen
export const Screen23SafetyCenter: React.FC = () => {
  const { navigateTo, goBack } = useApp();

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-white text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 font-['Outfit']">Safety & Trust Center</h2>
        </div>

        <div className="p-4 bg-red-500 text-white rounded-2xl shadow-md mb-3">
          <div className="flex items-center gap-2 mb-1">
            <PhoneCall className="w-5 h-5" />
            <h3 className="text-sm font-black font-['Outfit']">Campus & Community SOS</h3>
          </div>
          <p className="text-[11px] text-red-100 mb-3 leading-tight">
            If you ever feel unsafe, press SOS to alert campus security and community moderators.
          </p>
          <button 
            onClick={() => alert('Emergency alert dispatched to Campus Security & Local Coordination Team.')}
            className="w-full py-2 bg-white text-red-600 font-black text-xs rounded-xl shadow cursor-pointer active:scale-95 transition-all"
          >
            Trigger Emergency Alert
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-3 bg-white rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Public Verified Meetpoints Only</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Always meet at designated safe spots with CCTV monitoring (gate cabins, library plazas, main atriums).
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-500" />
              <span>Cryptographic 4-Digit Handshake PIN</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Confirm your partner's 4-digit code in-person before transferring digital funds or handing over cash.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <button
          onClick={() => navigateTo('12_home')}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer font-['Outfit']"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

// 24. Profile & Settings Screen with Active Device Sessions
export const Screen24ProfileSettings: React.FC = () => {
  const { 
    navigateTo, 
    currentUser, 
    setShowAdminModal, 
    selectedCountry, 
    logoutUser,
    deviceSessions,
    fetchDeviceSessions,
    revokeDeviceSession,
    logoutAllOtherDevices
  } = useApp();

  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (showSessionsModal) {
      setLoadingSessions(true);
      fetchDeviceSessions().finally(() => setLoadingSessions(false));
    }
  }, [showSessionsModal]);

  const menuItems = [
    { title: 'My Exchanges', subtitle: `${currentUser.completedExchanges} completed transactions`, icon: Repeat, action: () => navigateTo('22_transaction_history') },
    { title: 'Identity Verification (KYC)', subtitle: `${currentUser.isKycVerified ? 'Verified ✓' : 'Verification In Review'}`, icon: ShieldCheck, action: () => navigateTo('7_kyc_start') },
    { title: 'Security & Active Sessions', subtitle: 'Manage logged-in devices & sessions', icon: Smartphone, action: () => setShowSessionsModal(true) },
    { title: 'Safety & Trust Center', subtitle: 'Emergency SOS & guidelines', icon: Lock, action: () => navigateTo('23_safety_center') },
    { title: 'Compliance & Admin Console', subtitle: 'Staff moderation, KYC queue & pricing', icon: ShieldAlert, action: () => setShowAdminModal(true) },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-slate-900 select-none overflow-y-auto">
      <div>
        <h2 className="text-base font-black text-slate-900 font-['Outfit'] mb-3">User Profile</h2>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3 mb-3">
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
              ✓
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black font-['Outfit'] text-slate-900 leading-tight">
                {currentUser.name}
              </h3>
              <span className="text-xs">{selectedCountry?.flag}</span>
            </div>
            <p className="text-[11px] text-slate-500">{currentUser.city || 'Hyderabad'} • {currentUser.collegeCommunity}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                Reputation: {currentUser.trustScore}/100
              </span>
              <span className="text-[10px] font-bold text-amber-600 font-mono">
                ★ {currentUser.rating}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;

            return (
              <button
                key={idx}
                onClick={item.action}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                    <p className="text-[10px] text-slate-500">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 pb-1">
        <button
          onClick={logoutUser}
          className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out & Invalidate Session</span>
        </button>
      </div>

      {/* Active Device Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900 font-['Outfit']">Active Sessions</h3>
                </div>
                <button 
                  onClick={() => setShowSessionsModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mb-3">
                Manage authenticated devices with active access tokens on your CashBridge account.
              </p>

              {loadingSessions ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                </div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {deviceSessions.map((session) => (
                    <div 
                      key={session.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                          {session.deviceName.includes('Chrome') || session.deviceName.includes('macOS') ? (
                            <Laptop className="w-4 h-4" />
                          ) : (
                            <Smartphone className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-bold text-slate-900">{session.deviceName}</h5>
                            {session.isCurrent && (
                              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded">
                                This Device
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">{session.ipAddress} • {session.lastActive}</p>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => revokeDeviceSession(session.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Revoke session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-4">
              <button
                onClick={logoutAllOtherDevices}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout All Other Devices</span>
              </button>
              <button
                onClick={() => setShowSessionsModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
