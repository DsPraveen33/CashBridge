import React, { useState } from 'react';
import { ShieldCheck, MapPin, Navigation, Check, User } from 'lucide-react';
import { PeerUser, MeetingPoint } from '../../types';
import { MEETING_POINTS } from '../../data/mockData';

interface RadarMapProps {
  peers: PeerUser[];
  selectedPeer: PeerUser | null;
  onSelectPeer: (peer: PeerUser) => void;
  radiusText?: string;
  count?: number;
}

export const RadarMap: React.FC<RadarMapProps> = ({ 
  peers, 
  selectedPeer, 
  onSelectPeer,
  radiusText = '500 m',
  count = 18 
}) => {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Approximate relative offsets for radar circles (polar to Cartesian)
  const pinOffsets = [
    { top: '35%', left: '38%', peerIdx: 0 }, // Rahul (120m)
    { top: '22%', left: '68%', peerIdx: 1 }, // Sneha (250m)
    { top: '68%', left: '72%', peerIdx: 2 }, // Vikram (400m)
    { top: '74%', left: '26%', peerIdx: 3 }, // Pooja (550m)
    { top: '15%', left: '28%', peerIdx: 4 }, // Amit (750m)
  ];

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-3xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center select-none">
      {/* Background Map Graphic Styling */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Grid Lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[1px] bg-blue-500/10"></div>
        <div className="h-full w-[1px] bg-blue-500/10 absolute"></div>
      </div>

      {/* Radar Concentric Rings */}
      <div className="absolute w-56 h-56 rounded-full border border-blue-500/20 animate-[spin_24s_linear_infinite]"></div>
      <div className="absolute w-44 h-44 rounded-full border border-blue-400/25"></div>
      <div className="absolute w-32 h-32 rounded-full border border-blue-400/35"></div>
      <div className="absolute w-16 h-16 rounded-full border border-emerald-400/40 bg-emerald-500/5"></div>

      {/* Sweeping Radar Beam */}
      <div className="absolute w-56 h-56 rounded-full overflow-hidden pointer-events-none">
        <div className="w-1/2 h-1/2 bg-gradient-to-br from-emerald-400/25 to-transparent origin-bottom-right animate-[spin_4s_linear_infinite]"></div>
      </div>

      {/* Center User Pin (You) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <User className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          </span>
        </div>
        <div className="mt-1 px-2 py-0.5 bg-slate-900/90 backdrop-blur-md rounded-md border border-slate-700 text-[9px] font-bold text-slate-200">
          You (Campus)
        </div>
      </div>

      {/* Center Radius Badge */}
      <div className="absolute top-2 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-[11px] font-bold text-white">{count} People near you</span>
      </div>

      <div className="absolute top-2 right-3 bg-blue-900/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-blue-700 text-[10px] font-semibold text-blue-200">
        ~ {radiusText}
      </div>

      {/* Verified Meeting Point Pin */}
      <div className="absolute top-[30%] right-[15%] z-10 group">
        <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 text-[9px] text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
          Safe Spot: Main Gate
        </div>
      </div>

      {/* Peer Pins on Map */}
      {pinOffsets.map((pin, index) => {
        const peer = peers[pin.peerIdx];
        if (!peer) return null;
        const isSelected = selectedPeer?.id === peer.id;

        return (
          <div
            key={peer.id}
            style={{ top: pin.top, left: pin.left }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
            onClick={() => onSelectPeer(peer)}
            onMouseEnter={() => setHoveredPin(peer.id)}
            onMouseLeave={() => setHoveredPin(null)}
          >
            <div className="relative">
              <div 
                className={`w-9 h-9 rounded-full p-0.5 transition-all ${
                  isSelected 
                    ? 'ring-4 ring-emerald-400 scale-110 shadow-lg shadow-emerald-500/50 bg-emerald-500' 
                    : 'bg-white shadow-md hover:ring-2 hover:ring-blue-400'
                }`}
              >
                <img 
                  src={peer.avatar} 
                  alt={peer.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 ring-1 ring-slate-900">
                <Check className="w-2 h-2 stroke-[3]" />
              </div>

              {/* Amount Tag */}
              <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-black tracking-tight whitespace-nowrap shadow-sm ${
                peer.provides === 'cash' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                ₹{peer.availableAmount}
              </div>

              {/* Tooltip on hover/select */}
              {(isSelected || hoveredPin === peer.id) && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950/95 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold flex items-center gap-1">
                    {peer.name}
                    <span className="text-amber-400 font-semibold">★ {peer.rating}</span>
                  </div>
                  <div className="text-slate-400 text-[9px] flex items-center gap-1.5 mt-0.5">
                    <span>{peer.distanceMeters} m away</span>
                    <span>•</span>
                    <span className="text-emerald-400">Has {peer.provides.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
