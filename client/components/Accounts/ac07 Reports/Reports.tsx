import React, { useState } from 'react';
import { RevenueReport } from './RevenueReport';
import { ExpenseReport } from './ExpenseReport';
import { ProfitLossReport } from './ProfitLossReport';
import { VendorPaymentReport } from './VendorPaymentReport';
import { CustomerOutstandingReport } from './CustomerOutstandingReport';
import { PaymentModeReport } from './PaymentModeReport';
import { MonthlySummary } from './MonthlySummary';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('revenue');

  const tabs = [
    { id: 'revenue', label: 'Revenue Report' },
    { id: 'expense', label: 'Expense Report' },
    { id: 'profit-loss', label: 'Profit & Loss' },
    { id: 'vendor-payment', label: 'Vendor Payment' },
    { id: 'customer-outstanding', label: 'Customer Outstanding' },
    { id: 'payment-mode', label: 'Payment Mode' },
    { id: 'monthly-summary', label: 'Monthly Summary' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'revenue' && <RevenueReport />}
        {activeTab === 'expense' && <ExpenseReport />}
        {activeTab === 'profit-loss' && <ProfitLossReport />}
        {activeTab === 'vendor-payment' && <VendorPaymentReport />}
        {activeTab === 'customer-outstanding' && <CustomerOutstandingReport />}
        {activeTab === 'payment-mode' && <PaymentModeReport />}
        {activeTab === 'monthly-summary' && <MonthlySummary />}
      </div>
    </div>
  );
};
