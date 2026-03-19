import React, { useState } from 'react';
import { BookingInvoices } from './BookingInvoices';
import { PaymentReceipts } from './PaymentReceipts';
import { FinalBills } from './FinalBills';

export const InvoicesReceipts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'receipts' | 'bills'>('invoices');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'invoices'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Booking Invoices
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'receipts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Payment Receipts
        </button>
        <button
          onClick={() => setActiveTab('bills')}
          className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            activeTab === 'bills'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Final Bills
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'invoices' && <BookingInvoices />}
        {activeTab === 'receipts' && <PaymentReceipts />}
        {activeTab === 'bills' && <FinalBills />}
      </div>
    </div>
  );
};
