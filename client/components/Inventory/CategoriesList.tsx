import React, { useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface CategoriesListProps {
  categories: any[];
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  const { organization: org } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Inventory Categories</h2>
        <button 
          className="px-4 py-2 text-white rounded-xl transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
          style={{ backgroundColor: org.primary_color }}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>
      <div className="p-6">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 font-medium">Category Name</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCategories.map((category, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.id}</div>
                  </td>
                  <td className="py-4 text-gray-600">{category.description}</td>
                  <td className="py-4 text-right">
                    <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors" title="Edit Category">
                       <Edit size={16} />
                    </button>
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
