import React from 'react';
import { Receipt } from 'lucide-react';

interface ExpensesButtonProps {
  onClick?: () => void;
  isNight?: boolean;
  className?: string;
}

export const ExpensesButton: React.FC<ExpensesButtonProps> = ({ onClick, isNight, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      title="Add Expenses"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow-sm active:scale-95 group ${
        isNight 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } ${className}`}
    >
      <Receipt size={18} className="text-rose-400 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black mt-1 uppercase text-slate-500">Expenses</span>
    </button>
  );
};
