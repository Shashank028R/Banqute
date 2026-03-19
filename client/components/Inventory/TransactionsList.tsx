import React, { useState } from 'react';
import { Search, ArrowDownToLine, ArrowUpFromLine, XOctagon, Activity, Filter } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface TransactionsListProps {
  movements: any[];
  stockIn: any[];
  stockOut: any[];
  damageLoss: any[];
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ movements, stockIn, stockOut, damageLoss }) => {
  const { organization: org } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out' | 'damage'>('all');

  // Combine and format all transactions for a unified view if needed, or just use movements
  // The movements array already has most of this, but let's enhance it with details
  const allTransactions = movements.map(m => {
    let details = '';
    if (m.type === 'Stock In') {
      const si = stockIn.find(s => s.itemName === m.item && s.date === m.date);
      if (si) details = `Vendor: ${si.vendor} • Cost: ₹${si.purchaseCost.toLocaleString('en-IN')}`;
    } else if (m.type === 'Event Usage' || m.type === 'Return') {
      const so = stockOut.find(s => s.item === m.item && s.date === m.date);
      if (so) details = `Event: ${so.eventName} (${so.bookingId})`;
    } else if (m.type === 'Damage') {
      const dl = damageLoss.find(d => d.itemName === m.item && d.date === m.date);
      if (dl) details = `Reason: ${dl.reason} • By: ${dl.responsiblePerson}`;
    }
    return { ...m, details };
  });

  const filteredTransactions = allTransactions.filter(entry => {
    const matchesSearch = entry.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (entry.details && entry.details.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'in' && entry.type === 'Stock In') ||
                          (filterType === 'out' && (entry.type === 'Event Usage' || entry.type === 'Return')) ||
                          (filterType === 'damage' && entry.type === 'Damage');
                          
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900">Inventory Transactions</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none justify-center px-3 py-2 bg-gray-50 text-gray-700 rounded-xl transition-colors text-sm font-medium flex items-center gap-2 hover:bg-gray-100 border border-gray-200">
            <ArrowDownToLine size={16} />
            Stock In
          </button>
          <button className="flex-1 sm:flex-none justify-center px-3 py-2 bg-gray-50 text-gray-700 rounded-xl transition-colors text-sm font-medium flex items-center gap-2 hover:bg-gray-100 border border-gray-200">
            <ArrowUpFromLine size={16} />
            Stock Out
          </button>
          <button className="flex-1 sm:flex-none justify-center px-3 py-2 bg-gray-50 text-gray-700 rounded-xl transition-colors text-sm font-medium flex items-center gap-2 hover:bg-gray-100 border border-gray-200">
            <XOctagon size={16} />
            Report Damage
          </button>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-50 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            {(['all', 'in', 'out', 'damage'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  filterType === type ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Transaction</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTransactions.map((entry, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        entry.type === 'Stock In' ? 'bg-emerald-100 text-emerald-600' :
                        entry.type === 'Event Usage' ? 'bg-blue-100 text-blue-600' :
                        entry.type === 'Return' ? 'bg-purple-100 text-purple-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {entry.type === 'Stock In' ? <ArrowDownToLine size={16} /> :
                         entry.type === 'Event Usage' ? <ArrowUpFromLine size={16} /> :
                         entry.type === 'Return' ? <Activity size={16} /> :
                         <XOctagon size={16} />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{entry.item}</div>
                        <div className="text-xs text-gray-500">{entry.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {entry.details || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      entry.type === 'Stock In' || entry.type === 'Return' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {entry.type === 'Stock In' || entry.type === 'Return' ? '+' : '-'}{entry.quantity}
                    </span>
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
