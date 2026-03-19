import React, { useState } from 'react';
import { Search, Plus, Edit, Eye } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface ItemsListProps {
  items: any[];
  setItems: (items: any[]) => void;
}

export const ItemsList: React.FC<ItemsListProps> = ({ items, setItems }) => {
  const { organization: org } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900">Items / Inventory List</h2>
        <button 
          className="px-4 py-2 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
          style={{ backgroundColor: org.primary_color }}
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>
      <div className="p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 font-medium">Item Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Stock Levels</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.id}</div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 min-w-[250px]">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Total: <span className="font-medium text-gray-900">{item.totalQuantity}</span></span>
                        <span className="text-emerald-600 font-medium">{item.availableQuantity} avail</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-emerald-500" 
                          style={{ width: `${(item.availableQuantity / item.totalQuantity) * 100}%` }}
                          title={`Available: ${item.availableQuantity}`}
                        />
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${(item.inUse / item.totalQuantity) * 100}%` }}
                          title={`In Use: ${item.inUse}`}
                        />
                        <div 
                          className="h-full bg-red-500" 
                          style={{ width: `${(item.damaged / item.totalQuantity) * 100}%` }}
                          title={`Damaged: ${item.damaged}`}
                        />
                      </div>
                      <div className="flex gap-3 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> In Use ({item.inUse})</span>
                        {item.damaged > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Damaged ({item.damaged})</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="text-sm">{item.location}</div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye size={16} />
                       </button>
                       <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit Item">
                          <Edit size={16} />
                       </button>
                    </div>
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
