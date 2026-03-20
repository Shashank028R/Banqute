
import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { formatCurrency, formatDate, isInSeason } from '../lib/utils';
import { 
  Search, Download, Plus, 
  User, Calendar, Phone, PartyPopper, 
  Users, IndianRupee, Clock, Receipt, 
  TrendingUp, Eye, Wallet, 
  FileText, Printer, MessageSquare,
  X, ArrowUpAZ, ArrowDownZA, CalendarRange, Package, RotateCcw,
  ChevronDown, FileSpreadsheet, FileJson,
  ClipboardList
} from 'lucide-react';
import { useOrganization } from '../contexts/OrganizationContext';
import { Booking, BookingStatus } from '../types';
import { BookingModal } from './BookingModal';
import { PrintableReservation } from './PrintableReservation';
import { PaymentModal } from './ui/PaymentModal';
import { ExpensesModal } from './ui/ExpensesModal';
import { BookingDetailsModal } from './ui/BookingDetailsModal';
import { ViewButton } from './ActionButtons/ViewButton';
import { PaymentButton } from './ActionButtons/PaymentButton';
import { ExpensesButton } from './ActionButtons/ExpensesButton';
import { AccountsButton } from './ActionButtons/AccountsButton';
import { PrintInvoiceButton } from './ActionButtons/PrintInvoiceButton';
import { CallButton } from './ActionButtons/CallButton';
import { WhatsAppButton } from './ActionButtons/WhatsAppButton';

interface BookingsProps {
  season: string;
  onNewReservation: () => void;
}

const getTier = (amount: number) => {
  if (amount > 400000) return 'Diamond';
  if (amount > 200000) return 'Gold';
  return 'Silver';
};

const DetailedBookingRow: React.FC<{ 
  booking: Booking; 
  primaryColor: string; 
  onPrint?: (booking: Booking) => void;
  onView?: (booking: Booking, tab: 'details' | 'expenses' | 'accounts') => void;
  onPayment?: (booking: Booking) => void;
  onExpenses?: (booking: Booking) => void;
}> = ({ booking, primaryColor, onPrint, onView, onPayment, onExpenses }) => {
  const advance = booking.payments?.reduce((s, p) => s + (p.type === 'Received' ? p.amount : -p.amount), 0) || 0;
  const balance = booking.rate - advance;
  const netProfit = booking.rate - booking.expenses;
  
  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const tier = getTier(booking.rate);

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Section 1: Identity & Status */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0" style={{ backgroundColor: primaryColor }}>
              <User size={24} />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-gray-900 leading-tight truncate">{booking.clientName}</h4>
              <p className="text-[10px] font-black text-gray-400 mt-0.5 tracking-widest uppercase">{booking.id}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 border rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyles(booking.status)}`}>
              {booking.status}
            </span>
            <span className="px-3 py-1 border border-indigo-100 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-widest">
              {tier}
            </span>
            <span className="px-3 py-1 border border-gray-100 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
              {booking.season}
            </span>
          </div>
        </div>

        {/* Section 2: Event Details */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4 lg:border-l border-gray-50 lg:pl-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar size={12} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Event Date</span>
            </div>
            <p className="text-xs font-black text-gray-800">{new Date(booking.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Phone size={12} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Contact</span>
            </div>
            <p className="text-xs font-black text-gray-800">{booking.contact}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <PartyPopper size={12} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Event Type</span>
            </div>
            <p className="text-xs font-black text-gray-800">{booking.eventType}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users size={12} />
              <span className="text-[9px] font-black uppercase tracking-tighter">Guests</span>
            </div>
            <p className="text-xs font-black text-gray-800">{booking.guests}</p>
          </div>
        </div>

        {/* Section 3: Detailed Financials */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-x-6 gap-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-gray-400 uppercase">Rate</span>
            <span className="text-xs font-black text-gray-900">{formatCurrency(booking.rate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-gray-400 uppercase">Paid</span>
            <span className="text-xs font-black text-emerald-600">{formatCurrency(advance)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-gray-400 uppercase">Expenses</span>
            <span className="text-xs font-black text-rose-500">{formatCurrency(booking.expenses)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-gray-400 uppercase">Balance</span>
            <span className={`text-xs font-black ${balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{formatCurrency(balance)}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-100 mt-1 flex justify-between items-center">
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Net Profit</span>
            <span className="text-sm font-black text-emerald-600">{formatCurrency(netProfit)}</span>
          </div>
        </div>

        {/* Section 4: Action Grid */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-2">
          <ViewButton 
            onClick={() => onView?.(booking, 'details')} 
          />
          <PaymentButton onClick={() => onPayment?.(booking)} />
          <ExpensesButton 
            onClick={() => onExpenses?.(booking)} 
          />
          <AccountsButton 
            onClick={() => onView?.(booking, 'accounts')} 
          />
          <PrintInvoiceButton onClick={() => onPrint?.(booking)} />
          <CallButton phone={booking.contact} />
          <WhatsAppButton phone={booking.contact} className="col-span-3" />
        </div>

      </div>
      
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-1 h-full opacity-50" style={{ backgroundColor: primaryColor }} />
    </div>
  );
};

export const Bookings: React.FC<BookingsProps> = ({ season, onNewReservation }) => {
  const { organization: org } = useOrganization();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [printingBooking, setPrintingBooking] = useState<Booking | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedBookingForExpenses, setSelectedBookingForExpenses] = useState<Booking | null>(null);
  const [detailsTab, setDetailsTab] = useState<'details' | 'accounts'>('details');
  const exportRef = useRef<HTMLDivElement>(null);
  const [dbBookings, setDbBookings] = useState<Booking[]>([]);

  const loadData = () => {
    api.getBookings(org.id)
      .then(setDbBookings)
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [org.id, season]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<'All' | 'Silver' | 'Gold' | 'Diamond'>('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'eventDate' | 'created_at' | 'rate' | 'clientName'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setTierFilter('All');
    setFromDate('');
    setToDate('');
    setSortBy('default');
    setSortOrder('desc');
  };

  // Processing Data
  const filteredBookings = dbBookings
    .filter(b => b.tenantId === org.id && isInSeason(b.eventDate, season))
    .filter(b => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        b.clientName.toLowerCase().includes(term) ||
        b.id.toLowerCase().includes(term) ||
        b.contact.includes(term);

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesTier = tierFilter === 'All' || getTier(b.rate) === tierFilter;
      
      const bDate = new Date(b.eventDate);
      const matchesFrom = fromDate === '' || bDate >= new Date(fromDate);
      const matchesTo = toDate === '' || bDate <= new Date(toDate);

      return matchesSearch && matchesStatus && matchesTier && matchesFrom && matchesTo;
    })
    .sort((a, b) => {
      if (sortBy === 'default') return 0;
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];
      if (sortBy === 'clientName') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      } else if (sortBy === 'eventDate' || sortBy === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleExport = (format: string) => {
    console.log(`Exporting ${filteredBookings.length} bookings in ${format} format...`);
    setIsExportOpen(false);
    // Real implementation would trigger actual file generation (e.g. XLSX/PDF libs)
  };

  const handlePrint = (booking: Booking) => {
    setPrintingBooking(booking);
    setTimeout(() => {
      window.focus();
      window.print();
      setPrintingBooking(null);
    }, 200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
             <ClipboardList size={32} style={{ color: org.primary_color }} /> 
             Season {season} Records
          </h1>
          <p className="text-gray-500 text-sm font-bold mt-2 ml-1">
            Archive and Management of all banquet reservations.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={onNewReservation}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-2xl active:scale-95"
            style={{ backgroundColor: org.primary_color, boxShadow: `0 12px 24px -6px ${org.primary_color}40` }}
          >
            <Plus size={20} /> Reservation
          </button>
        </div>
      </div>

      {/* DYNAMIC FULL-WIDTH SINGLE-LINE FILTER BAR */}
      <div className="bg-white px-4 py-3 rounded-[2rem] shadow-sm border border-gray-100 w-full">
        <div className="flex flex-wrap items-center gap-3 w-full">
          
          {/* Universal Search - Flexible space */}
          <div className="relative flex-auto min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text" 
              placeholder="Search Name, ID, Phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-50 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 transition-all text-xs font-bold text-gray-800"
              style={{ '--tw-ring-color': `${org.primary_color}10` } as React.CSSProperties}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-100 flex-shrink-0" />

          {/* Status Select */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-auto min-w-[120px]">
            <span className="hidden xl:inline text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</span>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-2 text-[11px] font-black text-gray-800 focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Package Tier Select */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-auto min-w-[120px]">
            <span className="hidden xl:inline text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Package</span>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-2 text-[11px] font-black text-gray-800 focus:outline-none cursor-pointer"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
            >
              <option value="All">All Packages</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>

          {/* Date Range Group */}
          <div className="flex items-center gap-1 flex-shrink-0 flex-auto bg-gray-50 border border-gray-100 rounded-lg px-2 min-w-[240px]">
             <CalendarRange size={14} className="text-gray-400 mx-1 flex-shrink-0" />
             <input 
              type="date"
              className="bg-transparent border-none py-2 text-[11px] font-black text-gray-800 focus:ring-0 flex-1"
              value={fromDate}
              title="From Date"
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="text-gray-300 px-1">-</span>
            <input 
              type="date"
              className="bg-transparent border-none py-2 text-[11px] font-black text-gray-800 focus:ring-0 flex-1"
              value={toDate}
              title="To Date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Sort By Group */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-auto min-w-[150px]">
            <span className="hidden xl:inline text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Sort</span>
            <select 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-2 text-[11px] font-black text-gray-800 focus:outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="default">All</option>
              <option value="eventDate">Event Date</option>
              <option value="created_at">Created Date</option>
              <option value="rate">Rate</option>
              <option value="clientName">Client Name</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all flex-shrink-0"
              title={sortOrder === 'asc' ? 'Switch to Descending' : 'Switch to Ascending'}
            >
              {sortOrder === 'asc' ? <ArrowUpAZ size={14} /> : <ArrowDownZA size={14} />}
            </button>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-100 flex-shrink-0" />

          {/* Export Dropdown Group */}
          <div className="relative flex-shrink-0" ref={exportRef}>
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
              title="Export filtered records"
            >
              <Download size={14} />
              <span className="hidden lg:inline">Export</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selected: {filteredBookings.length} records</p>
                </div>
                {[
                  { id: 'excel', label: 'Export as Excel format', icon: FileSpreadsheet, color: 'text-emerald-600' },
                  { id: 'pdf', label: 'Export as PDF format', icon: FileText, color: 'text-rose-600' },
                  { id: 'csv', label: 'Export as CSV data', icon: FileJson, color: 'text-blue-600' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleExport(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-gray-700 hover:bg-gray-50 transition-all text-left group"
                  >
                    <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filter Icon */}
          <button 
            onClick={clearFilters}
            className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex-shrink-0 flex items-center justify-center"
            title="Reset all filters"
          >
            <RotateCcw size={14} />
          </button>

        </div>
      </div>

      {/* Bookings Content */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <DetailedBookingRow 
              key={booking.id} 
              booking={booking} 
              primaryColor={org.primary_color} 
              onPrint={handlePrint}
              onView={(b, tab) => {
                setSelectedBookingForDetails(b);
                setDetailsTab(tab);
              }}
              onPayment={(b) => setSelectedBookingForPayment(b)}
              onExpenses={(b) => setSelectedBookingForExpenses(b)}
            />
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-[3rem] border border-gray-50 shadow-inner">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-100">
                <Search size={48} />
             </div>
             <div className="max-w-md">
                <h3 className="text-2xl font-black text-gray-900">No Reservations Found</h3>
                <p className="text-sm font-medium text-gray-400 mt-2 px-8">We couldn't find any bookings matching your criteria in the {season} database.</p>
             </div>
             <button 
              onClick={clearFilters}
              className="px-8 py-3 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-lg"
              style={{ backgroundColor: org.primary_color }}
             >
                Reset Search Filters
             </button>
          </div>
        )}
      </div>
      
      {/* Pagination Footer */}
      {filteredBookings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 px-4 text-center sm:text-left">
          <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
            Showing {filteredBookings.length} of {dbBookings.filter(b => b.tenantId === org.id && isInSeason(b.eventDate, season)).length} Season {season} Bookings
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-3 border border-gray-100 bg-white rounded-2xl text-xs font-black text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-widest" disabled>
              Previous
            </button>
            <div className="flex items-center gap-1 mx-2">
              <button className="w-10 h-10 flex items-center justify-center text-white rounded-xl shadow-xl font-black text-xs transition-transform active:scale-90" style={{ backgroundColor: org.primary_color }}>
                1
              </button>
            </div>
            <button className="px-6 py-3 border border-gray-100 bg-white rounded-2xl text-xs font-black text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all uppercase tracking-widest">
              Next Page
            </button>
          </div>
        </div>
      )}

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        season={season} 
      />

      {selectedBookingForPayment && (
        <PaymentModal 
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onUpdate={loadData}
          booking={selectedBookingForPayment}
          primaryColor={org.primary_color}
        />
      )}

      {selectedBookingForDetails && (
        <BookingDetailsModal
          isOpen={!!selectedBookingForDetails}
          onClose={() => setSelectedBookingForDetails(null)}
          booking={selectedBookingForDetails}
          primaryColor={org.primary_color}
          initialTab={detailsTab}
        />
      )}

      {selectedBookingForExpenses && (
        <ExpensesModal
          isOpen={!!selectedBookingForExpenses}
          onClose={() => setSelectedBookingForExpenses(null)}
          booking={selectedBookingForExpenses}
          primaryColor={org.primary_color}
        />
      )}

      {printingBooking && (
        <PrintableReservation 
          formData={printingBooking} 
          org={org}
          subtotal={printingBooking.rate}
          totalRate={printingBooking.rate}
          balanceDue={printingBooking.rate - (printingBooking.payments?.reduce((s, p) => s + (p.type === 'Received' ? p.amount : -p.amount), 0) || 0)}
        />
      )}
    </div>
  );
};
