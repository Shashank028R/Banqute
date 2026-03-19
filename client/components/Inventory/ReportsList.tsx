import React from 'react';
import { FileBarChart, Download, Printer } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

export const ReportsList: React.FC = () => {
  const { organization: org } = useOrganization();

  const reports = [
    { id: 'RPT001', name: 'Current Stock Report', description: 'Detailed view of all items currently in stock, including available and in-use quantities.', lastGenerated: '2024-04-15 10:30 AM' },
    { id: 'RPT002', name: 'Low Stock Items', description: 'List of items that have fallen below their defined reorder points.', lastGenerated: '2024-04-16 08:00 AM' },
    { id: 'RPT003', name: 'Most Used Items', description: 'Analysis of items frequently allocated to events over the last 30 days.', lastGenerated: '2024-04-01 09:15 AM' },
    { id: 'RPT004', name: 'Damaged Items Summary', description: 'Log of all damaged or lost items, including reasons and responsible persons.', lastGenerated: '2024-04-10 04:45 PM' },
    { id: 'RPT005', name: 'Inventory Valuation', description: 'Financial summary of current inventory based on purchase prices and depreciation.', lastGenerated: '2024-03-31 11:59 PM' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Inventory Reports</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow flex flex-col h-full">
               <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                     <FileBarChart size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900">{report.name}</h3>
                     <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
               </div>
               <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Last generated: {report.lastGenerated}</span>
                  <div className="flex gap-2">
                     <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Print">
                        <Printer size={16} />
                     </button>
                     <button className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Download PDF">
                        <Download size={16} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
