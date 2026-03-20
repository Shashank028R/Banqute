import React from 'react';
import { Download, Printer, Filter, Search, IndianRupee, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { useFinanceData } from '../hooks/useFinanceData';

export const ProfitLossReport: React.FC = () => { 
  const { profitLossData } = useFinanceData();
  const totalRevenue = profitLossData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = profitLossData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <TrendingDown size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Net Profit</p>
            <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(netProfit)}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Profit & Loss Report</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
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
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4 text-right">Revenue</th>
                <th className="px-6 py-4 text-right">Expenses</th>
                <th className="px-6 py-4 text-right">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {profitLossData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.month}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">{formatCurrency(item.revenue)}</td>
                  <td className="px-6 py-4 text-right font-medium text-red-600">{formatCurrency(item.expenses)}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">{formatCurrency(item.profit)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold text-gray-900">
              <tr>
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4 text-right text-emerald-600">{formatCurrency(totalRevenue)}</td>
                <td className="px-6 py-4 text-right text-red-600">{formatCurrency(totalExpenses)}</td>
                <td className="px-6 py-4 text-right text-blue-600">{formatCurrency(netProfit)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
