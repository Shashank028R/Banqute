import React from 'react';
import { Download, Printer, Filter, Search, Users, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const CustomerOutstandingReport: React.FC = () => { 
  const { customerOutstandingData } = useFinanceData();
  const totalOutstanding = customerOutstandingData.reduce((sum, item) => sum + item.balanceDue, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Outstanding</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Customers with Dues</p>
            <h3 className="text-2xl font-bold text-blue-600">{customerOutstandingData.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Customer Outstanding Report</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search customer, booking ID..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Event Date</th>
                <th className="px-6 py-4 text-right">Total Amount</th>
                <th className="px-6 py-4 text-right">Amount Paid</th>
                <th className="px-6 py-4 text-right">Balance Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {customerOutstandingData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{item.bookingId}</td>
                  <td className="px-6 py-4 text-gray-500">{item.eventDate}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(item.totalAmount)}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">{formatCurrency(item.amountPaid)}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-600">{formatCurrency(item.balanceDue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
