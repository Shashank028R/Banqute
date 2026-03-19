import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, Clock } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';

export const FinancialKPIs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* 1. Total Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(4500000)}</h3>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">This Month</span><span className="font-medium text-gray-900">{formatCurrency(800000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Today</span><span className="font-medium text-gray-900">{formatCurrency(50000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">From Bookings</span><span className="font-medium text-gray-900">{formatCurrency(3800000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">From Add-ons</span><span className="font-medium text-gray-900">{formatCurrency(700000)}</span></div>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(2200000)}</h3>
          </div>
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">This Month</span><span className="font-medium text-gray-900">{formatCurrency(450000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Today</span><span className="font-medium text-gray-900">{formatCurrency(15000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Vendor Expenses</span><span className="font-medium text-gray-900">{formatCurrency(1500000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Operational</span><span className="font-medium text-gray-900">{formatCurrency(700000)}</span></div>
        </div>
      </div>

      {/* 3. Net Profit */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Net Profit</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(2300000)}</h3>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">This Month</span><span className="font-medium text-emerald-600">+{formatCurrency(350000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Today</span><span className="font-medium text-emerald-600">+{formatCurrency(35000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Margin</span><span className="font-medium text-gray-900">51.1%</span></div>
        </div>
      </div>

      {/* 4. Pending Payments */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Payments</p>
            <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(540000)}</h3>
          </div>
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Clock size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">This Month</span><span className="font-medium text-gray-900">{formatCurrency(120000)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Bookings Pending</span><span className="font-medium text-gray-900">12</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Overdue</span><span className="font-medium text-red-600">{formatCurrency(45000)}</span></div>
        </div>
      </div>
    </div>
  );
};
