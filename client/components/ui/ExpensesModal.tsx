import React, { useState, useEffect } from 'react';
import { 
  X, User, Calendar, Phone, PartyPopper, Users, IndianRupee, 
  Receipt, FileText, TrendingUp, Clock, Eye, RotateCcw,
  Banknote, Smartphone, History, Plus, Wallet
} from 'lucide-react';
import { Booking } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { useOrganization } from '../../contexts/OrganizationContext';

interface ExpenseRecord {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  mode: string;
  bankName?: string;
  paymentMedium?: string;
  reference: string;
  narration: string;
  status: 'Completed' | 'Pending' | 'Reverted';
  enteredBy: {
    name: string;
    role: string;
  };
  revertedAt?: string;
  revertReason?: string;
}

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  primaryColor: string;
}

export const ExpensesModal: React.FC<ExpensesModalProps> = ({ 
  isOpen, 
  onClose, 
  booking, 
  primaryColor
}) => {
  const { organization } = useOrganization();
  const categories = organization.expenseCategories || ['Catering', 'Decoration', 'Staff', 'Infrastructure', 'Entertainment', 'Manpower', 'Other'];

  // Expense Form States
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<string>(categories[0] || 'Catering');
  const [expenseDescription, setExpenseDescription] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expensePaymentMode, setExpensePaymentMode] = useState<'Cash' | 'Bank/Online'>('Cash');
  const [expenseBankName, setExpenseBankName] = useState<string>('');
  const [expensePaymentMedium, setExpensePaymentMedium] = useState<string>('');
  const [expenseReference, setExpenseReference] = useState<string>('');
  const [expenseNarration, setExpenseNarration] = useState<string>('Vendor Payment');
  const [expenseCustomNarration, setExpenseCustomNarration] = useState<string>('');

  // Expense Modal States
  const [viewingExpense, setViewingExpense] = useState<ExpenseRecord | null>(null);
  const [revertingExpenseId, setRevertingExpenseId] = useState<string | null>(null);
  const [revertExpenseReason, setRevertExpenseReason] = useState<string>('Incorrect Amount');
  const [customRevertExpenseReason, setCustomRevertExpenseReason] = useState<string>('');

  // Mocked Expense History
  const [expenseHistory, setExpenseHistory] = useState<ExpenseRecord[]>([
    {
      id: 'EXP-001',
      amount: booking.expenses * 0.6,
      date: new Date().toISOString(),
      category: 'Catering',
      description: 'Food & Beverages',
      mode: 'Bank/Online',
      bankName: 'HDFC Bank',
      paymentMedium: 'Net Banking',
      reference: 'TXN-9988',
      narration: 'Vendor Payment',
      status: 'Completed',
      enteredBy: {
        name: 'Akshit Sharma',
        role: 'Administrator'
      }
    },
    {
      id: 'EXP-002',
      amount: booking.expenses * 0.3,
      date: new Date().toISOString(),
      category: 'Decoration',
      description: 'Floral & Lighting',
      mode: 'Cash',
      reference: 'N/A',
      narration: 'Vendor Payment',
      status: 'Completed',
      enteredBy: {
        name: 'Akshit Sharma',
        role: 'Administrator'
      }
    }
  ]);

  const capitalizeFirstLetter = (val: string) => {
    if (val.length > 0) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
    return val;
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(expenseAmount);
    if (!expenseAmount || isNaN(numAmount) || numAmount <= 0) return;

    const finalNarration = expenseNarration === 'Custom' ? expenseCustomNarration : expenseNarration;

    const newExpense: ExpenseRecord = {
      id: `EXP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      amount: numAmount,
      date: new Date(expenseDate).toISOString(),
      category: expenseCategory,
      description: expenseDescription,
      mode: expensePaymentMode,
      bankName: expensePaymentMode === 'Bank/Online' ? expenseBankName : undefined,
      paymentMedium: expensePaymentMode === 'Bank/Online' ? expensePaymentMedium : undefined,
      reference: expenseReference || 'N/A',
      narration: finalNarration,
      status: 'Completed',
      enteredBy: {
        name: 'Akshit Sharma',
        role: 'Administrator'
      }
    };

    setExpenseHistory([...expenseHistory, newExpense]);
    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseReference('');
    setExpenseBankName('');
    setExpensePaymentMedium('');
    setExpenseNarration('Vendor Payment');
    setExpenseCustomNarration('');
  };

  const handleConfirmRevertExpense = () => {
    if (!revertingExpenseId) return;
    
    const finalReason = revertExpenseReason === 'Custom' ? customRevertExpenseReason : revertExpenseReason;
    
    setExpenseHistory(expenseHistory.map(p => p.id === revertingExpenseId ? { 
      ...p, 
      status: 'Reverted',
      revertedAt: new Date().toISOString(),
      revertReason: finalReason
    } : p));
    
    setRevertingExpenseId(null);
    setRevertExpenseReason('Incorrect Amount');
    setCustomRevertExpenseReason('');
  };

  const getModeIcon = (mode: string) => {
    if (mode === 'Cash') return <Banknote size={14} className="text-emerald-500" />;
    if (mode === 'Bank/Online') return <Smartphone size={14} className="text-purple-500" />;
    return <Wallet size={14} className="text-slate-400" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white w-full h-full md:h-[95vh] md:w-[95vw] md:max-w-7xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header - Mobile Only Close */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-black text-slate-900">Expenses</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Summary & History */}
          <div className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto border-r border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="w-full">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-6">
                  <div className="p-2 bg-rose-500 rounded-xl text-white shadow-lg shadow-rose-500/20">
                    <Receipt size={20} />
                  </div>
                  Expense Management
                </h2>
                
                {/* Booking Info Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{booking.clientName}</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">BOOKING ID: {booking.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Date</p>
                      <p className="text-sm font-bold text-slate-700">{new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Type</p>
                      <p className="text-sm font-bold text-slate-700">{booking.eventType}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Guest Count</p>
                      <p className="text-sm font-bold text-slate-700">{booking.guests} Pax</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Expenses</span>
                </div>
                <p className="text-2xl font-black text-rose-600">
                  {formatCurrency(expenseHistory.filter(e => e.status !== 'Reverted').reduce((acc, curr) => acc + curr.amount, 0))}
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                    <IndianRupee size={18} />
                  </div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</span>
                </div>
                <p className="text-2xl font-black text-emerald-600">
                  {formatCurrency(booking.rate)}
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                    <Wallet size={18} />
                  </div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Net Profit</span>
                </div>
                <p className="text-2xl font-black text-indigo-600">
                  {formatCurrency(booking.rate - expenseHistory.filter(e => e.status !== 'Reverted').reduce((acc, curr) => acc + curr.amount, 0))}
                </p>
              </div>
            </div>

            {/* History Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History size={16} className="text-slate-400" /> EXPENSE HISTORY
                </h3>
                <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {expenseHistory.length} Entries
                </span>
              </div>
              
              <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount (₹)</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {expenseHistory.length > 0 ? (
                        expenseHistory.map((item) => (
                          <tr key={item.id} className={`group hover:bg-slate-50/50 transition-colors ${item.status === 'Reverted' ? 'opacity-50 grayscale' : ''}`}>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">{new Date(item.date).toLocaleDateString()}</span>
                                <span className="text-[10px] font-bold text-slate-400">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">{item.description}</span>
                                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]" title={item.narration}>
                                  {item.narration}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className={`text-sm font-black ${item.status === 'Reverted' ? 'text-slate-400 line-through' : 'text-rose-600'}`}>
                                {formatCurrency(item.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setViewingExpense(item)}
                                  className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors" 
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                {item.status !== 'Reverted' && (
                                  <button 
                                    onClick={() => setRevertingExpenseId(item.id)}
                                    className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors" 
                                    title="Revert Expense"
                                  >
                                    <RotateCcw size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic text-sm">
                            No expense records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Add Expense Form */}
          <div className="w-full md:w-[400px] p-8 flex flex-col bg-white">
            <div className="hidden md:flex justify-end mb-8">
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900">Record Expense</h3>
              <p className="text-slate-500 text-sm mt-1">Add a new expense for this event.</p>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expense Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee size={20} />
                  </div>
                  <input onFocus={(e) => e.target.select()} 
                    type="number"
                    min="0"
                    value={expenseAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (Number(val) >= 0 || val === '') {
                        setExpenseAmount(val);
                      }
                    }}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <input 
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(capitalizeFirstLetter(e.target.value))}
                  placeholder="e.g. Extra Waiters, Floral decor"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Cash', 'Bank/Online'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setExpensePaymentMode(mode)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        expensePaymentMode === mode
                          ? 'border-rose-500 bg-white text-rose-600 shadow-sm' 
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <div className={expensePaymentMode === mode ? 'text-rose-500' : 'text-slate-300'}>
                        {getModeIcon(mode)}
                      </div>
                      <span className="text-[10px] font-black tracking-wider uppercase">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {expensePaymentMode === 'Bank/Online' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank</label>
                    <select 
                      value={expenseBankName}
                      onChange={(e) => setExpenseBankName(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-[10px] appearance-none"
                    >
                      <option value="">Select Bank</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="SBI">SBI</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medium</label>
                    <select 
                      value={expensePaymentMedium}
                      onChange={(e) => setExpensePaymentMedium(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-[10px] appearance-none"
                    >
                      <option value="">Select Medium</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Narration</label>
                <select 
                  value={expenseNarration}
                  onChange={(e) => setExpenseNarration(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs appearance-none"
                >
                  <option value="Vendor Payment">Vendor Payment</option>
                  <option value="Staff Salary">Staff Salary</option>
                  <option value="Material Purchase">Material Purchase</option>
                  <option value="Utility Bill">Utility Bill</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {expenseNarration === 'Custom' && (
                <textarea onFocus={(e) => e.target.select()} 
                  value={expenseCustomNarration}
                  onChange={(e) => setExpenseCustomNarration(capitalizeFirstLetter(e.target.value))}
                  placeholder="Enter custom narration..."
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs min-h-[80px] resize-none"
                />
              )}

              <button 
                type="submit"
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                <Plus size={20} /> RECORD EXPENSE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Expense Details Modal */}
      {viewingExpense && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Receipt size={20} className="text-rose-500" />
                Expense Details
              </h4>
              <button onClick={() => setViewingExpense(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expense ID</p>
                  <p className="text-sm font-black text-slate-900 font-mono">{viewingExpense.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    viewingExpense.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {viewingExpense.status}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Spent</p>
                  <p className="text-2xl font-black text-rose-600">{formatCurrency(viewingExpense.amount)}</p>
                </div>
                <div className="h-px bg-slate-200/50 mb-4" />
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Category</span>
                    <span className="font-black text-slate-900">{viewingExpense.category}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Description</span>
                    <span className="font-black text-slate-900">{viewingExpense.description}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Method</span>
                    <span className="font-black text-slate-900">{viewingExpense.mode}</span>
                  </div>
                  {viewingExpense.bankName && (
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-500">Bank</span>
                      <span className="font-black text-slate-900">{viewingExpense.bankName}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Narration</span>
                    <span className="font-black text-slate-900">{viewingExpense.narration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Recorded By</p>
                    <p className="text-sm font-black text-slate-900">{viewingExpense.enteredBy.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{viewingExpense.enteredBy.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Entry Time</p>
                    <p className="text-sm font-black text-slate-900">
                      {new Date(viewingExpense.date).toLocaleDateString()} at {new Date(viewingExpense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {viewingExpense.status === 'Reverted' && (
                  <div className="mt-4 p-5 bg-rose-50 rounded-[1.5rem] border border-rose-100 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 mb-3 text-rose-600">
                      <History size={18} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Reversion Details</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Reverted At</p>
                        <p className="text-xs font-black text-rose-900">
                          {viewingExpense.revertedAt ? new Date(viewingExpense.revertedAt).toLocaleDateString() + ' at ' + new Date(viewingExpense.revertedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Reason</p>
                        <p className="text-xs font-black text-rose-900 italic">"{viewingExpense.revertReason || 'No reason provided'}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setViewingExpense(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revert Expense Reason Modal */}
      {revertingExpenseId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/50">
              <h4 className="text-lg font-black text-rose-600 flex items-center gap-2">
                <History size={20} />
                Revert Expense
              </h4>
              <button onClick={() => setRevertingExpenseId(null)} className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <p className="text-sm text-slate-500 font-medium">Please select a reason for reverting this expense entry. This action will be logged and the amount will be adjusted in the financials.</p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reversion Reason</label>
                <select 
                  value={revertExpenseReason}
                  onChange={(e) => setRevertExpenseReason(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm appearance-none"
                >
                  <option value="Incorrect Amount">Incorrect Amount</option>
                  <option value="Wrong Category">Wrong Category</option>
                  <option value="Duplicate Entry">Duplicate Entry</option>
                  <option value="Payment Cancelled">Payment Cancelled</option>
                  <option value="Entry Error">Entry Error</option>
                  <option value="Custom">Custom Reason</option>
                </select>
              </div>

              {revertExpenseReason === 'Custom' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Reason / Narration</label>
                  <textarea 
                    value={customRevertExpenseReason}
                    onChange={(e) => setCustomRevertExpenseReason(capitalizeFirstLetter(e.target.value))}
                    placeholder="Enter detailed reason for reversion..."
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm min-h-[100px] resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setRevertingExpenseId(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmRevertExpense}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                >
                  Confirm Revert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
