import React from 'react';
import { Printer } from 'lucide-react';

interface PrintInvoiceButtonProps {
  onClick?: () => void;
  isNight?: boolean;
  className?: string;
}

export const PrintInvoiceButton: React.FC<PrintInvoiceButtonProps> = ({ onClick, isNight, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      title="Print Invoice"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow-sm active:scale-95 group ${
        isNight 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } ${className}`}
    >
      <Printer size={18} className="text-slate-400 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black mt-1 uppercase text-slate-500">Print</span>
    </button>
  );
};
