import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Check, 
  Star, 
  Copy, 
  ExternalLink, 
  AlertTriangle,
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Building2,
  Navigation,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MEETING_POINTS } from '../../data/mockData';

// 17. Exchange Details Screen
export const Screen17ExchangeDetails: React.FC = () => {
  const { navigateTo, goBack, activeTransaction, selectedPeer, activeFeeQuote, selectedCountry } = useApp();
  const [copied, setCopied] = useState(false);

  const amount = activeTransaction?.amount || 2000;
  const code = activeTransaction?.code || 'CB-4821';
  const currentStep = activeTransaction?.timelineStep || 3;
  const currency = selectedCountry?.symbol || '₹';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { num: 1, title: 'Request Sent', desc: `${currency}${amount.toLocaleString()} Digital ↔ Cash` },
    { num: 2, title: 'User Matched', desc: `${selectedPeer.name} (${selectedPeer.distance})` },
    { num: 3, title: 'Both Accepted', desc: `Quote ${activeFeeQuote?.quoteId || 'CQ-LOCKED'}` },
    { num: 4, title: 'Meeting Point', desc: 'Safe public monitored spot' },
    { num: 5, title: 'Exchange', desc: 'Physical & digital transfer' },
    { num: 6, title: 'Verify Payment', desc: 'Bank/App confirmation' },
    { num: 7, title: 'Complete', desc: 'Reputation updated' },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 font-['Outfit']">Exchange Session Details</h2>
        </div>

        {/* Exchange Amount Banner with Server Fee Quote */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-md text-center mb-3">
          <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">Exchange Amount</p>
          <h3 className="text-2xl font-black font-['Space_Grotesk'] my-0.5">{currency} {amount.toLocaleString()}</h3>
          <p className="text-xs font-bold text-emerald-300">
            CashBridge Fee: {currency} {activeFeeQuote ? activeFeeQuote.totalFee : 35} (Locked)
          </p>
        </div>

        {/* 7-Step Vertical Progress Timeline */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 mb-3 space-y-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div key={s.num} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300 animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCompleted ? 'text-slate-800' : isCurrent ? 'text-blue-700 font-black' : 'text-slate-400'
                    }`}
                  >
                    {s.num}. {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{s.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transaction Security Code */}
        <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block">Server Session Code</span>
            <span className="text-xs font-black font-['Space_Grotesk'] text-slate-900">{code}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => navigateTo('18_meeting_point')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>Proceed to Meeting Point</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 18. Safe Meeting Point Screen
export const Screen18MeetingPoint: React.FC = () => {
  const { navigateTo, goBack, selectedMeetingPoint, setSelectedMeetingPoint, confirmMeetingPoint } = useApp();
  const [loading, setLoading] = useState(false);

  const handleConfirmMeeting = async () => {
    setLoading(true);
    try {
      await confirmMeetingPoint();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 font-['Outfit']">Safe Meeting Point</h2>
        </div>

        <div className="bg-slate-900 rounded-2xl p-3.5 text-white relative h-36 flex flex-col justify-between overflow-hidden shadow-md mb-3">
          <div className="flex items-center justify-between text-xs z-10">
            <span className="font-bold flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Verified Public Safe Point
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              {selectedMeetingPoint.distance}
            </span>
          </div>

          <div className="z-10 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 text-left">
            <p className="text-xs font-bold text-white">{selectedMeetingPoint.name}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{selectedMeetingPoint.address}</p>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-ping"></div>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested Public Locations</p>
          {MEETING_POINTS.map((mp) => {
            const isSelected = selectedMeetingPoint.id === mp.id;

            return (
              <button
                key={mp.id}
                onClick={() => setSelectedMeetingPoint(mp)}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{mp.name}</h4>
                    <p className="text-[10px] text-slate-500">{mp.tag} • {mp.distance}</p>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-emerald-700 font-semibold mt-2.5 flex items-center gap-1">
          🛡️ Never meet at a private residence. Always stick to verified public spots.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={handleConfirmMeeting}
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] disabled:opacity-50"
        >
          <span>{loading ? 'Confirming with Server...' : 'Confirm Meeting Point & Chat'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// 19. In-App Chat Screen
export const Screen19InAppChat: React.FC = () => {
  const { navigateTo, goBack, selectedPeer, chatMessages, sendChatMessage, activeTransaction, selectedCountry } = useApp();
  const [inputText, setInputText] = useState('');
  const currency = selectedCountry?.symbol || '₹';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    await sendChatMessage(text);
  };

  const quickChips = ["I'm on my way.", "I've reached the meeting point.", "I'm near the entrance.", "Where are you?"];

  return (
    <div className="h-full flex flex-col justify-between bg-slate-50 text-slate-900 select-none overflow-hidden">
      <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={goBack} className="p-1 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <img src={selectedPeer.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-emerald-500" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
          </div>
          <div>
            <h3 className="text-xs font-black font-['Outfit'] text-slate-900 leading-tight">{selectedPeer.name}</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Online • {currency}{activeTransaction?.amount || 2000}</span>
          </div>
        </div>

        <button 
          onClick={() => navigateTo('20_payment_verify')}
          className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-xl shadow-sm cursor-pointer"
        >
          Verify Payment
        </button>
      </div>

      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {chatMessages.map((msg) => {
          if (msg.isSecurityAlert) {
            return (
              <div key={msg.id} className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 font-medium text-center">
                {msg.text}
              </div>
            );
          }

          const isMe = msg.senderId === 'user';

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto bg-slate-100 border-t border-slate-200">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => sendChatMessage(chip)}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 text-[10px] font-semibold rounded-full flex-shrink-0 cursor-pointer whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

// 20. Exchange / Payment Verification Screen
export const Screen20PaymentVerify: React.FC = () => {
  const { navigateTo, goBack, confirmReceivedPayment, reportPaymentIssue, activeTransaction, selectedCountry } = useApp();
  const [loading, setLoading] = useState(false);
  const amount = activeTransaction?.amount || 2000;
  const currency = selectedCountry?.symbol || '₹';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await confirmReceivedPayment();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white text-slate-900 select-none overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={goBack} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 font-['Outfit']">Payment Verification</h2>
        </div>

        <div className="flex flex-col items-center text-center my-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mb-2 shadow-sm">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h3 className="text-lg font-black font-['Outfit'] text-slate-900">
            Did you receive {currency}{amount.toLocaleString()}?
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify the payment in your official banking or digital payment app before confirming.
          </p>
        </div>

        <div className="my-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
            <p className="text-xs font-semibold text-slate-800">Open your native digital payment app</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
            <p className="text-xs font-semibold text-slate-800">Check the received balance & {currency}{amount.toLocaleString()} transaction</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
            <p className="text-xs font-semibold text-slate-800">Confirm the sender name matches peer credentials</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">4</span>
            <p className="text-xs font-semibold text-slate-800">Confirm on CashBridge to complete state machine</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-1">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{loading ? 'Confirming Transaction...' : `I Received ${currency}${amount.toLocaleString()}`}</span>
        </button>

        <button
          onClick={() => reportPaymentIssue('Payment not received on official app')}
          className="w-full py-2.5 border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>I Didn't Receive Payment (File Dispute)</span>
        </button>
      </div>
    </div>
  );
};

// 21. Success & Final Receipt Screen
export const Screen21SuccessScreen: React.FC = () => {
  const { navigateTo, activeTransaction, activeFeeQuote, selectedCountry } = useApp();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fast Response', 'Punctual']);

  const amount = activeTransaction?.amount || 2000;
  const code = activeTransaction?.code || 'CB-4821';
  const currency = selectedCountry?.symbol || '₹';
  const fee = activeFeeQuote ? activeFeeQuote.totalFee : 35;
  const total = amount + fee;

  const tags = ['Fast Response', 'Punctual', 'Polite', 'Safe Spot', 'Reliable'];

  const toggleTag = (t: string) => {
    if (selectedTags.includes(t)) {
      setSelectedTags(selectedTags.filter(item => item !== t));
    } else {
      setSelectedTags([...selectedTags, t]);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 bg-white text-slate-900 select-none overflow-y-auto text-center">
      <div>
        <div className="flex flex-col items-center mt-2">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/20 border-4 border-emerald-500">
              <Check className="w-10 h-10 text-emerald-600 stroke-[3]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-black font-['Outfit'] text-slate-900">Exchange Completed!</h2>
          <p className="text-base font-black font-['Space_Grotesk'] text-emerald-600 mt-0.5">
            {currency} {amount.toLocaleString()} Cash ↔ Digital
          </p>
        </div>

        {/* ITEMIZED RECEIPT BREAKDOWN */}
        <div className="my-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1.5 text-left">
          <div className="flex justify-between font-bold text-slate-900 pb-1 border-b border-slate-200">
            <span>Transaction Receipt</span>
            <span className="font-mono text-blue-600">{code}</span>
          </div>
          <div className="flex justify-between text-slate-600 text-[11px]">
            <span>Exchange Amount:</span>
            <span className="font-bold text-slate-900 font-mono">{currency} {amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600 text-[11px]">
            <span>CashBridge Service Fee:</span>
            <span className="font-bold text-slate-900 font-mono">{currency} {fee}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
            <span>Total Value:</span>
            <span className="font-mono text-emerald-700">{currency} {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="my-2">
          <p className="text-xs font-bold text-slate-700 mb-1">Rate Peer Exchanger</p>
          <div className="flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 cursor-pointer transform hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 pb-1">
        <button
          onClick={() => navigateTo('12_home')}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
        >
          <span>Finish & Return Home</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
