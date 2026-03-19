import React from 'react';
import { Eye } from 'lucide-react';

interface ViewButtonProps {
  onClick?: () => void;
  isNight?: boolean;
  className?: string;
}

export const ViewButton: React.FC<ViewButtonProps> = ({ onClick, isNight, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      title="View Details"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all shadow-sm active:scale-95 group ${
        isNight 
          ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' 
          : 'bg-white border-gray-100 hover:bg-gray-50'
      } ${className}`}
    >
      <Eye size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black mt-1 uppercase text-slate-500">View</span>
    </button>
  );
};
