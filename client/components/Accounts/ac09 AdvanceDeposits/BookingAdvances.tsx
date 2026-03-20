import React from 'react';
import { Download, Printer, Filter, Search, Plus, IndianRupee, Calendar, Users } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const BookingAdvances: React.FC = () => { 
  const { bookingAdvances, bookingAdvancesSummary } = useFinanceData();
  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Advances Received</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(bookingAdvancesSummary.totalAdvancesReceived)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <IndianRupee size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Advances Received This Month</p>
            <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(bookingAdvancesSummary.advancesReceivedThisMonth)}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Number of Advance Bookings</p>
            <h3 className="text-2xl font-bold text-purple-600">{bookingAdvancesSummary.numberOfAdvanceBookings}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Booking Advances</h2>
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
              <Filter size={20} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={20} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
              <Plus size={20} />
              <span className="hidden sm:inline">Add Entry</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Event Date</th>
                <th className="px-6 py-4 text-right">Advance Amount</th>
                <th className="px-6 py-4">Payment Mode</th>
                <th className="px-6 py-4">Ref Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {bookingAdvances.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.bookingId}</td>
                  <td className="px-6 py-4 text-gray-900">{item.customerName}</td>
                  <td className="px-6 py-4 text-gray-500">{item.eventDate}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">{formatCurrency(item.advanceAmount)}</td>
                  <td className="px-6 py-4 text-gray-500">{item.paymentMode}</td>
                  <td className="px-6 py-4 text-gray-500">{item.referenceNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Advance Received' ? 'bg-emerald-50 text-emerald-700' :
                      item.status === 'Partially Paid' ? 'bg-blue-50 text-blue-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">Receipt</button>
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
