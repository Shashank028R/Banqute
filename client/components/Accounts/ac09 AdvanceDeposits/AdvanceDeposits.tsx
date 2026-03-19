import React, { useState } from 'react';
import { BookingAdvances } from './BookingAdvances';
import { SecurityDeposits } from './SecurityDeposits';

export const AdvanceDeposits: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'advances' | 'deposits'>('advances');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('advances')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'advances'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Booking Advances
        </button>
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'deposits'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Security Deposits
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'advances' && <BookingAdvances />}
        {activeTab === 'deposits' && <SecurityDeposits />}
      </div>
    </div>
  );
};
