import React, { useState } from 'react';
import { Search, XOctagon } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface DamageLossListProps {
  damageLoss: any[];
}

export const DamageLossList: React.FC<DamageLossListProps> = ({ damageLoss }) => {
  const { organization: org } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDamageLoss = damageLoss.filter(entry => 
    entry.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Damage / Loss Tracking</h2>
        <button 
          className="px-4 py-2 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
          style={{ backgroundColor: org.primary_color }}
        >
          <XOctagon size={16} />
          Report Damage
        </button>
      </div>
      <div className="p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search damage records..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Item Name</th>
                <th className="pb-3 font-medium text-right">Quantity</th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium">Responsible Person</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredDamageLoss.map((entry, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-gray-600">{entry.date}</td>
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{entry.itemName}</div>
                    <div className="text-xs text-gray-500">{entry.id}</div>
                  </td>
                  <td className="py-4 text-right font-medium text-red-600">{entry.quantity}</td>
                  <td className="py-4 text-gray-600">{entry.reason}</td>
                  <td className="py-4 text-gray-900">{entry.responsiblePerson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
