import React from 'react';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const TransactionSummary: React.FC = () => { 
  const { summaryData } = useFinanceData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Income Today</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData.totalIncomeToday)}</h3>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <TrendingUp size={24} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Expenses Today</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData.totalExpensesToday)}</h3>
        </div>
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          <TrendingDown size={24} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Net Balance Today</p>
          <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData.netBalanceToday)}</h3>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <IndianRupee size={24} />
        </div>
      </div>
    </div>
  );
};
