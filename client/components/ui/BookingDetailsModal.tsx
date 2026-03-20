import React, { useState } from 'react';
import { 
  X, User, Calendar, Phone, PartyPopper, Users, IndianRupee, 
  Receipt, FileText, TrendingUp, Clock, Eye, RotateCcw,
  CreditCard, Banknote, Smartphone, CheckCircle2, History, 
  Plus, ArrowRight, Wallet
} from 'lucide-react';
import { Booking } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  primaryColor: string;
  initialTab?: 'details' | 'accounts';
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  booking, 
  primaryColor
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: primaryColor }}>
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 leading-tight">{booking.clientName}</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{booking.bookingId || booking.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Event Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Event Date</p>
                  <p className="text-sm font-black text-gray-900">{new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Event Type</p>
                  <p className="text-sm font-black text-gray-900">{booking.eventType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Session</p>
                  <p className="text-sm font-black text-gray-900">{booking.event_slot}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Guests</p>
                  <p className="text-sm font-black text-gray-900">{booking.guests}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Customer Contact</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Phone Number</p>
                  <p className="text-sm font-black text-gray-900">{booking.contact}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block ${
                    booking.status === 'Today' ? 'bg-amber-100 text-amber-700' :
                    booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 rounded-2xl text-sm font-black text-white shadow-lg active:scale-95 uppercase tracking-widest" style={{ backgroundColor: primaryColor }}>
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
