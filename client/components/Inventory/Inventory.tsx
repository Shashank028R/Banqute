import React, { useState } from 'react';
import { Package, LayoutGrid, CalendarCheck, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { items as initialItems, stockIn, stockOut, damageLoss, movements, eventAllocations } from './mockData';
import { useOrganization } from '../../contexts/OrganizationContext';
import { ItemsList } from './ItemsList';
import { TransactionsList } from './TransactionsList';
import { EventAllocationList } from './EventAllocationList';

interface InventoryProps {
  season: string;
}

export const Inventory: React.FC<InventoryProps> = ({ season }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'transactions' | 'allocation'>('dashboard');
  const { organization: org } = useOrganization();

  // Filter data by org.id
  const filteredInitialItems = initialItems.filter(item => item.tenantId === org.id);
  const filteredStockIn = stockIn.filter(s => s.tenantId === org.id);
  const filteredStockOut = stockOut.filter(s => s.tenantId === org.id);
  const filteredDamageLoss = damageLoss.filter(d => d.tenantId === org.id);
  const filteredMovements = movements.filter(m => m.tenantId === org.id);
  const filteredEventAllocations = eventAllocations.filter(e => e.tenantId === org.id);

  const [items, setItems] = useState(filteredInitialItems);

  // Calculate dynamic stats
  const totalItems = items.reduce((sum, item) => sum + item.totalQuantity, 0);
  const inUseItems = items.reduce((sum, item) => sum + item.inUse, 0);
  const availableItems = items.reduce((sum, item) => sum + item.availableQuantity, 0);
  const damagedItems = items.reduce((sum, item) => sum + item.damaged, 0);
  const lowStockCount = items.filter(i => i.status === 'Low Stock').length;

  const dynamicStats = [
    {
      title: 'Total Inventory Items',
      value: totalItems.toLocaleString(),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Items In Use',
      value: inUseItems.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-amber-500',
    },
    {
      title: 'Items Available',
      value: availableItems.toLocaleString(),
      icon: CheckCircle,
      color: 'bg-emerald-500',
    },
    {
      title: 'Damaged Items',
      value: damagedItems.toLocaleString(),
      icon: XCircle,
      color: 'bg-red-500',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      color: 'bg-orange-500',
    }
  ];

  // Prepare chart data
  const chartData = [...items]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)
    .map(item => ({
    name: item.name.split(' ')[0], // Short name for chart
    Available: item.availableQuantity,
    InUse: item.inUse,
    Damaged: item.damaged
  }));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {dynamicStats.map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                      <stat.icon size={20} className={`text-${stat.color.split('-')[1]}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Stock Health Overview</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                        <Bar dataKey="Available" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="InUse" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Damaged" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {items.filter(i => i.status === 'Low Stock').length} Items
                    </span>
                  </div>
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                     {items.filter(i => i.status === 'Low Stock').map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                                 <AlertTriangle size={18} />
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                 <p className="text-xs text-gray-500 mt-0.5">Only <span className="font-bold text-red-600">{item.availableQuantity}</span> left</p>
                              </div>
                           </div>
                           <button className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors">
                             Reorder
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 'items':
        return <ItemsList items={items} setItems={setItems} />;
      case 'transactions':
        return <TransactionsList movements={filteredMovements} stockIn={filteredStockIn} stockOut={filteredStockOut} damageLoss={filteredDamageLoss} />;
      case 'allocation':
        return <EventAllocationList allocations={filteredEventAllocations} />;
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
    { id: 'items', label: 'Inventory List', icon: Package },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'allocation', label: 'Event Allocation', icon: CalendarCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all physical items used in events and banquet operations.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar">
          {navItems.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`flex-1 sm:flex-none px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                 activeTab === item.id 
                   ? 'text-gray-900 border-b-2' 
                   : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
               }`}
               style={activeTab === item.id ? { borderColor: org.primary_color } : {}}
             >
               <div className="flex items-center justify-center gap-2">
                 <item.icon size={16} />
                 {item.label}
               </div>
             </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  );
};
