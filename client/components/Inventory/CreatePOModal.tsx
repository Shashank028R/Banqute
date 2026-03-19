import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { suppliers, stockItems } from './mockData';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (order: any) => void;
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { organization: org } = useOrganization();
  const [formData, setFormData] = useState({
    supplier: '',
    expectedDelivery: '',
  });
  
  const [items, setItems] = useState([{ item: '', quantity: 1, price: 0 }]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, { item: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      supplier: formData.supplier,
      date: new Date().toISOString().split('T')[0],
      expectedDelivery: formData.expectedDelivery,
      totalAmount: calculateTotal(),
      status: 'Pending',
      items: items.length,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Create Purchase Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <form id="po-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                <input
                  type="date"
                  required
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-900">Order Items</h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-sm font-medium flex items-center gap-1 hover:underline"
                  style={{ color: org.primary_color }}
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <select
                        required
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                        style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                      >
                        <option value="">Select item</option>
                        {stockItems.map(si => (
                          <option key={si.id} value={si.name}>{si.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                        style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                      />
                    </div>
                    <div className="w-32">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                          style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                    <div className="w-24 pt-2 text-right font-medium text-gray-900 text-sm">
                      ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{calculateTotal().toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="po-form"
            className="flex-1 px-4 py-2 text-white rounded-xl font-medium transition-colors"
            style={{ backgroundColor: org.primary_color }}
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};
