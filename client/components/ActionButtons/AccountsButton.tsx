import React from 'react';
import { FileText } from 'lucide-react';

interface AccountsButtonProps {
  onClick?: () => void;
  isNight?: boolean;
  className?: string;
}

export const AccountsButton: React.FC<AccountsButtonProps> = ({ onClick, isNight, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      title="Accounts View"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow-sm active:scale-95 group ${
        isNight 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } ${className}`}
    >
      <FileText size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black mt-1 uppercase text-slate-500">Accounts</span>
    </button>
  );
};
