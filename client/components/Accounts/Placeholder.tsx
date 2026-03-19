import React from 'react';
import { FileText } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="p-6 bg-gray-50 rounded-full text-gray-400">
        <FileText size={48} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 max-w-sm mt-2">This module is currently under development. You will soon be able to manage {title.toLowerCase()} here.</p>
      </div>
    </div>
  );
};
