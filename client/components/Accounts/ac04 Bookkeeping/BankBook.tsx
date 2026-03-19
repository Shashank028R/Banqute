import React from 'react';
import { Download, Printer, Filter, Search, TrendingUp, TrendingDown, Building2, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { bankBookTransactions, bankBookSummary } from './mockData';

export const BankBook: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Opening Bank Balance</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(bankBookSummary.openingBalance)}</h3>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
            <Building2 size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Bank Deposits</p>
            <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(bankBookSummary.totalDeposits)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Bank Withdrawals</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(bankBookSummary.totalWithdrawals)}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Closing Balance</p>
            <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(bankBookSummary.closingBalance)}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Bank Transactions</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
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
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer size={20} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Date Range:</label>
            <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
            <span className="text-gray-400">-</span>
            <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Bank Account:</label>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Accounts</option>
              <option>HDFC Bank - 1234</option>
              <option>SBI - 5678</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Type:</label>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Bank Account</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer / Vendor</th>
                <th className="px-6 py-4 text-right">Debit (In)</th>
                <th className="px-6 py-4 text-right">Credit (Out)</th>
                <th className="px-6 py-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {bankBookTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{tx.id}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.bankAccount}</td>
                  <td className="px-6 py-4 text-gray-900">{tx.description}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.bookingId || '-'}</td>
                  <td className="px-6 py-4 text-gray-900">{tx.customerVendor}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">
                    {tx.debit > 0 ? formatCurrency(tx.debit) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-red-600">
                    {tx.credit > 0 ? formatCurrency(tx.credit) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(tx.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
