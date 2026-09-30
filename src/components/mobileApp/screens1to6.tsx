import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  MapPin, 
  Globe, 
  ArrowRight, 
  Search, 
  Check, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  ShieldAlert,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

// -------------------------------------------------------------
// 1. Splash Screen with Real Session Restoration & Timeout Guard
// -------------------------------------------------------------
export const Screen01Splash: React.FC = () => {
  const { 
    navigateTo, 
    authState, 
    networkStatus, 
    authError, 
    retryInitialization,
    logoutUser,
    currentUser
  } = useApp();

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-gradient-to-b from-blue-700 via-blue-800 to-slate-950 text-white relative overflow-hidden select-none">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Real-time Connection Indicator */}
      <div className="flex justify-between items-center z-10 pt-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold border border-white/10">
          {networkStatus === 'CONNECTED' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300">Connected</span>
            </>
          ) : networkStatus === 'RECONNECTING' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-amber-300">Reconnecting...</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="text-red-300">Offline</span>
            </>
          )}
        </div>

        <div className="text-[10px] font-mono text-blue-200">
          Auth v3.2 • Secure
        </div>
      </div>

      <div className="flex flex-col items-center pt-4 z-10">
        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl p-3 border border-white/20 shadow-2xl flex items-center justify-center mb-4 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
              <path d="M8 26 C14 15, 26 15, 32 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M13 26 L13 22 M20 26 L20 18 M27 26 L27 22" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <circle cx="20" cy="12" r="3" fill="#10B981" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-black font-['Outfit'] tracking-tight">CashBridge</h1>
        <p className="text-blue-200 text-xs font-semibold mt-1.5 text-center max-w-[240px] font-['Space_Grotesk'] leading-relaxed">
          Physical Cash ↔ Digital Payment Coordination Network
        </p>
      </div>

      {/* Main Status & Interactive State Container */}
      <div className="flex-1 flex items-center justify-center my-4 z-10">
        {authState === 'INITIALIZING' ? (
          <div className="w-full max-w-[280px] bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-300 animate-spin mx-auto" />
            <p className="text-xs font-bold text-white">Validating Security Session...</p>
            <p className="text-[11px] text-blue-200 leading-tight">
              Establishing TLS connection & verifying cryptographic token with backend.
            </p>
          </div>
        ) : authState === 'ERROR' ? (
          <div className="w-full max-w-[280px] bg-red-950/40 backdrop-blur-lg rounded-3xl p-5 border border-red-500/30 shadow-2xl text-center space-y-3">
            <WifiOff className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="text-sm font-black text-white">Unable to connect.</h3>
            <p className="text-[11px] text-red-200">
              {authError || 'Could not verify session with authentication server.'}
            </p>
            <button
              onClick={retryInitialization}
              className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        ) : authState === 'ACCOUNT_SUSPENDED' ? (
          <div className="w-full max-w-[280px] bg-red-900/60 backdrop-blur-lg rounded-3xl p-5 border border-red-500/40 shadow-2xl text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="text-sm font-black text-white">Account Suspended</h3>
            <p className="text-[11px] text-red-200">
              Your account has been suspended by compliance moderators for policy violations.
            </p>
            <button
              onClick={logoutUser}
              className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl"
            >
              Sign Out & Switch Account
            </button>
          </div>
        ) : authState === 'ACCOUNT_RESTRICTED' ? (
          <div className="w-full max-w-[280px] bg-amber-900/60 backdrop-blur-lg rounded-3xl p-5 border border-amber-500/40 shadow-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-black text-white">Account Restricted</h3>
            <p className="text-[11px] text-amber-200">
              Certain exchange capabilities are restricted pending identity review.
            </p>
            <button
              onClick={() => navigateTo('11_kyc_verified')}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              View Verification Status
            </button>
          </div>
        ) : (
          <div className="relative w-full max-w-[280px] bg-white/10 backdrop-blur-lg rounded-3xl p-5 border border-white/20 shadow-2xl text-center">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&w=500&q=80" 
              alt="P2P Exchange" 
              className="w-full h-36 object-cover rounded-2xl mb-3 shadow-md"
            />
            <div className="flex items-center justify-center gap-1.5 py-1">
              <span className="w-6 h-1.5 rounded-full bg-white"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 z-10 pb-4">
        {authState === 'UNAUTHENTICATED' && (
          <>
            <button
              onClick={() => navigateTo('2_welcome')}
              className="w-full py-3.5 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] font-['Outfit']"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-blue-200">
              Already have an account?{' '}
              <button onClick={() => navigateTo('4_signup')} className="text-white font-bold underline cursor-pointer">
                Log In
              </button>
            </p>
          </>
        )}

        {(authState === 'KYC_VERIFIED' || authState === 'AUTHENTICATED') && (
          <button
            onClick={() => navigateTo('12_home')}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] font-['Outfit']"
          >
            <span>Continue as {currentUser.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Welcome Screen
// -------------------------------------------------------------
export const Screen02Welcome: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white text-slate-900 select-none overflow-y-auto">
      <div className="flex flex-col items-center text-center pt-2">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 font-bold">
          <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
            <path d="M8 26 C14 15, 26 15, 32 26" stroke="#0066FF" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M13 26 L13 22 M20 26 L20 18 M27 26 L27 22" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="12" r="3" fill="#10B981" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-slate-900 font-['Outfit']">CashBridge Global</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
          Trusted digital payment ↔ physical cash coordination network.
        </p>
      </div>

      <div className="my-4 space-y-3">
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-['Outfit']">Global Digital Payment Rails</h4>
            <p className="text-[11px] text-slate-500">UPI, Zelle, Faster Payments, Interac & more</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-['Outfit']">Safe Monitored Public Spots</h4>
            <p className="text-[11px] text-slate-500">CCTV gates, campus hubs, verified public plazas</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 font-['Outfit']">Real Verified KYC Compliance</h4>
            <p className="text-[11px] text-slate-500">Government ID & biometric anti-spoofing verification</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pb-2">
        <button
          onClick={() => navigateTo('3_select_country')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] font-['Outfit']"
        >
          <span>Select Country & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[11px] text-slate-500">
          Already have an account?{' '}
          <button onClick={() => navigateTo('4_signup')} className="text-blue-600 font-bold underline cursor-pointer">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Select Country or Region
// -------------------------------------------------------------
export const Screen03SelectCountry: React.FC = () => {
  const { navigateTo, countries, selectedCountry, setSelectedCountry, setSelectedPaymentMethod, goBack } = useApp();
  const [search, setSearch] = useState('');

  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search) ||
    c.currency.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
    if (country.paymentMethods?.length) {
      setSelectedPaymentMethod(country.paymentMethods[0]);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-400">Step 1 of 4 • Region Selection</span>
        </div>

        <h2 className="text-lg font-black text-slate-900 font-['Outfit']">Select Your Country / Region</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Configures regional payment rails, currency, and local KYC rules.
        </p>

        <div className="relative mt-3 mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country (India, US, UK, Canada, UAE...)"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
          />
        </div>

        <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supported Countries</p>
          {filtered.map(country => (
            <button
              key={country.id}
              onClick={() => handleSelect(country)}
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                selectedCountry?.id === country.id 
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{country.flag}</span>
                <div className="text-left">
                  <span>{country.name}</span>
                  <span className="text-[10px] text-slate-400 block">{country.currency} ({country.symbol})</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>{country.code}</span>
                {selectedCountry?.id === country.id && (
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-3">
        <button
          onClick={() => navigateTo('4_signup')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] font-['Outfit']"
        >
          <span>Continue with {selectedCountry?.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Real Login & Registration Screen (Dual Tab Architecture)
// -------------------------------------------------------------
export const Screen04SignUp: React.FC = () => {
  const { 
    navigateTo, 
    selectedCountry, 
    authPhone, 
    setAuthPhone, 
    authEmail,
    setAuthEmail,
    authName, 
    setAuthName, 
    sendRealOtp, 
    loginRealUser,
    goBack 
  } = useApp();

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginMethod, setLoginMethod] = useState<'PHONE_OTP' | 'EMAIL_PASSWORD'>('PHONE_OTP');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [serverNotice, setServerNotice] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNotice, setForgotNotice] = useState('');

  // Handle Phone OTP Request
  const handleRequestOtp = async () => {
    if (!authPhone || authPhone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setServerNotice('');

    try {
      const res = await sendRealOtp(authPhone, undefined);
      if (res.success) {
        if (res.debugOtp) {
          setServerNotice(`Verification Code: ${res.debugOtp}`);
        }
        setTimeout(() => navigateTo('5_otp_verify'), 300);
      } else {
        setErrorMsg(res.message || 'Failed to dispatch verification code.');
      }
    } catch {
      setErrorMsg('Unable to connect. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email & Password Login
  const handleEmailPasswordLogin = async () => {
    const identifier = authEmail.trim() || authPhone.trim();
    if (!identifier || !loginPassword) {
      setErrorMsg('Please enter both identifier and password.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setServerNotice('');

    try {
      const res = await loginRealUser(identifier, loginPassword);
      if (!res.success) {
        setErrorMsg(res.message || 'Email or password is incorrect.');
      }
    } catch {
      setErrorMsg('Unable to connect. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Initial Registration Step
  const handleRegisterNext = async () => {
    if (!authName || authName.trim().length < 2) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!authPhone || authPhone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await sendRealOtp(authPhone, authEmail || undefined);
      if (res.success) {
        if (res.debugOtp) {
          setServerNotice(`Verification Code: ${res.debugOtp}`);
        }
        setTimeout(() => navigateTo('5_otp_verify'), 300);
      } else {
        setErrorMsg(res.message || 'Failed to dispatch verification code.');
      }
    } catch {
      setErrorMsg('Unable to connect. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!forgotIdentifier) return;
    setLoading(true);
    try {
      const res = await api.forgotPassword(forgotIdentifier);
      setForgotNotice(res.message || 'Recovery instructions sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-2">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            <span>{selectedCountry?.flag}</span>
            <span>{selectedCountry?.code}</span>
          </div>
        </div>

        <div className="flex justify-center mb-1">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
              <path d="M8 26 C14 15, 26 15, 32 26" stroke="#0066FF" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M13 26 L13 22 M20 26 L20 18 M27 26 L27 22" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
              <circle cx="20" cy="12" r="3" fill="#10B981" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-black text-center text-slate-900 font-['Outfit']">
          {authMode === 'LOGIN' ? 'Welcome Back to CashBridge' : 'Create Your Account'}
        </h2>
        <p className="text-[11px] text-center text-slate-500 mt-0.5">
          {authMode === 'LOGIN' 
            ? 'Sign in with your verified phone or email credentials' 
            : 'Secure identity verification and peer exchange coordination'}
        </p>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl my-3">
          <button
            onClick={() => { setAuthMode('LOGIN'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              authMode === 'LOGIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('REGISTER'); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              authMode === 'REGISTER' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Real Error Banners */}
        {errorMsg && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-1.5 my-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {serverNotice && (
          <div className="p-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl font-mono text-center my-2">
            {serverNotice}
          </div>
        )}

        {/* ----------------- LOGIN MODE ----------------- */}
        {authMode === 'LOGIN' ? (
          <div className="space-y-3 mt-2">
            {/* Login Method Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginMethod('PHONE_OTP')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                  loginMethod === 'PHONE_OTP' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone + OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod('EMAIL_PASSWORD')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                  loginMethod === 'EMAIL_PASSWORD' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
            </div>

            {loginMethod === 'PHONE_OTP' ? (
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Phone Number</label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{selectedCountry?.flag}</span>
                    <span>{selectedCountry?.code}</span>
                  </div>
                  <input 
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1 px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email or Phone Number</label>
                  <input 
                    type="text"
                    value={authEmail || authPhone}
                    onChange={(e) => {
                      setAuthEmail(e.target.value);
                      setAuthPhone(e.target.value);
                    }}
                    placeholder="name@cashbridge.org or phone"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[10px] text-blue-600 font-bold hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full px-3 py-2.5 pr-9 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={loginMethod === 'PHONE_OTP' ? handleRequestOtp : handleEmailPasswordLogin}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-['Outfit'] disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{loginMethod === 'PHONE_OTP' ? 'Send Real OTP' : 'Sign In with Password'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* ----------------- REGISTER MODE ----------------- */
          <div className="space-y-2.5 mt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Full Legal Name</label>
              <input 
                type="text"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="As per Government ID"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Mobile Phone Number</label>
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{selectedCountry?.flag}</span>
                  <span>{selectedCountry?.code}</span>
                </div>
                <input 
                  type="tel"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="Mobile number"
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Email Address (Optional)</label>
              <input 
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-900"
              />
            </div>

            <button
              onClick={handleRegisterNext}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-['Outfit'] disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Verify Phone via Real OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center my-3">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-[10px] text-slate-400 font-bold uppercase">or</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <button 
          onClick={handleRequestOtp}
          className="w-full py-2 px-3 border border-slate-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="text-center pt-2">
        <p className="text-[10px] text-slate-400">
          TLS Encrypted • Salted PBKDF2 Credentials • Zero plaintext secrets
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 font-['Outfit']">Account Recovery</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Enter your registered phone or email to receive a password reset verification code.
            </p>

            <input 
              type="text"
              value={forgotIdentifier}
              onChange={(e) => setForgotIdentifier(e.target.value)}
              placeholder="Registered Phone or Email"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 my-3"
            />

            {forgotNotice && (
              <p className="text-xs text-emerald-600 font-bold mb-3">{forgotNotice}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 5. OTP Verification Screen (Constant-Time + Attempt Guard)
// -------------------------------------------------------------
export const Screen05OtpVerify: React.FC = () => {
  const { 
    navigateTo, 
    otpCode, 
    setOtpCode, 
    selectedCountry, 
    authPhone, 
    authEmail,
    verifyRealOtp, 
    sendRealOtp, 
    goBack 
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 min TTL
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 0));
      setResendCooldown(r => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp_input_${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = otpCode.join('').trim();
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await verifyRealOtp(fullCode);
      if (res.success && res.verified) {
        if (res.token) {
          // Existing user logged in with OTP
          navigateTo('12_home');
        } else {
          // New registration proceed to password setup
          navigateTo('6_create_password');
        }
      } else {
        setErrorMsg(res.message || 'Incorrect verification code.');
      }
    } catch {
      setErrorMsg('Error communicating with verification backend.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 mb-2">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Smartphone className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-lg font-black text-center text-slate-900 font-['Outfit']">Verify Your Number</h2>
        <p className="text-[11px] text-center text-slate-500 mt-0.5">
          Dispatched real code to <span className="font-bold text-slate-800">{selectedCountry?.code} {authPhone || authEmail}</span>
        </p>
        <p className="text-[10px] text-center text-blue-600 font-mono mt-0.5">
          Expires in {formatTime(countdown)}
        </p>

        {errorMsg && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-semibold flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-center gap-2 my-5">
          {otpCode.map((digit, i) => (
            <input
              key={i}
              id={`otp_input_${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              className="w-10 h-12 text-center text-lg font-black font-['Space_Grotesk'] bg-slate-50 border-2 border-blue-500 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 shadow-sm"
            />
          ))}
        </div>

        <div className="text-center">
          {resendCooldown > 0 ? (
            <span className="text-[11px] text-slate-400 font-medium">
              Resend code available in {resendCooldown}s
            </span>
          ) : (
            <button 
              onClick={() => { sendRealOtp(); setResendCooldown(60); }}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Resend New Code
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 pb-2">
        <button
          onClick={handleVerify}
          disabled={loading || countdown === 0}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Cryptographic Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button 
          onClick={goBack}
          className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 text-center block"
        >
          Change Mobile Number
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. Create Strong Password Screen
// -------------------------------------------------------------
export const Screen06CreatePassword: React.FC = () => {
  const { navigateTo, passwordInput, setPasswordInput, registerRealUser, goBack } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isMinLength = passwordInput.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordInput);
  const hasNumber = /[0-9]/.test(passwordInput);

  const handleCreateAccount = async () => {
    if (!isMinLength) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await registerRealUser();
      if (res.success) {
        navigateTo('7_kyc_start');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Could not register account. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 mb-2">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-lg font-black text-center text-slate-900 font-['Outfit']">Create a Strong Password</h2>
        <p className="text-[11px] text-center text-slate-500 mt-0.5">
          Secured with PBKDF2 / SHA-512 cryptographic hashing and per-user salt.
        </p>

        {errorMsg && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
          <div className={`flex items-center gap-2 text-[11px] font-semibold ${isMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasUppercase ? 'text-emerald-600' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>One uppercase letter</span>
          </div>
          <div className={`flex items-center gap-2 text-[11px] font-semibold ${hasNumber ? 'text-emerald-600' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>One number or special character</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Create strong password"
              className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="pb-2">
        <button
          onClick={handleCreateAccount}
          disabled={loading || !isMinLength}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering User Account...</span>
            </>
          ) : (
            <>
              <span>Continue to Identity Verification</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
