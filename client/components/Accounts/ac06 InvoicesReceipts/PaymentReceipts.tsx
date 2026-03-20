import React from 'react';
import { Download, Printer, Filter, Search, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const PaymentReceipts: React.FC = () => { 
  const { paymentReceipts } = useFinanceData();
  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Payment Receipts</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search receipt, booking ID..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={20} />
              <span className="hidden sm:inline">Filter</span>
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
            <label className="text-sm font-medium text-gray-600">Payment Mode:</label>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Modes</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>Cheque</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Receipt No.</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment Mode</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Reference No.</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paymentReceipts.map(rec => (
                <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{rec.id}</td>
                  <td className="px-6 py-4 text-gray-500">{rec.date}</td>
                  <td className="px-6 py-4 text-gray-500">{rec.bookingId}</td>
                  <td className="px-6 py-4 text-gray-900">{rec.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{rec.paymentMode}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">{formatCurrency(rec.amount)}</td>
                  <td className="px-6 py-4 text-gray-500">{rec.referenceNumber}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors" title="Download Receipt">
                        <Download size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors" title="Print">
                        <Printer size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Share on WhatsApp">
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
