import React, { useState } from 'react';
import { Search, CalendarCheck, Calendar, Package } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface EventAllocationListProps {
  allocations: any[];
}

export const EventAllocationList: React.FC<EventAllocationListProps> = ({ allocations }) => {
  const { organization: org } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAllocations = allocations.filter(allocation => 
    allocation.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    allocation.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold text-gray-900">Inventory Allocation to Events</h2>
        <button 
          className="px-4 py-2 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
          style={{ backgroundColor: org.primary_color }}
        >
          <CalendarCheck size={16} />
          Allocate Inventory
        </button>
      </div>
      <div className="p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search allocations by event or booking ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
          />
        </div>

        <div className="space-y-4">
          {filteredAllocations.map((allocation, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all bg-white">
               <div className="flex justify-between items-start mb-5">
                  <div>
                     <h3 className="font-bold text-gray-900 text-lg mb-1">{allocation.eventName}</h3>
                     <div className="flex items-center gap-3 text-sm text-gray-500">
                       <span className="font-medium text-gray-700">{allocation.bookingId}</span>
                       <span className="flex items-center gap-1"><Calendar size={14} /> {allocation.date}</span>
                     </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                     allocation.status === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                     {allocation.status}
                  </span>
               </div>
               <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Package size={16} className="text-gray-400" />
                    <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Allocated Items ({allocation.items.length})</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                     {allocation.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                           <span className="text-sm font-medium text-gray-700 truncate mr-2" title={item.item}>{item.item}</span>
                           <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{item.quantity}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
