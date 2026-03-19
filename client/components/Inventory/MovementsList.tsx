import React, { useState } from 'react';
import { Search, Activity } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface MovementsListProps {
  movements: any[];
}

export const MovementsList: React.FC<MovementsListProps> = ({ movements }) => {
  const { organization: org } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovements = movements.filter(entry => 
    entry.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Inventory Movements</h2>
      </div>
      <div className="p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movements..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Item</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredMovements.map((entry, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-gray-600">{entry.date}</td>
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{entry.item}</div>
                    <div className="text-xs text-gray-500">{entry.id}</div>
                  </td>
                  <td className="py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        entry.type === 'Stock In' ? 'bg-emerald-100 text-emerald-800' :
                        entry.type === 'Event Usage' ? 'bg-blue-100 text-blue-800' :
                        entry.type === 'Return' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                     }`}>
                        {entry.type}
                     </span>
                  </td>
                  <td className={`py-4 text-right font-medium ${
                     entry.type === 'Stock In' || entry.type === 'Return' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                     {entry.type === 'Stock In' || entry.type === 'Return' ? '+' : '-'}{entry.quantity}
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
