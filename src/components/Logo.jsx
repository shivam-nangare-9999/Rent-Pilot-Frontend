import React from 'react';
import { Building2 } from 'lucide-react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} bg-[#1e3a5f] text-white rounded-xl flex items-center justify-center shadow-md shadow-[#1e3a5f]/20 shrink-0`}
      >
        <Building2 className={iconSizes[size] || iconSizes.md} />
      </div>

      {showText && (
        <div className="leading-none">
          <h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
            Rent<span className="text-[#1e3a5f]">Pilot</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Property Dashboard
          </p>
        </div>
      )}
    </div>
  );
}