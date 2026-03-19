import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useOrganization } from '../../../contexts/OrganizationContext';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { organization } = useOrganization();
  const categories = organization.expenseCategories || ['Vendor Payment', 'Decoration', 'Catering', 'Staff Payment', 'Electricity', 'Maintenance', 'Cleaning', 'Marketing', 'Other'];
  const [expenseType, setExpenseType] = useState<'General' | 'Booking'>('General');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Expense Type Selection */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Expense Type</h3>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${expenseType === 'General' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 hover:border-pink-200'}`}>
                <input 
                  type="radio" 
                  name="expenseType" 
                  value="General" 
                  checked={expenseType === 'General'} 
                  onChange={() => setExpenseType('General')}
                  className="hidden"
                />
                <span className="font-bold">General Expense</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${expenseType === 'Booking' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 hover:border-pink-200'}`}>
                <input 
                  type="radio" 
                  name="expenseType" 
                  value="Booking" 
                  checked={expenseType === 'Booking'} 
                  onChange={() => setExpenseType('Booking')}
                  className="hidden"
                />
                <span className="font-bold">Booking Related Expense</span>
              </label>
            </div>
          </section>

          {/* Basic Information */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenseType === 'Booking' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Booking *</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    <option value="">-- Select a Booking --</option>
                    <option value="BK-1001">BK-1001 - Rahul Sharma (Wedding)</option>
                    <option value="BK-1002">BK-1002 - Priya Patel (Reception)</option>
                    <option value="BK-1003">BK-1003 - Amit Kumar (Corporate Event)</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                <input onFocus={(e) => e.target.select()} type="text" value="EXP-004" disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entered By</label>
                <input type="text" value="Admin User" disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense Category</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Vendor Details */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Vendor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                <input type="text" placeholder="Search vendor..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Category</label>
                <input type="text" placeholder="e.g. Caterer, Decorator" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* Payment Information */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Account</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Cash Account</option>
                  <option>Bank Account</option>
                </select>
              </div>
            </div>
          </section>

          {/* Amount Details */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Amount Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense Amount (₹)</label>
                <input type="number" min="0" placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax (If Applicable)</label>
                <input type="number" min="0" placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                <input type="number" placeholder="0.00" disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-900" />
              </div>
            </div>
          </section>

          {/* Reference Information */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Reference Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                <input type="text" placeholder="e.g. BILL-2024-001" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Ref No.</label>
                <input type="text" placeholder="e.g. UTR/Cheque No." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order (Optional)</label>
                <input type="text" placeholder="e.g. PO-2024-001" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* Notes & Attachments */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Notes & Attachments</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Reason for expense</label>
                <textarea onFocus={(e) => e.target.select()} rows={3} placeholder="Add any additional notes here..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Bill photo, Invoice)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-sm text-gray-500">Click to upload or drag and drop files here</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors">
            Save Expense
          </button>
        </div>
      </div>
    </div>
  );
};
