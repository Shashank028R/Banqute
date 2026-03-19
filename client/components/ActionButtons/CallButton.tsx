import React from 'react';
import { Phone } from 'lucide-react';

interface CallButtonProps {
  phone: string;
  isNight?: boolean;
  className?: string;
}

export const CallButton: React.FC<CallButtonProps> = ({ phone, isNight, className = "" }) => {
  return (
    <a 
      href={`tel:${phone}`}
      title="Call Customer"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow-sm active:scale-95 group ${
        isNight 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } ${className}`}
    >
      <Phone size={18} className="text-amber-600 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black mt-1 uppercase text-slate-500">Call</span>
    </a>
  );
};
