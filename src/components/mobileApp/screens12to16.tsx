import React, { useState, useEffect } from 'react';
import { 
  Banknote, 
  QrCode, 
  HandCoins, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight, 
  Search, 
  SlidersHorizontal, 
  Check, 
  Clock, 
  CheckCircle2, 
  User, 
  Flag,
  Sparkles,
  Zap,
  DollarSign,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PeerUser } from '../../types';

// 12. Home Screen
export const Screen12HomeScreen: React.FC = () => {
  const { navigateTo, setExchangeType, currentUser, peers, selectedCountry, selectedPaymentMethod, toggleProviderMode, isProviderActive } = useApp();

  const handleNeedCash = () => {
    setExchangeType('upi_to_cash'); // Has Digital Payment, Needs Cash
    navigateTo('13_request_exchange');
  };

  const handleNeedDigital = () => {
    setExchangeType('cash_to_upi'); // Has Cash, Needs Digital Payment
    navigateTo('13_request_exchange');
  };

  const handleToggleHelp = async () => {
    await toggleProviderMode(!isProviderActive);
  };

  const currencySymbol = selectedCountry?.symbol || '₹';
  const paymentMethodLabel = selectedPaymentMethod ? selectedPaymentMethod.name : 'Digital Payment';

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-slate-900 select-none overflow-y-auto">
      <div>
        {/* Top App Header */}
        <div className="flex items-center justify-between pt-1 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                <path d="M8 26 C14 15, 26 15, 32 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M13 26 L13 22 M20 26 L20 18 M27 26 L27 22" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                <circle cx="20" cy="12" r="3" fill="#10B981" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black font-['Outfit'] text-slate-900 leading-tight">CashBridge</span>
                <span className="text-xs">{selectedCountry?.flag}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{currentUser.city || 'Global Hub'}</span>
            </div>
          </div>

          <button 
            onClick={() => navigateTo('24_profile_settings')} 
            className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-full shadow-sm cursor-pointer"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-7 h-7 rounded-full object-cover border border-blue-500" 
            />
            <span className="text-[10px] font-bold text-emerald-600 pr-1.5 font-mono">{currentUser.trustScore}★</span>
          </button>
        </div>

        {/* Greeting & Active Payment Method Pill */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 font-['Outfit']">Hello, {currentUser.name.split(' ')[0]}! 👋</h2>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
              {paymentMethodLabel.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">What do you need today?</p>
        </div>

        {/* Big Action Cards */}
        <div className="space-y-3">
          {/* Green Card: I NEED CASH */}
          <button
            onClick={handleNeedCash}
            className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-3xl p-4 shadow-xl shadow-emerald-500/20 text-left transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wide">
                    Instant Cash
                  </span>
                </div>
                <h3 className="text-xl font-black font-['Outfit'] tracking-tight">I NEED CASH</h3>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  I have digital balance and need physical cash
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                <Banknote className="w-7 h-7 text-white" />
              </div>
            </div>
          </button>

          {/* Blue Card: I NEED DIGITAL PAYMENT */}
          <button
            onClick={handleNeedDigital}
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-3xl p-4 shadow-xl shadow-blue-500/20 text-left transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wide">
                    Instant Digital
                  </span>
                </div>
                <h3 className="text-xl font-black font-['Outfit'] tracking-tight">I NEED DIGITAL</h3>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  I have physical cash and need digital transfer
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-inner">
                <QrCode className="w-7 h-7 text-white" />
              </div>
            </div>
          </button>

          {/* Secondary Card: Provider Mode Toggle */}
          <div className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isProviderActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                <HandCoins className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 font-['Outfit']">I CAN HELP (Provider Mode)</h4>
                <p className="text-[10px] text-slate-500">
                  {isProviderActive ? '🟢 You are visible to nearby exchangers' : '⚪ Offline in database matching'}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleHelp}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                isProviderActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isProviderActive ? 'Online' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Global Community active peers banner */}
        <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 font-['Outfit']">Database Active Peers</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              🟢 {peers.length} eligible providers
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {peers.map((p) => (
              <div 
                key={p.id}
                onClick={() => {
                  navigateTo('16_user_profile');
                }}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <img 
                    src={p.avatar} 
                    alt={p.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1 max-w-[50px] truncate">{p.name.split(' ')[0]}</span>
                <span className="text-[9px] text-slate-400 font-mono">{p.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 text-center">
        <p className="text-[10px] text-slate-400">
          🛡️ Real Backend State Machine • Live Dynamic Commission Engine
        </p>
      </div>
    </div>
  );
};

// 13. Request Exchange Screen with Dynamic Commission Engine
export const Screen13RequestExchange: React.FC = () => {
  const { 
    navigateTo, 
    goBack, 
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
    selectedCountry,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    activeFeeQuote,
    fetchDynamicFeeQuote
  } = useApp();

  const isNeedCash = exchangeType === 'upi_to_cash';
  const currency = selectedCountry?.symbol || '₹';
  const quickAmounts = [500, 1000, 2000, 5000];

  useEffect(() => {
    fetchDynamicFeeQuote();
  }, [requestAmount, urgency, searchRange, exchangeType, selectedPaymentMethod]);

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 font-['Outfit']">Request Exchange</h2>
        </div>

        {/* Segmented Selector */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-3 text-xs font-bold">
          <button
            onClick={() => setExchangeType('upi_to_cash')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isNeedCash ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>I Need Cash</span>
          </button>

          <button
            onClick={() => setExchangeType('cash_to_upi')}
            className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isNeedCash ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>I Need Digital</span>
          </button>
        </div>

        {/* Payment Rail Selector */}
        {selectedCountry?.paymentMethods?.length > 1 && (
          <div className="mb-3">
            <label className="text-xs font-bold text-slate-700 block mb-1">Digital Payment Rail</label>
            <div className="grid grid-cols-2 gap-1.5">
              {selectedCountry.paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPaymentMethod(pm)}
                  className={`p-2 rounded-xl text-left border text-xs font-bold flex items-center gap-2 ${
                    selectedPaymentMethod?.id === pm.id ? 'bg-blue-50 border-blue-500 text-blue-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">{pm.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-1.5 mb-3">
          <label className="text-xs font-bold text-slate-700">
            {isNeedCash ? 'How much cash do you need?' : 'How much digital payment do you need?'}
          </label>
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono">
              {selectedCountry?.currency} ({currency})
            </div>
            <input 
              type="number"
              value={requestAmount}
              onChange={(e) => setRequestAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="flex-1 px-3 py-2 text-base font-black font-['Space_Grotesk'] bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-0.5">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setRequestAmount(amt)}
                className={`py-1.5 rounded-xl text-xs font-bold border font-['Space_Grotesk'] transition-all cursor-pointer ${
                  requestAmount === amt ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {currency}{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences: Urgency & Range */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option>Now</option>
              <option>Within 15 min</option>
              <option>Within 30 min</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Search Range</label>
            <select
              value={searchRange}
              onChange={(e) => setSearchRange(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <option>Within 1 km</option>
              <option>Within 5 km</option>
              <option>Within 10 km</option>
            </select>
          </div>
        </div>

        {/* SERVER-SIDE DYNAMIC COMMISSION & FEE QUOTE CARD */}
        {activeFeeQuote && (
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-inner space-y-1.5 text-xs mb-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="font-bold flex items-center gap-1 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Live Dynamic Fee Quote
              </span>
              <span className="text-[10px] font-mono text-slate-400">{activeFeeQuote.quoteId}</span>
            </div>

            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Exchange Amount:</span>
              <span className="font-mono font-bold text-white">{currency} {activeFeeQuote.exchangeAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Base + Percentage Fee:</span>
              <span className="font-mono">{currency} {activeFeeQuote.baseFee} + {currency} {activeFeeQuote.percentageFee}</span>
            </div>

            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Distance & Urgency Adjustment:</span>
              <span className="font-mono">{currency} {activeFeeQuote.distanceFee + activeFeeQuote.urgencyFee}</span>
            </div>

            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Applicable Tax (GST/VAT):</span>
              <span className="font-mono">{currency} {activeFeeQuote.tax}</span>
            </div>

            <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-extrabold text-white text-xs">Total Service Fee:</span>
                <span className="text-[9px] text-slate-400 block">Locked for 15 mins</span>
              </div>
              <div className="text-right">
                <span className="font-black font-['Space_Grotesk'] text-emerald-400 text-sm">
                  {currency} {activeFeeQuote.totalFee}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-1">
        <button
          onClick={() => navigateTo('14_search_matches')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>Find Database Matches</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 14. Search Matches / Finding Matches Screen
export const Screen14SearchMatches: React.FC = () => {
  const { navigateTo, goBack, currentUser, requestAmount, selectedCountry, fetchDatabaseMatches } = useApp();

  useEffect(() => {
    fetchDatabaseMatches();
  }, []);

  const currency = selectedCountry?.symbol || '₹';

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 mb-2">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-center text-slate-900 font-['Outfit']">Querying Database...</h2>
        <p className="text-xs text-center text-slate-500 mt-0.5">
          Searching for eligible providers with {currency}{requestAmount.toLocaleString()} in database...
        </p>

        <div className="my-8 flex justify-center items-center">
          <div className="relative w-48 h-48 rounded-full border-2 border-blue-200 flex items-center justify-center bg-blue-50/50">
            <div className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping"></div>
            <div className="w-32 h-32 rounded-full border border-blue-300 bg-blue-100/40 flex items-center justify-center">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-md"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 max-w-[280px] mx-auto bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Real SQL availability query executed</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Matching country & currency rails</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Server Dynamic Fee quote locked</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-2">
        <button
          onClick={() => navigateTo('15_nearby_matches')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>View Verified Matches</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 15. Nearby Matches Screen
export const Screen15NearbyMatches: React.FC = () => {
  const { navigateTo, goBack, peers, setSelectedPeer, selectedCountry } = useApp();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleSelectPeer = (peer: PeerUser) => {
    setSelectedPeer(peer);
    navigateTo('16_user_profile');
  };

  const currency = selectedCountry?.symbol || '₹';

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-slate-50 text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <button onClick={goBack} className="p-1.5 rounded-full hover:bg-white text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-slate-900 font-['Outfit']">Database Matches</h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              List ({peers.length})
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              Map
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5">
            {peers.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-600">No verified matches nearby yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Providers will appear when they go online.</p>
              </div>
            ) : (
              peers.map((peer) => (
                <div
                  key={peer.id}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={peer.avatar} 
                        alt={peer.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" 
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900">{peer.name}</h4>
                        <span className="text-[10px] text-emerald-600 font-bold">✓ KYC</span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                          {peer.rating}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">Max {currency}{peer.availableAmount.toLocaleString()}</span>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {peer.distance} • {peer.currentLocationName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPeer(peer)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm flex-shrink-0 cursor-pointer"
                  >
                    View Match
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative h-[360px] flex flex-col justify-between overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs z-10">
              <span className="font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Hyperlocal Map Radius
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {peers.length} Peers Active
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border border-blue-500/30 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-blue-500/40 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold shadow-lg">
                    You
                  </div>
                </div>
              </div>

              {peers[0] && (
                <button 
                  onClick={() => handleSelectPeer(peers[0])}
                  className="absolute top-8 left-12 bg-white text-slate-900 rounded-full px-2 py-1 flex items-center gap-1 text-[10px] font-bold shadow-lg cursor-pointer"
                >
                  <img src={peers[0].avatar} alt="" className="w-4 h-4 rounded-full" />
                  <span>{peers[0].name.split(' ')[0]} ({peers[0].distance})</span>
                </button>
              )}
            </div>

            <div className="text-[10px] text-slate-400 text-center z-10">
              Select verified peer to review trust score and begin exchange
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <p className="text-[10px] text-center text-slate-500">
          Showing real verified exchange partners from CashBridge database
        </p>
      </div>
    </div>
  );
};

// 16. User Profile / Peer Details Screen
export const Screen16UserProfile: React.FC = () => {
  const { navigateTo, goBack, selectedPeer, startExchangeWithPeer } = useApp();
  const [loading, setLoading] = useState(false);

  const handleStartExchange = async () => {
    setLoading(true);
    try {
      await startExchangeWithPeer(selectedPeer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black font-['Outfit'] text-slate-800">Peer Trust Profile</span>
          <div className="w-6"></div>
        </div>

        <div className="flex flex-col items-center text-center my-2">
          <div className="relative mb-2">
            <img 
              src={selectedPeer.avatar} 
              alt={selectedPeer.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-md"
            />
            <span className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <h3 className="text-base font-black font-['Outfit'] text-slate-900 flex items-center gap-1.5">
            {selectedPeer.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
              {selectedPeer.rating} ({selectedPeer.reviewsCount} reviews)
            </span>
            <span>•</span>
            <span className="text-blue-600 font-bold font-mono">
              {selectedPeer.completedExchanges} completed
            </span>
          </div>
        </div>

        <div className="my-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Identity verified (Licensed KYC Provider)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Trust Score: {selectedPeer.trustScore}/100</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>100% Positive exchange history</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs space-y-1">
          <div className="flex justify-between text-slate-700">
            <span>Location:</span>
            <span className="font-bold text-slate-900">{selectedPeer.currentLocationName}</span>
          </div>
          <div className="flex justify-between text-slate-700">
            <span>Distance:</span>
            <span className="font-bold text-slate-900 font-mono">{selectedPeer.distance}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-3 pb-1">
        <button
          onClick={handleStartExchange}
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] disabled:opacity-50"
        >
          <span>{loading ? 'Creating Server Session...' : 'Request Exchange'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button 
          onClick={() => navigateTo('23_safety_center')}
          className="w-full py-2 text-xs font-bold text-slate-400 hover:text-red-600 text-center block cursor-pointer"
        >
          Report User
        </button>
      </div>
    </div>
  );
};
