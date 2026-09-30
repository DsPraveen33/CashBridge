import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// 7. Identity Verification (KYC Start)
export const Screen07KycStart: React.FC = () => {
  const { navigateTo, startKycSession, goBack } = useApp();

  const handleStart = async () => {
    await startKycSession();
    navigateTo('8_upload_id');
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 mb-2">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-2">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-lg font-black text-center text-slate-900 font-['Outfit']">Identity Verification (KYC)</h2>
        <p className="text-[11px] text-center text-slate-500 mt-0.5 max-w-[260px] mx-auto">
          To keep CashBridge safe and compliant, we verify every user via licensed identity providers.
        </p>

        <div className="my-5 space-y-3">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Government ID Check</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Aadhaar, Passport, or Driving License</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Live 3D Face Liveness</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Biometric fraud prevention check</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Compliance Provider Review</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Encrypted tokenized verification</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-2">
        <button
          onClick={handleStart}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>Start Verification Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[10px] text-slate-400">
          🔒 Your documents are tokenized and encrypted by licensed compliance providers.
        </p>
      </div>
    </div>
  );
};

// 8. Upload Your ID Screen
export const Screen08UploadId: React.FC = () => {
  const { navigateTo, selectedIdDocType, setSelectedIdDocType, goBack } = useApp();
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center justify-between mb-2">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-blue-600">Identity Provider Portal</span>
        </div>

        <h2 className="text-lg font-black text-slate-900 font-['Outfit']">Upload Government ID</h2>
        <p className="text-[11px] text-slate-500 mt-0.5">Choose document type</p>

        <div className="relative mt-3 mb-4">
          <select
            value={selectedIdDocType}
            onChange={(e) => setSelectedIdDocType(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
          >
            <option>Aadhaar Card (India)</option>
            <option>Passport (International)</option>
            <option>Driving License</option>
            <option>National Identity Card</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
        </div>

        <div className="border-2 border-dashed border-blue-300 bg-blue-50/40 rounded-2xl p-6 text-center flex flex-col items-center justify-center my-3 cursor-pointer hover:bg-blue-50/70 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800">Upload {activeSide === 'front' ? 'Front Side' : 'Back Side'}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">High-resolution document capture</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeSide === 'front' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Front Side</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeSide === 'back' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Back Side</span>
          </button>
        </div>
      </div>

      <div className="pb-2">
        <button
          onClick={() => navigateTo('9_selfie_verify')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>Proceed to Face Liveness</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 9. Selfie Verification Screen
export const Screen09SelfieVerify: React.FC = () => {
  const { navigateTo, submitKycDocuments, goBack } = useApp();
  const [loading, setLoading] = useState(false);

  const handleCaptureAndSubmit = async () => {
    setLoading(true);
    try {
      await submitKycDocuments();
      navigateTo('11_kyc_verified');
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

        <h2 className="text-lg font-black text-center text-slate-900 font-['Outfit']">Selfie Liveness Verification</h2>
        <p className="text-[11px] text-center text-slate-500 mt-0.5">
          Look at the camera and follow the instructions.
        </p>

        <div className="my-5 flex justify-center">
          <div className="relative w-44 h-52 rounded-[80px] border-4 border-blue-500 bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner">
            <div className="w-28 h-36 rounded-[60px] border-2 border-dashed border-blue-400/80 flex flex-col items-center justify-center text-slate-400">
              <UserCheck className="w-12 h-12 text-blue-500 mb-1" />
              <span className="text-[10px] font-bold text-blue-600">3D Biometric Frame</span>
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          </div>
        </div>

        <div className="space-y-1.5 px-3">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Position your face in the oval frame</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Ensure good neutral lighting</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Anti-spoofing liveness verified</span>
          </div>
        </div>
      </div>

      <div className="pb-2">
        <button
          onClick={handleCaptureAndSubmit}
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] disabled:opacity-50"
        >
          <span>{loading ? 'Submitting to Compliance Provider...' : 'Submit Real Verification'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 11. KYC Status Screen
export const Screen11KycVerified: React.FC = () => {
  const { navigateTo, kycStatus } = useApp();

  const isVerified = kycStatus === 'VERIFIED';
  const isInReview = kycStatus === 'IN_REVIEW' || kycStatus === 'PENDING';

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-white text-slate-900 select-none text-center overflow-y-auto">
      <div></div>

      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 ${
            isVerified ? 'bg-emerald-100 border-emerald-500 shadow-emerald-500/20' : 'bg-amber-100 border-amber-500 shadow-amber-500/20'
          }`}>
            {isVerified ? (
              <CheckCircle2 className="w-14 h-14 text-emerald-600 stroke-[2.5]" />
            ) : (
              <Clock className="w-12 h-12 text-amber-600 animate-spin" />
            )}
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs shadow">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 font-['Outfit']">
          {isVerified ? 'Account Verified!' : 'Verification in Review'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
          {isVerified 
            ? 'Your CashBridge account is fully verified for P2P digital ↔ cash exchange.' 
            : 'Your documents have been submitted to the compliance queue for verification.'}
        </p>

        <div className="mt-6 w-full max-w-[280px] bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-left">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className={`w-4 h-4 ${isVerified ? 'text-emerald-600' : 'text-amber-500'} flex-shrink-0`} />
            <span>Document Check: {isVerified ? 'Passed' : 'Processing Webhook'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className={`w-4 h-4 ${isVerified ? 'text-emerald-600' : 'text-amber-500'} flex-shrink-0`} />
            <span>3D Biometric Match: {isVerified ? 'Matched' : 'In Review'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Status in DB: {kycStatus}</span>
          </div>
        </div>
      </div>

      <div className="pb-2">
        <button
          onClick={() => navigateTo('12_home')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>Continue to App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
