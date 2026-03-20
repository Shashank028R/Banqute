import React, { useState } from 'react';
import { 
  X, IndianRupee, CreditCard, Banknote, Smartphone, 
  CheckCircle2, History, Plus, Calendar, User, 
  ArrowRight, Wallet, Receipt, TrendingUp, Clock, Eye
} from 'lucide-react';
import { Booking } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { api } from '../../services/api';
import { useOrganization } from '../../contexts/OrganizationContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  booking: Booking;
  primaryColor: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
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

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onUpdate, booking, primaryColor }) => {
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Bank/Online'>('Cash');
  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [paymentMedium, setPaymentMedium] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [narration, setNarration] = useState<string>('Advance Payment');
  const [customNarration, setCustomNarration] = useState<string>('');
  
  // States for modals
  const [viewingTransaction, setViewingTransaction] = useState<PaymentRecord | null>(null);
  const [revertingTransactionId, setRevertingTransactionId] = useState<string | null>(null);
  const [revertReason, setRevertReason] = useState<string>('Incorrect Amount');
  const [customRevertReason, setCustomRevertReason] = useState<string>('');

  const { organization: org, user } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<PaymentRecord[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.getPayments(org.id).then(allPayments => {
        const bookingPayments = allPayments.filter(p => p.bookingId === booking.id);
        const records = bookingPayments.map(p => ({
          id: p.id,
          amount: p.amount,
          date: p.date,
          mode: p.method,
          bankName: p.bankName || undefined,
          paymentMedium: p.paymentMedium || undefined,
          reference: p.reference || 'N/A',
          narration: p.notes || 'Advance Payment',
          status: p.type === 'Reverted' ? 'Reverted' : 'Completed',
          enteredBy: { name: p.recordedBy || 'System', role: 'Administrator' },
          revertedAt: p.revertedDate,
          revertReason: p.revertReason
        } as PaymentRecord));
        setHistory(records);
        setIsLoading(false);
      }).catch(console.error);
    }
  }, [isOpen, booking.id, org.id]);

  if (!isOpen) return null;

  const activeHistory = history.filter(p => p.status !== 'Reverted');
  const totalPaid = activeHistory.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = booking.rate - totalPaid;
  const paidPercentage = Math.min(Math.round((totalPaid / booking.rate) * 100) || 0, 100);

  const capitalizeFirstLetter = (val: string) => {
    if (val.length > 0) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
    return val;
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0 || isLoading) return;

    const finalNarration = narration === 'Custom' ? customNarration : narration;

    const newPaymentData = {
      bookingId: booking.id,
      tenantId: org.id,
      amount: numAmount,
      date: new Date().toISOString(),
      method: paymentMode,
      type: 'Received',
      bankName: paymentMode === 'Bank/Online' ? bankName : undefined,
      paymentMedium: paymentMode === 'Bank/Online' ? paymentMedium : undefined,
      reference: reference || 'N/A',
      notes: finalNarration,
      recordedBy: user?.displayName || user?.email || 'Administrator'
    };

    setIsLoading(true);
    try {
      const saved = await api.createPayment(newPaymentData);
      
      const newRecord: PaymentRecord = {
        id: saved.id,
        amount: saved.amount,
        date: saved.date,
        mode: saved.method,
        bankName: saved.bankName,
        paymentMedium: saved.paymentMedium,
        reference: saved.reference,
        narration: saved.notes,
        status: 'Completed',
        enteredBy: { name: saved.recordedBy || 'System', role: 'Administrator' }
      };

      setHistory([...history, newRecord]);
      setAmount('');
      setReference('');
      setBankName('');
      setPaymentMedium('');
      setNarration('Advance Payment');
      setCustomNarration('');
      onUpdate?.();
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRevert = async () => {
    if (!revertingTransactionId || isLoading) return;
    
    const finalReason = revertReason === 'Custom' ? customRevertReason : revertReason;
    
    setIsLoading(true);
    try {
      await api.updatePayment(revertingTransactionId, { 
        type: 'Reverted', 
        revertReason: finalReason,
        revertedDate: new Date().toISOString(),
        recordedBy: user?.displayName || user?.email || 'Administrator'
      });
      
      setHistory(history.map(p => p.id === revertingTransactionId ? { 
        ...p, 
        status: 'Reverted',
        revertedAt: new Date().toISOString(),
        revertReason: finalReason,
        enteredBy: { name: user?.displayName || user?.email || 'System', role: 'Administrator' }
      } : p));
      
      setRevertingTransactionId(null);
      setRevertReason('Incorrect Amount');
      setCustomRevertReason('');
      onUpdate?.();
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    if (mode === 'Cash') return <Banknote size={16} className="text-emerald-500" />;
    if (mode === 'Bank/Online' || mode === 'Initial Advance') return <Smartphone size={16} className="text-purple-500" />;
    return <Wallet size={16} className="text-slate-400" />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white w-full h-full md:h-[95vh] md:w-[95vw] md:max-w-7xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header - Mobile Only Close */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-black text-slate-900">Payments</h2>
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
                  <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                    <Wallet size={20} />
                  </div>
                  Payment Management
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
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact No</p>
                      <p className="text-sm font-bold text-slate-700">{booking.contact}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Date</p>
                      <p className="text-sm font-bold text-slate-700">{new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Event Type</p>
                      <p className="text-sm font-bold text-slate-700">{booking.eventType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                    <IndianRupee size={18} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Rate</span>
                </div>
                <p className="text-2xl font-black text-slate-900">{formatCurrency(booking.rate)}</p>
              </div>

              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Paid</span>
                </div>
                <p className="text-2xl font-black text-emerald-600">{formatCurrency(totalPaid)}</p>
              </div>

              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Balance</span>
                </div>
                <p className="text-2xl font-black text-amber-600">{formatCurrency(balance)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Payment Progress</span>
                <span className="text-2xl font-black text-emerald-500">{paidPercentage}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  style={{ width: `${paidPercentage}%` }}
                />
              </div>
            </div>

            {/* History Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History size={16} className="text-slate-400" /> TRANSACTION HISTORY
                </h3>
                <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {history.length} Entries
                </span>
              </div>
              
              <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Narration</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount (₹)</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {history.map((item) => (
                        <tr key={item.id} className={`group hover:bg-slate-50/50 transition-colors ${item.status === 'Reverted' ? 'opacity-50 grayscale' : ''}`}>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-black text-slate-400 font-mono">{item.id}</span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900">{new Date(item.date).toLocaleDateString()}</span>
                              <span className="text-[10px] font-bold text-slate-400">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              {getModeIcon(item.mode)}
                              <span className="text-xs font-bold text-slate-600">
                                {item.mode === 'Bank/Online' 
                                  ? `${item.bankName || 'Bank'} (${item.paymentMedium || 'Online'})` 
                                  : item.mode}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900">{item.narration}</span>
                              {item.reference && item.reference !== 'N/A' && (
                                <span className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]" title={item.reference}>
                                  Ref: {item.reference}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className={`text-sm font-black ${item.status === 'Reverted' ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                              {formatCurrency(item.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setViewingTransaction(item)}
                                className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors" 
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              {item.status !== 'Reverted' && (
                                <button 
                                  onClick={() => setRevertingTransactionId(item.id)}
                                  className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors" 
                                  title="Revert Payment"
                                >
                                  <History size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Add Payment Form */}
          <div className="w-full md:w-[400px] p-8 flex flex-col bg-white">
            <div className="hidden md:flex justify-end mb-8">
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-900">Record Payment</h3>
              <p className="text-slate-500 text-sm mt-1">Add a new transaction for this booking.</p>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <IndianRupee size={20} />
                  </div>
                  <input 
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (Number(val) >= 0 || val === '') {
                        setAmount(val);
                      }
                    }}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-black text-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Cash', 'Bank/Online'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                        paymentMode === mode
                          ? 'border-emerald-500 bg-white text-emerald-600 shadow-sm' 
                          : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <div className={paymentMode === mode ? 'text-emerald-500' : 'text-slate-300'}>
                        {getModeIcon(mode)}
                      </div>
                      <span className="text-[10px] font-black tracking-wider uppercase">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMode === 'Bank/Online' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank</label>
                    <select 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs appearance-none"
                    >
                      <option value="">Select Bank</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Bank">Kotak Mahindra Bank</option>
                      <option value="PNB">Punjab National Bank</option>
                      <option value="BOB">Bank of Baroda</option>
                      <option value="Union Bank">Union Bank of India</option>
                      <option value="Canara Bank">Canara Bank</option>
                      <option value="IDFC First">IDFC First Bank</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medium</label>
                    <select 
                      value={paymentMedium}
                      onChange={(e) => setPaymentMedium(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs appearance-none"
                    >
                      <option value="">Select Medium</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Card">Card</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMode === 'Bank/Online' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Reference / Cheque No.
                  </label>
                  <input 
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(capitalizeFirstLetter(e.target.value))}
                    placeholder="UTR or Cheque Number"
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Narration / Notes</label>
                <select 
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm appearance-none"
                >
                  <option value="Advance Payment">Advance Payment</option>
                  <option value="Instalment">Instalment</option>
                  <option value="Final Payment">Final Payment</option>
                  <option value="Security Deposit">Security Deposit</option>
                  <option value="Refund">Refund</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {narration === 'Custom' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Narration</label>
                  <textarea onFocus={(e) => e.target.select()} 
                    value={customNarration}
                    onChange={(e) => setCustomNarration(capitalizeFirstLetter(e.target.value))}
                    placeholder="Enter custom narration..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-sm min-h-[80px] resize-none"
                  />
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
              >
                <Plus size={20} /> RECORD PAYMENT
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {viewingTransaction && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Receipt size={18} className="text-emerald-500" />
                Transaction Details
              </h4>
              <button onClick={() => setViewingTransaction(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                  <p className="text-sm font-black text-slate-900 font-mono">{viewingTransaction.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    viewingTransaction.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {viewingTransaction.status}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount Paid</p>
                  <p className="text-xl font-black text-emerald-600">{formatCurrency(viewingTransaction.amount)}</p>
                </div>
                <div className="h-px bg-slate-200/50 mb-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Method</span>
                    <span className="font-black text-slate-900">{viewingTransaction.mode}</span>
                  </div>
                  {viewingTransaction.bankName && (
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-500">Bank</span>
                      <span className="font-black text-slate-900">{viewingTransaction.bankName}</span>
                    </div>
                  )}
                  {viewingTransaction.paymentMedium && (
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-500">Medium</span>
                      <span className="font-black text-slate-900">{viewingTransaction.paymentMedium}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-500">Narration</span>
                    <span className="font-black text-slate-900">{viewingTransaction.narration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Received By</p>
                    <p className="text-sm font-black text-slate-900">{viewingTransaction.enteredBy.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{viewingTransaction.enteredBy.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Entry Time</p>
                    <p className="text-sm font-black text-slate-900">
                      {new Date(viewingTransaction.date).toLocaleDateString()} at {new Date(viewingTransaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {viewingTransaction.status === 'Reverted' && (
                  <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 mb-2 text-rose-600">
                      <History size={16} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Reversion Details</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Reverted At</p>
                        <p className="text-xs font-black text-rose-900">
                          {viewingTransaction.revertedAt ? new Date(viewingTransaction.revertedAt).toLocaleDateString() + ' at ' + new Date(viewingTransaction.revertedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Reason</p>
                        <p className="text-xs font-black text-rose-900 italic">"{viewingTransaction.revertReason || 'No reason provided'}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setViewingTransaction(null)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revert Reason Modal */}
      {revertingTransactionId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-rose-50/50">
              <h4 className="text-lg font-black text-rose-600 flex items-center gap-2">
                <History size={18} />
                Revert Transaction
              </h4>
              <button onClick={() => setRevertingTransactionId(null)} className="p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-400">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500 font-medium">Please select a reason for reverting this transaction. This action will be logged.</p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reversion Reason</label>
                <select 
                  value={revertReason}
                  onChange={(e) => setRevertReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm appearance-none"
                >
                  <option value="Incorrect Amount">Incorrect Amount</option>
                  <option value="Wrong Booking">Wrong Booking</option>
                  <option value="Payment Bounced">Payment Bounced</option>
                  <option value="Customer Refund">Customer Refund</option>
                  <option value="Entry Error">Entry Error</option>
                  <option value="Custom">Custom Reason</option>
                </select>
              </div>

              {revertReason === 'Custom' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Custom Reason</label>
                  <textarea 
                    value={customRevertReason}
                    onChange={(e) => setCustomRevertReason(capitalizeFirstLetter(e.target.value))}
                    placeholder="Describe the reason for reversion..."
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm min-h-[80px] resize-none"
                  />
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setRevertingTransactionId(null)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmRevert}
                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-colors"
              >
                Confirm Revert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
