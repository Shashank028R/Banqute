
import React, { useState } from 'react';
import { 
  Users, Calendar, IndianRupee, TrendingUp, Clock, Receipt, 
  User, PartyPopper, Eye, Wallet, FileText, Printer, MessageSquare, Phone
} from 'lucide-react';
import { Booking } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { ViewButton } from '../ActionButtons/ViewButton';
import { PaymentButton } from '../ActionButtons/PaymentButton';
import { ExpensesButton } from '../ActionButtons/ExpensesButton';
import { AccountsButton } from '../ActionButtons/AccountsButton';
import { PrintInvoiceButton } from '../ActionButtons/PrintInvoiceButton';
import { CallButton } from '../ActionButtons/CallButton';
import { WhatsAppButton } from '../ActionButtons/WhatsAppButton';

interface BookingCardProps {
  booking: Booking;
  primaryColor: string;
  secondaryColor: string;
  onPrint?: (booking: Booking) => void;
  onView?: (booking: Booking, tab: 'details' | 'expenses' | 'accounts') => void;
  onPayment?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  primaryColor, 
  secondaryColor, 
  onPrint,
  onView,
  onPayment
}) => {
  const advance = booking.payments?.reduce((s, p) => s + (p.type === 'Received' ? p.amount : -p.amount), 0) || 0;
  const balance = booking.rate - advance;
  const netProfit = booking.rate - booking.expenses;
  
  const getTier = (amount: number) => {
    if (amount > 400000) return 'Diamond';
    if (amount > 200000) return 'Gold';
    return 'Silver';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Today':
        return 'bg-amber-100 text-amber-700';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tier = getTier(booking.rate);
  const isNight = booking.event_slot === 'Night';

  return (
    <div className={`w-full rounded-[2.5rem] border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2 ${
      isNight ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100'
    }`}>
      {/* Header Section */}
      <div className={`p-6 pb-4 border-b ${
        isNight ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-50/80 border-gray-100'
      }`}>
        <div className="flex items-start gap-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <User size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-black leading-tight text-lg break-words truncate ${
              isNight ? 'text-white' : 'text-gray-900'
            }`}>
              {booking.clientName}
            </h4>
            <p className={`text-[10px] font-black mt-1 uppercase tracking-widest border inline-block px-2 py-0.5 rounded-md truncate max-w-full ${
              isNight ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-gray-400 bg-white border-gray-100'
            }`}>
              ({booking.id}) {isNight ? '🌙' : '☀️'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${getStatusStyles(booking.status)}`}>
            {booking.status}
          </span>
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${
            isNight ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
          }`}>
            {tier}
          </span>
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ml-auto ${
            isNight ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}>
            {booking.season}
          </span>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="px-6 py-5 grid grid-cols-2 gap-y-4 gap-x-6">
        <div className="space-y-1">
          <div className={`flex items-center gap-2 ${isNight ? 'text-slate-500' : 'text-gray-400'}`}>
            <Calendar size={14} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Event Date</span>
          </div>
          <p className={`text-sm font-black ${isNight ? 'text-slate-200' : 'text-gray-800'}`}>
            {new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="space-y-1">
          <div className={`flex items-center gap-2 ${isNight ? 'text-slate-500' : 'text-gray-400'}`}>
            <Phone size={14} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Contact</span>
          </div>
          <p className={`text-sm font-black ${isNight ? 'text-slate-200' : 'text-gray-800'}`}>{booking.contact}</p>
        </div>

        <div className="space-y-1">
          <div className={`flex items-center gap-2 ${isNight ? 'text-slate-500' : 'text-gray-400'}`}>
            <PartyPopper size={14} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Event Type</span>
          </div>
          <p className={`text-sm font-black ${isNight ? 'text-slate-200' : 'text-gray-800'}`}>{booking.eventType}</p>
        </div>

        <div className="space-y-1">
          <div className={`flex items-center gap-2 ${isNight ? 'text-slate-500' : 'text-gray-400'}`}>
            <Users size={14} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Guests</span>
          </div>
          <p className={`text-sm font-black ${isNight ? 'text-slate-200' : 'text-gray-800'}`}>{booking.guests}</p>
        </div>
      </div>

      {/* Financials Section */}
      <div className={`px-6 py-5 border-y grid grid-cols-3 gap-y-5 gap-x-4 ${
        isNight ? 'bg-slate-900/30 border-slate-800' : 'bg-gray-50/50 border-gray-100'
      }`}>
        <div className="text-center">
          <div className="flex flex-col items-center">
            <IndianRupee size={12} className={isNight ? 'text-slate-500' : 'text-gray-400'} />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rate</p>
            <p className={`text-xs font-black mt-0.5 ${isNight ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(booking.rate)}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="flex flex-col items-center">
            <Clock size={12} className={isNight ? 'text-slate-500' : 'text-gray-400'} />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Paid</p>
            <p className="text-xs font-black text-emerald-500 mt-0.5">{formatCurrency(advance)}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="flex flex-col items-center">
            <Receipt size={12} className={isNight ? 'text-slate-500' : 'text-gray-400'} />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expenses</p>
            <p className="text-xs font-black text-rose-500 mt-0.5">{formatCurrency(booking.expenses)}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="flex flex-col items-center">
            <TrendingUp size={12} className={isNight ? 'text-slate-500' : 'text-gray-400'} />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Balance</p>
            <p className={`text-xs font-black mt-0.5 ${balance > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
        <div className="text-center col-span-2">
          <div 
            className="flex flex-col items-center py-2 px-4 rounded-2xl"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }}>Net Profit</p>
            <p className="text-lg font-black mt-0.5" style={{ color: primaryColor }}>{formatCurrency(netProfit)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="p-4 grid grid-cols-4 gap-2">
        <ViewButton 
          onClick={() => onView?.(booking, 'details')} 
          isNight={isNight} 
        />
        <PaymentButton onClick={() => onPayment?.(booking)} isNight={isNight} />
        <ExpensesButton 
          onClick={() => onView?.(booking, 'expenses')} 
          isNight={isNight} 
        />
        <AccountsButton 
          onClick={() => onView?.(booking, 'accounts')} 
          isNight={isNight} 
        />
        <PrintInvoiceButton onClick={() => onPrint?.(booking)} isNight={isNight} />
        <CallButton phone={booking.contact} isNight={isNight} />
        <WhatsAppButton phone={booking.contact} className="col-span-2" />
      </div>
    </div>
  );
};
