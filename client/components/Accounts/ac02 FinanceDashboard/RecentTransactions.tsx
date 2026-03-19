import React from 'react';
import { formatCurrency } from '../../../lib/utils';
import { recentTransactions } from './mockData';

export const RecentTransactions: React.FC = () => {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button className="text-sm font-medium text-pink-600 hover:text-pink-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Booking / Particulars</th>
              <th className="px-6 py-4">Mode</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {recentTransactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    tx.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{tx.booking}</td>
                <td className="px-6 py-4 text-gray-500">{tx.mode}</td>
                <td className={`px-6 py-4 text-right font-bold ${
                  tx.status === 'success' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {tx.status === 'success' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
