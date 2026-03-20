import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee, Clock } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const FinancialKPIs: React.FC = () => {
  const { totalRevenue, summaryData } = useFinanceData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* 1. Total Revenue */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue || 0)}</h3>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">Today's Income</span><span className="font-medium text-gray-900">{formatCurrency(summaryData?.totalIncomeToday || 0)}</span></div>
        </div>
      </div>

      {/* 2. Total Expenses */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Today's Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData?.totalExpensesToday || 0)}</h3>
          </div>
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
           <div className="flex justify-between"><span className="text-gray-500">From Cash/Bank</span><span className="font-medium text-gray-900">Functional</span></div>
        </div>
      </div>

      {/* 3. Net Profit */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Net Booking Value</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue || 0)}</h3>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <IndianRupee size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">Net Flow Today</span><span className="font-medium text-emerald-600">{formatCurrency(summaryData?.netBalanceToday || 0)}</span></div>
        </div>
      </div>

      {/* 4. Pending Payments */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Action Center</p>
            <h3 className="text-xl font-bold text-orange-600">Active Monitoring</h3>
          </div>
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <Clock size={20} />
          </div>
        </div>
        <div className="space-y-2 text-sm mt-auto pt-4 border-t border-gray-50">
          <div className="flex justify-between"><span className="text-gray-500">Live API</span><span className="font-medium text-emerald-600">Connected</span></div>
        </div>
      </div>
    </div>
  );
};
