import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  Lock, 
  Check, 
  RefreshCw, 
  Search, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Ban,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminPortalModal: React.FC = () => {
  const { 
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
  } = useApp();

  const [email, setEmail] = useState('admin@cashbridge.org');
  const [password, setPassword] = useState('AdminPass@2026');
  const [mfaCode, setMfaCode] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'kyc_queue' | 'pricing' | 'users' | 'audit'>('dashboard');

  // Pricing Rule Edit Form State
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editBaseFee, setEditBaseFee] = useState<number>(15);
  const [editPercentageFee, setEditPercentageFee] = useState<number>(1.0);
  const [editTaxRate, setEditTaxRate] = useState<number>(18);
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState('');

  if (!showAdminModal) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = await loginAdmin(email, password, mfaCode);
    if (!ok) {
      setLoginError('Invalid credentials or MFA verification failed.');
    }
  };

  const handleSavePricing = async (ruleId: string) => {
    await updatePricingRule(ruleId, {
      baseFee: editBaseFee,
      percentageFee: editPercentageFee,
      taxRatePercent: editTaxRate
    });
    setPricingSuccessMsg('Pricing rule updated and logged to audit trail!');
    setEditingRuleId(null);
    setTimeout(() => setPricingSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black font-['Outfit'] text-white">CashBridge Admin Console</h2>
              <p className="text-[11px] text-slate-400">
                {adminUser ? `Logged in: ${adminUser.name} (${adminUser.role})` : 'Separate Administrator & Compliance Portal'}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowAdminModal(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {!adminUser ? (
          /* Admin Login Screen with MFA */
          <div className="p-8 max-w-md mx-auto w-full flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">Administrator Authentication</h3>
            <p className="text-xs text-slate-400 text-center mt-0.5 mb-6">
              Enter authorized credentials and 6-digit MFA code.
            </p>

            {loginError && (
              <div className="w-full p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-4 text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="w-full space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Admin Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">6-Digit MFA Authenticator</label>
                <input 
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono tracking-widest text-center focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg mt-2 cursor-pointer font-['Outfit']"
              >
                Authenticate & Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Admin Environment */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-slate-950 p-3 border-r border-slate-800 flex md:flex-col gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveAdminTab('dashboard')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeAdminTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Live DB Metrics</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('kyc_queue')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  activeAdminTab === 'kyc_queue' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>KYC Queue</span>
                </div>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-1.5 py-0.2 rounded-full">
                  {adminKycQueue.filter(k => k.status === 'IN_REVIEW' || k.status === 'PENDING').length}
                </span>
              </button>

              <button
                onClick={() => setActiveAdminTab('pricing')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeAdminTab === 'pricing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pricing & Fees</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('audit')}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                  activeAdminTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: Live DB Metrics */}
              {activeAdminTab === 'dashboard' && adminStats && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white font-['Outfit']">Database Aggregated Statistics</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Users</span>
                      <h4 className="text-xl font-black text-white font-['Space_Grotesk'] mt-1">{adminStats.totalUsers}</h4>
                    </div>

                    <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">KYC Verified</span>
                      <h4 className="text-xl font-black text-emerald-400 font-['Space_Grotesk'] mt-1">{adminStats.verifiedUsers}</h4>
                    </div>

                    <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">KYC Pending</span>
                      <h4 className="text-xl font-black text-amber-400 font-['Space_Grotesk'] mt-1">{adminStats.pendingKyc}</h4>
                    </div>

                    <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Volume</span>
                      <h4 className="text-xl font-black text-blue-400 font-['Space_Grotesk'] mt-1">₹{adminStats.totalVolume.toLocaleString()}</h4>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-xs space-y-2">
                    <span className="font-bold text-slate-300">Total Service Fees Earned: ₹{adminStats.totalFees.toLocaleString()}</span>
                    <p className="text-slate-400">All fees collected via server-side Dynamic Commission Engine.</p>
                  </div>
                </div>
              )}

              {/* TAB 2: KYC Queue */}
              {activeAdminTab === 'kyc_queue' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white font-['Outfit']">Identity Verification Review Queue</h3>

                  <div className="space-y-3">
                    {adminKycQueue.map((k) => (
                      <div key={k.id} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white">{k.userName}</span>
                            <span className="text-[11px] text-slate-400 block">{k.userPhone} • {k.documentType}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            k.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                            k.status === 'IN_REVIEW' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {k.status}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono">
                          Provider Ref: {k.providerReference} • Submitted: {new Date(k.submittedAt).toLocaleTimeString()}
                        </div>

                        {k.status !== 'VERIFIED' && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => approveKycAction(k.id, 'APPROVE')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Approve KYC ✓
                            </button>
                            <button
                              onClick={() => approveKycAction(k.id, 'REJECT', 'Document blurry or unreadable')}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => approveKycAction(k.id, 'RETRY', 'Please re-upload front ID')}
                              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Request Retry
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Pricing & Commission Rules */}
              {activeAdminTab === 'pricing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-['Outfit']">Dynamic Commission Pricing Engine</h3>
                      <p className="text-[11px] text-slate-400">Configure real-time service fee calculations per country & rail.</p>
                    </div>
                  </div>

                  {pricingSuccessMsg && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-bold">
                      {pricingSuccessMsg}
                    </div>
                  )}

                  <div className="space-y-3">
                    {adminCommissionRules.map((rule) => {
                      const isEditing = editingRuleId === rule.id;

                      return (
                        <div key={rule.id} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white">{rule.name}</h4>
                              <span className="text-[10px] text-slate-400">Country: {rule.countryId.toUpperCase()} • Currency: {rule.currency}</span>
                            </div>
                            <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                              Base: {rule.currency} {rule.baseFee} + {rule.percentageFee}%
                            </span>
                          </div>

                          {isEditing ? (
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Base Fee ({rule.currency})</label>
                                <input 
                                  type="number"
                                  value={editBaseFee}
                                  onChange={(e) => setEditBaseFee(Number(e.target.value))}
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Percentage Fee (%)</label>
                                <input 
                                  type="number"
                                  step="0.1"
                                  value={editPercentageFee}
                                  onChange={(e) => setEditPercentageFee(Number(e.target.value))}
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Tax Rate (%)</label>
                                <input 
                                  type="number"
                                  value={editTaxRate}
                                  onChange={(e) => setEditTaxRate(Number(e.target.value))}
                                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded-lg text-xs text-white"
                                />
                              </div>

                              <div className="col-span-3 flex gap-2 pt-2">
                                <button
                                  onClick={() => handleSavePricing(rule.id)}
                                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Save & Deploy Rule
                                </button>
                                <button
                                  onClick={() => setEditingRuleId(null)}
                                  className="px-3 py-1.5 bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingRuleId(rule.id);
                                setEditBaseFee(rule.baseFee);
                                setEditPercentageFee(rule.percentageFee);
                                setEditTaxRate(rule.taxRatePercent);
                              }}
                              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Configure Pricing Parameters
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: Audit Logs */}
              {activeAdminTab === 'audit' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white font-['Outfit']">Immutable Compliance Audit Logs</h3>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {adminAuditLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                          <span>{log.action}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-slate-200">{log.details}</p>
                        <span className="text-[10px] text-blue-400 font-bold block">{log.adminName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
