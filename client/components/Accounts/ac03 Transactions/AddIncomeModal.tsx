import React from 'react';
import { X } from 'lucide-react';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Add Income</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                <input type="text" value="INC-004" disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time (Optional)</label>
                <input type="time" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entered By</label>
                <input type="text" value="Admin User" disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" />
              </div>
            </div>
          </section>

          {/* Source of Income */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Source of Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <optgroup label="Booking Payment">
                    <option>Advance Payment</option>
                    <option>Final Payment</option>
                  </optgroup>
                  <optgroup label="Add-on Services">
                    <option>Hall Booking</option>
                    <option>Catering</option>
                    <option>Decoration</option>
                  </optgroup>
                  <option>Other Income</option>
                </select>
              </div>
            </div>
          </section>

          {/* Booking Details */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Booking Details (If Applicable)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                <input type="text" placeholder="e.g. BK-1004" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input type="text" placeholder="Search customer..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name / Type</label>
                <input type="text" placeholder="e.g. Wedding Reception" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
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
                  <option>Card</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
                <input type="number" min="0" placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax (If Applicable)</label>
                <input type="number" min="0" placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹)</label>
                <input type="number" min="0" placeholder="0.00" disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-900" />
              </div>
            </div>
          </section>

          {/* Reference Details */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Reference Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Ref No.</label>
                <input type="text" placeholder="e.g. UTR/Cheque No." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input type="text" placeholder="e.g. INV-2024-001" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                <input type="text" placeholder="e.g. REC-2024-001" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>
            </div>
          </section>

          {/* Notes & Attachments */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Notes & Attachments</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Description</label>
                <textarea onFocus={(e) => e.target.select()} rows={3} placeholder="Add any additional notes here..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (Payment screenshot, Receipt image)</label>
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
            Save Income
          </button>
        </div>
      </div>
    </div>
  );
};
