import React from 'react';
import { Wallet, Building2, ArrowDownRight, CheckCircle2, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const CashAndStatus: React.FC = () => {
  const { 
    cashInHand, bankBalance, totalAvailable, 
    dueThisWeek, dueThisWeekCount, dueThisMonth, dueThisMonthCount, upcomingBalances,
    totalBookings, fullyPaidBookings, partiallyPaidBookings, unpaidBookings 
  } = useFinanceData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cash Position */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Wallet className="mr-2 text-gray-400" size={20} /> Cash Position
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><IndianRupee size={16} className="text-gray-600" /></div>
              <span className="font-medium text-gray-700">Cash in Hand</span>
            </div>
            <span className="font-bold">{formatCurrency(cashInHand || 0)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><Building2 size={16} className="text-gray-600" /></div>
              <span className="font-medium text-gray-700">Bank Balance</span>
            </div>
            <span className="font-bold">{formatCurrency(bankBalance || 0)}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="font-bold text-blue-800">Total Available</span>
            <span className="font-bold text-blue-800 text-lg">{formatCurrency(totalAvailable || 0)}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <ArrowDownRight className="mr-2 text-emerald-500" size={20} /> Upcoming Receivables
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div>
              <p className="text-sm text-gray-500">Due This Week</p>
              <p className="font-bold text-gray-900">{formatCurrency(dueThisWeek || 0)}</p>
            </div>
            <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">{dueThisWeekCount} Bookings</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <div>
              <p className="text-sm text-gray-500">Due This Month</p>
              <p className="font-bold text-gray-900">{formatCurrency(dueThisMonth || 0)}</p>
            </div>
            <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">{dueThisMonthCount} Bookings</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Upcoming Balances</p>
              <p className="font-bold text-gray-900">{formatCurrency(upcomingBalances || 0)}</p>
            </div>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Future</span>
          </div>
        </div>
      </div>

      {/* Booking Status */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle2 className="mr-2 text-blue-500" size={20} /> Booking Revenue Status
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Bookings</span>
            <span className="font-bold text-gray-900">{totalBookings}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: totalBookings > 0 ? `${(fullyPaidBookings/totalBookings)*100}%` : '0%' }}></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> Fully Paid</span>
            <span className="font-bold text-gray-900">{fullyPaidBookings}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> Partially Paid</span>
            <span className="font-bold text-gray-900">{partiallyPaidBookings}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Unpaid (Just Booked)</span>
            <span className="font-bold text-gray-900">{unpaidBookings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
