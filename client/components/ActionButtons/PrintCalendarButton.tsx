import React from 'react';
import { Printer } from 'lucide-react';

interface PrintCalendarButtonProps {
  onClick?: () => void;
  className?: string;
}

export const PrintCalendarButton: React.FC<PrintCalendarButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      title="Print Calendar"
      className={`flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm ${className}`}
    >
      <Printer size={18} />
    </button>
  );
};
