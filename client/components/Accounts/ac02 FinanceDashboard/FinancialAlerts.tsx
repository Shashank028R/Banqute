import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';

export const FinancialAlerts: React.FC = () => { 
  const { alerts } = useFinanceData();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold flex items-center">
          <AlertCircle className="mr-2 text-gray-400" size={20} /> Alerts & Warnings
        </h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${
            alert.type === 'danger' ? 'bg-red-50 border-red-100 text-red-800' :
            alert.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-800' :
            'bg-blue-50 border-blue-100 text-blue-800'
          }`}>
            <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${
              alert.type === 'danger' ? 'text-red-600' :
              alert.type === 'warning' ? 'text-orange-600' :
              'text-blue-600'
            }`} />
            <p className="text-sm font-medium leading-snug">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
