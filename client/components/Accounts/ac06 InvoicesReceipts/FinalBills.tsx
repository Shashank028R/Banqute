import React from 'react';
import { Download, Printer, Filter, Search, Eye, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { finalBills } from './mockData';

export const FinalBills: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Final Bills</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search bill, booking ID..." 
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
            <label className="text-sm font-medium text-gray-600">Event Date Range:</label>
            <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
            <span className="text-gray-400">-</span>
            <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Status:</label>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Bill No.</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Event Date</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {finalBills.map(bill => (
                <tr key={bill.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{bill.id}</td>
                  <td className="px-6 py-4 text-gray-500">{bill.bookingId}</td>
                  <td className="px-6 py-4 text-gray-900">{bill.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{bill.eventDate}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(bill.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="View Bill">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors" title="Download PDF">
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
