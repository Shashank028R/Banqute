import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';

interface AddInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

export const AddInventoryItemModal: React.FC<AddInventoryItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const { organization: org } = useOrganization();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Linens',
    quantity: 0,
    unit: 'pcs',
    reorderPoint: 0,
    supplier: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: `ITM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: formData.quantity <= formData.reorderPoint ? 'Low Stock' : 'In Stock',
      lastRestocked: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add Inventory Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
              >
                <option value="Linens">Linens</option>
                <option value="Furniture">Furniture</option>
                <option value="Crockery">Crockery</option>
                <option value="Glassware">Glassware</option>
                <option value="Catering Equipment">Catering Equipment</option>
                <option value="Lighting">Lighting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="sets">Sets</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="ltr">Liters (ltr)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Quantity</label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Point</label>
              <input
                type="number"
                required
                min="0"
                value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Supplier</label>
            <input
              type="text"
              required
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white rounded-xl font-medium transition-colors"
              style={{ backgroundColor: org.primary_color }}
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
