import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { expenseTransactions } from './mockData';
import { TransactionSummary } from './TransactionSummary';
import { AddExpenseModal } from './AddExpenseModal';

export const Expenses: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'General' | 'Booking'>('General');

  const filteredTransactions = expenseTransactions.filter(tx => tx.expenseType === activeTab);

  return (
    <div className="space-y-6 pb-8">
      <TransactionSummary />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Expense Transactions</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('General')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'General' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('Booking')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'Booking' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Booking Related
              </button>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction ID</th>
                {activeTab === 'Booking' && <th className="px-6 py-4">Booking ID</th>}
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Payment Mode</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{tx.id}</td>
                  {activeTab === 'Booking' && <td className="px-6 py-4 text-gray-500">{tx.bookingId}</td>}
                  <td className="px-6 py-4 text-gray-900">{tx.vendor}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.category}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.paymentMode}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-600">-{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.account}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No {activeTab.toLowerCase()} expenses found.
            </div>
          )}
        </div>
      </div>

      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
