import React from 'react';
import { Download, Printer, Filter, Search, Store, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import { vendorPaymentData } from './mockData';

export const VendorPaymentReport: React.FC = () => {
  const totalPaid = vendorPaymentData.reduce((sum, item) => sum + item.amountPaid, 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Vendor Payments</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</h3>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
            <IndianRupee size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Vendors</p>
            <h3 className="text-2xl font-bold text-blue-600">{new Set(vendorPaymentData.map(v => v.vendor)).size}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Store size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Vendor Payment Report</h2>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search vendor..." 
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

        {/* Filters Row */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Date Range:</label>
            <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
            <span className="text-gray-400">-</span>
            <input type="date" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Vendor:</label>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Vendors</option>
              <option>Flower Decor</option>
              <option>Royal Caterers</option>
              <option>DJ Soundz</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Category:</label>
            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
              <option>All Categories</option>
              <option>Decoration</option>
              <option>Catering</option>
              <option>Entertainment</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount Paid</th>
                <th className="px-6 py-4">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {vendorPaymentData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.vendor}</td>
                  <td className="px-6 py-4 text-gray-900">{item.category}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">{formatCurrency(item.amountPaid)}</td>
                  <td className="px-6 py-4 text-gray-500">{item.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
