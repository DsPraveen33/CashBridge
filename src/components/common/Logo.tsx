import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'light', showTagline = false }) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', sub: 'text-sm' },
  }[size];

  const textColor = variant === 'white' ? 'text-white' : 'text-slate-900';
  const subColor = variant === 'white' ? 'text-blue-100' : 'text-slate-500';

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Brand Icon */}
      <div className={`relative ${sizeClasses.icon} flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-1.5 shadow-md shadow-blue-500/20 flex items-center justify-center`}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Bridge Arch */}
          <path 
            d="M5 26 C12 11, 24 11, 31 26" 
            stroke="#ffffff" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
          />
          {/* Vertical Exchange Cables */}
          <path d="M11 26 L11 19" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 26 L18 15" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M25 26 L25 19" stroke="#34D399" strokeWidth="2.4" strokeLinecap="round" />
          {/* Center Connection Node */}
          <circle cx="18" cy="9" r="2.8" fill="#34D399" />
          {/* Peer Nodes */}
          <circle cx="9" cy="17" r="1.8" fill="#FFFFFF" />
          <circle cx="27" cy="17" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>

      <div>
        <div className={`font-extrabold tracking-tight font-['Space_Grotesk'] leading-none ${sizeClasses.text} ${textColor}`}>
          Cash<span className="text-emerald-500">Bridge</span>
        </div>
        {showTagline && (
          <p className={`${sizeClasses.sub} ${subColor} font-medium mt-0.5 tracking-tight`}>
            Cash when you need it. UPI when you need it.
          </p>
        )}
      </div>
    </div>
  );
};
