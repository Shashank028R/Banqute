import React from 'react';
import { Wallet } from 'lucide-react';

interface PaymentButtonProps {
  onClick?: () => void;
  isNight?: boolean;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ onClick, isNight, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      title="Record Payment"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow-sm active:scale-95 group ${
        isNight 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } ${className}`}
    >
      <Wallet size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black mt-1 uppercase text-slate-500">Payment</span>
    </button>
  );
};
