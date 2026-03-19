import React, { useState } from 'react';
import { CompanyAccount } from './CompanyAccount';
import { OwnerAccount } from './OwnerAccount';
import { InternalTransfers } from './InternalTransfers';

export const OwnerCompanyAccounts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'owner' | 'transfers'>('company');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'company'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Company Account
        </button>
        <button
          onClick={() => setActiveTab('owner')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'owner'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Owner Account
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'transfers'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Internal Transfers
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'company' && <CompanyAccount />}
        {activeTab === 'owner' && <OwnerAccount />}
        {activeTab === 'transfers' && <InternalTransfers />}
      </div>
    </div>
  );
};
