
import React, { useRef, useState, useEffect } from 'react';
import { StatCard } from './ui/StatCard';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid, Legend
} from 'recharts';
import { 
  Users, Calendar, IndianRupee, TrendingUp, Clock, Banknote, Receipt, 
  LayoutDashboard, History, CalendarClock, ChevronLeft, ChevronRight, 
  Phone, MapPin, Tent, User, PartyPopper, Eye, Wallet, FileText, Printer, MessageSquare, Plus
} from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency, formatDate, isInSeason } from '../lib/utils';
import { Booking, Expense, Payment } from '../types';
import { useOrganization } from '../contexts/OrganizationContext';

import { BookingCard } from './ui/BookingCard';
import { BookingModal } from './BookingModal';
import { PrintableReservation } from './PrintableReservation';
import { PaymentModal } from './ui/PaymentModal';
import { BookingDetailsModal } from './ui/BookingDetailsModal';

interface DashboardProps {
  season: string;
  onNewReservation: () => void;
}

const ScrollableSection: React.FC<{ 
  title: string; 
  count: number; 
  icon: any; 
  bookings: Booking[]; 
  primaryColor: string;
  secondaryColor: string;
  onPrint?: (booking: Booking) => void;
  onView?: (booking: Booking, tab: 'details' | 'expenses' | 'accounts') => void;
  onPayment?: (booking: Booking) => void;
  dbPayments?: Payment[];
  dbExpenses?: Expense[];
}> = ({ title, count, icon: Icon, bookings, primaryColor, secondaryColor, onPrint, onView, onPayment, dbPayments = [], dbExpenses = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl shadow-lg border-2 border-white" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
             <Icon size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Found {count} entries in records</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-xl transition-all active:scale-95"
            style={{ backgroundColor: primaryColor, boxShadow: `0 12px 24px -6px ${primaryColor}40` }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-10 pt-2 px-2 snap-x scrollbar-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bookings.map((booking) => {
          const bPayments = dbPayments.filter(p => p.bookingId === booking.id);
          const advanceAmount = bPayments.reduce((s, p) => s + (p.type === 'Received' ? (Number(p.amount) || 0) : -(Number(p.amount) || 0)), 0) || Number(booking.advance) || 0;
          const bExpenses = dbExpenses.filter(e => e.bookingId === booking.id || e.category === 'Booking');
          
          let expensesAmount = 0;
          if (booking.expenses) { expensesAmount = Number(booking.expenses); } // Fallback
          bExpenses.forEach(e => {
             if (e.bookingId === booking.id) expensesAmount += (Number(e.amount) || 0);
          });

          return (
          <div key={booking.id} className="snap-start shrink-0 w-[85vw] sm:w-[360px]">
            <BookingCard 
              booking={booking} 
              advanceAmount={advanceAmount}
              expensesAmount={expensesAmount}
              primaryColor={primaryColor} 
              secondaryColor={secondaryColor} 
              onPrint={onPrint}
              onView={onView}
              onPayment={onPayment}
            />
          </div>
        )})}
        {bookings.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100 text-gray-400">
            <Icon size={64} className="opacity-10 mb-4" />
            <p className="font-black text-lg uppercase tracking-widest">Database Empty</p>
            <p className="text-sm font-medium">No {title.toLowerCase()} records for the current filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ season, onNewReservation }) => {
  const { organization: org } = useOrganization();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [printingBooking, setPrintingBooking] = useState<Booking | null>(null);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [detailsTab, setDetailsTab] = useState<'details' | 'expenses' | 'accounts'>('details');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dbBookings, setDbBookings] = useState<Booking[]>([]);
  const [dbExpenses, setDbExpenses] = useState<Expense[]>([]);
  const [dbPayments, setDbPayments] = useState<Payment[]>([]);

  const loadData = () => {
    Promise.all([api.getBookings(org.id), api.getExpenses(org.id), api.getPayments(org.id)])
      .then(([b, e, p]) => { setDbBookings(b); setDbExpenses(e); setDbPayments(p); })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [org.id]);

  // Filter Data based on FY Season and Organization
  const filteredBookings = dbBookings.filter(b => b.tenantId === org.id && isInSeason(b.eventDate, season));
  const filteredExpenses = dbExpenses.filter(e => e.tenantId === org.id && isInSeason(e.date, season));

  // KPI Calculations
  const totalBookingsCount = filteredBookings.length;
  const upcomingEventsCount = filteredBookings.filter(b => b.status === 'Upcoming').length;
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (Number(b.rate) || 0), 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const pendingBalance = filteredBookings.reduce((sum, b) => {
    if (b.status === 'Upcoming') {
      const bPayments = dbPayments.filter(p => p.bookingId === b.id);
      const advance = bPayments.reduce((s, p) => s + (p.type === 'Received' ? (Number(p.amount) || 0) : -(Number(p.amount) || 0)), 0) || 0;
      return sum + ((Number(b.rate) || 0) - advance);
    }
    return sum;
  }, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Recent Bookings (Booked most recently)
  const recentBookings = [...filteredBookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  // Upcoming Bookings (Happening soonest)
  const upcomingBookingsList = [...filteredBookings]
    .filter(b => b.status === 'Upcoming')
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 10);

  // Financial Year Breakdown (Q1-Q4)
  const getQuarter = (dateStr: string) => {
    const month = new Date(dateStr).getMonth(); // 0-11
    // FY starts in April (month 3)
    if (month >= 3 && month <= 5) return 0; // Q1: Apr-Jun
    if (month >= 6 && month <= 8) return 1; // Q2: Jul-Sep
    if (month >= 9 && month <= 11) return 2; // Q3: Oct-Dec
    return 3; // Q4: Jan-Mar
  };

  const chartData = [
    { name: 'Q1 (Apr-Jun)', income: 0, expenses: 0, bookings: 0 },
    { name: 'Q2 (Jul-Sep)', income: 0, expenses: 0, bookings: 0 },
    { name: 'Q3 (Oct-Dec)', income: 0, expenses: 0, bookings: 0 },
    { name: 'Q4 (Jan-Mar)', income: 0, expenses: 0, bookings: 0 },
  ];

  filteredBookings.forEach(b => {
    const q = getQuarter(b.eventDate);
    chartData[q].income += b.rate;
    chartData[q].bookings += 1;
  });

  filteredExpenses.forEach(e => {
    const q = getQuarter(e.date);
    chartData[q].expenses += e.amount;
  });

  const handlePrint = (booking: Booking) => {
    setPrintingBooking(booking);
    setTimeout(() => {
      window.focus();
      window.print();
      setPrintingBooking(null);
    }, 200);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <LayoutDashboard size={40} style={{ color: org.primary_color }} /> Season {season}
          </h1>
        </div>
        <button 
          onClick={onNewReservation}
          className="w-full md:w-auto text-white px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
          style={{ backgroundColor: org.primary_color, boxShadow: `0 20px 40px -10px ${org.primary_color}60` }}
        >
          <Plus size={20} /> Reservation
        </button>
      </div>

      {/* Primary KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Bookings" value={totalBookingsCount} icon={<LayoutDashboard size={20} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Today & Upcoming" value={upcomingEventsCount} icon={<Clock size={20} className="text-purple-600" />} color="bg-purple-50" />
        <StatCard title="Pending" value={formatCurrency(pendingBalance)} icon={<Banknote size={20} className="text-orange-600" />} color="bg-orange-50" />
        <StatCard title="Revenue" value={formatCurrency(totalRevenue)} icon={<IndianRupee size={20} className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Expenses" value={formatCurrency(totalExpenses)} icon={<Receipt size={20} className="text-red-600" />} color="bg-red-50" />
        <StatCard title="Net Profit" value={formatCurrency(netProfit)} icon={<TrendingUp size={20} className="text-emerald-600" />} color="bg-emerald-50" />
      </div>

      {/* Recent Bookings Section */}
      <ScrollableSection 
        title="Recent Activity" 
        count={recentBookings.length} 
        icon={History} 
        bookings={recentBookings} 
        dbPayments={dbPayments}
        dbExpenses={dbExpenses}
        primaryColor={org.primary_color} 
        secondaryColor={org.secondary_color}
        onPrint={handlePrint}
        onView={(b, tab) => {
          setSelectedBookingForDetails(b);
          setDetailsTab(tab);
        }}
        onPayment={(b) => setSelectedBookingForPayment(b)}
      />

      {/* Upcoming Bookings Section */}
      <ScrollableSection 
        title="Upcoming Events" 
        count={upcomingBookingsList.length} 
        icon={CalendarClock} 
        bookings={upcomingBookingsList} 
        dbPayments={dbPayments}
        dbExpenses={dbExpenses}
        primaryColor={org.primary_color} 
        secondaryColor={org.secondary_color}
        onPrint={handlePrint}
        onView={(b, tab) => {
          setSelectedBookingForDetails(b);
          setDetailsTab(tab);
        }}
        onPayment={(b) => setSelectedBookingForPayment(b)}
      />

      {/* Seasonal Trends - Bar Chart with 3 metrics */}
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4">
              <TrendingUp size={32} className="text-emerald-600" /> Quarterly Performance
            </h3>
            <p className="text-xs font-black text-gray-400 mt-2 uppercase tracking-widest">Financial metrics comparison across quarters</p>
          </div>
          <div className="hidden lg:flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: org.primary_color }}></div>
                <span className="text-[10px] font-black uppercase text-gray-400">Income</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-[10px] font-black uppercase text-gray-400">Expenses</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black uppercase text-gray-400">Bookings</span>
             </div>
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={12}
            >
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 900, fill: '#94a3b8' }} 
                dy={15}
              />
              {/* Financial Y-Axis (Left) */}
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                tickFormatter={(val) => `₹${val/1000}k`}
                dx={-10}
              />
              {/* Bookings Y-Axis (Right) */}
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                dx={10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '24px', 
                  border: 'none', 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                  padding: '16px'
                }}
                cursor={{ fill: '#f8fafc', radius: 12 }}
                formatter={(value, name) => {
                  if (name === 'bookings') return [value, 'Total Bookings'];
                  return [formatCurrency(value as number), name === 'income' ? 'Gross Income' : 'Total Expenses'];
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={48} 
                iconType="circle" 
                wrapperStyle={{ paddingBottom: '20px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} 
              />
              
              <Bar 
                yAxisId="left" 
                dataKey="income" 
                fill={org.primary_color} 
                radius={[8, 8, 0, 0]} 
                barSize={32} 
                name="Income"
              />
              <Bar 
                yAxisId="left" 
                dataKey="expenses" 
                fill="#f43f5e" 
                radius={[8, 8, 0, 0]} 
                barSize={32} 
                name="Expenses"
              />
              <Bar 
                yAxisId="right" 
                dataKey="bookings" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]} 
                barSize={32} 
                name="Bookings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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

      {printingBooking && (
        (() => {
          const bPayments = dbPayments.filter(p => p.bookingId === printingBooking.id);
          const advance = bPayments.reduce((s, p) => s + (p.type === 'Received' ? (Number(p.amount) || 0) : -(Number(p.amount) || 0)), 0) || Number(printingBooking.advance) || 0;
          return (
            <PrintableReservation 
              formData={printingBooking} 
              org={org}
              subtotal={Number(printingBooking.rate) || 0} // Simplified for existing bookings
              totalRate={Number(printingBooking.rate) || 0}
              balanceDue={(Number(printingBooking.rate) || 0) - advance}
              advancePaid={advance}
            />
          );
        })()
      )}
    </div>
  );
};
