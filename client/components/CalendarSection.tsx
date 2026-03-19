import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Info,
  Clock,
  Download,
  Filter,
  FileText,
  FileSpreadsheet,
  CalendarRange,
  User,
  Phone,
  MapPin,
  PartyPopper,
  Users,
  IndianRupee,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { useOrganization } from '../contexts/OrganizationContext';
import { isInSeason, formatDate, formatCurrency } from '../lib/utils';
import { BookingStatus, Booking } from '../types';
import { BookingCard } from './ui/BookingCard';
import { PrintCalendarButton } from './ActionButtons/PrintCalendarButton';
import { 
  format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  startOfQuarter, endOfQuarter, startOfYear, endOfYear, eachDayOfInterval, 
  isSameDay, isWithinInterval, parseISO, addWeeks, subWeeks, addMonths, subMonths,
  addQuarters, subQuarters, addYears, subYears, getDay
} from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface CalendarSectionProps {
  season: string;
  onNewReservation: () => void;
}

type ViewType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export const CalendarSection: React.FC<CalendarSectionProps> = ({ season, onNewReservation }) => {
  const { organization: org } = useOrganization();
  const [dbBookings, setDbBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.getBookings(org.id).then(setDbBookings).catch(console.error);
  }, [org.id, season]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');
  const [customStartDate, setCustomStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
        setShowDownloads(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { startDate, endDate } = useMemo(() => {
    switch (viewType) {
      case 'day':
        return { startDate: currentDate, endDate: currentDate };
      case 'week':
        return { startDate: startOfWeek(currentDate), endDate: endOfWeek(currentDate) };
      case 'month':
        return { startDate: startOfMonth(currentDate), endDate: endOfMonth(currentDate) };
      case 'quarter':
        return { startDate: startOfQuarter(currentDate), endDate: endOfQuarter(currentDate) };
      case 'year':
        return { startDate: startOfYear(currentDate), endDate: endOfYear(currentDate) };
      case 'custom':
        return { startDate: parseISO(customStartDate), endDate: parseISO(customEndDate) };
      default:
        return { startDate: startOfMonth(currentDate), endDate: endOfMonth(currentDate) };
    }
  }, [currentDate, viewType, customStartDate, customEndDate]);

  const daysInView = useMemo(() => {
    try {
      return eachDayOfInterval({ start: startDate, end: endDate });
    } catch (e) {
      return [];
    }
  }, [startDate, endDate]);

  const navigatePrev = () => {
    switch (viewType) {
      case 'day': setCurrentDate(subDays(currentDate, 1)); break;
      case 'week': setCurrentDate(subWeeks(currentDate, 1)); break;
      case 'month': setCurrentDate(subMonths(currentDate, 1)); break;
      case 'quarter': setCurrentDate(subQuarters(currentDate, 1)); break;
      case 'year': setCurrentDate(subYears(currentDate, 1)); break;
      case 'custom':
        const diff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        setCustomStartDate(format(subDays(parseISO(customStartDate), diff + 1), 'yyyy-MM-dd'));
        setCustomEndDate(format(subDays(parseISO(customEndDate), diff + 1), 'yyyy-MM-dd'));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewType) {
      case 'day': setCurrentDate(addDays(currentDate, 1)); break;
      case 'week': setCurrentDate(addWeeks(currentDate, 1)); break;
      case 'month': setCurrentDate(addMonths(currentDate, 1)); break;
      case 'quarter': setCurrentDate(addQuarters(currentDate, 1)); break;
      case 'year': setCurrentDate(addYears(currentDate, 1)); break;
      case 'custom':
        const diff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        setCustomStartDate(format(addDays(parseISO(customStartDate), diff + 1), 'yyyy-MM-dd'));
        setCustomEndDate(format(addDays(parseISO(customEndDate), diff + 1), 'yyyy-MM-dd'));
        break;
    }
  };

  const getBookingsForDateRange = () => {
    return dbBookings.filter(b => {
      if (b.tenantId !== org.id || !isInSeason(b.eventDate, season)) return false;
      const eventDate = parseISO(b.eventDate);
      return isWithinInterval(eventDate, { start: startDate, end: endDate });
    });
  };

  const filteredBookings = getBookingsForDateRange();

  const getBookingsForDay = (day: Date) => {
    return filteredBookings.filter(b => isSameDay(parseISO(b.eventDate), day));
  };

  const getEventStyles = (status: BookingStatus) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Completed': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Cancelled': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getEventDot = (status: BookingStatus) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-500';
      case 'Completed': return 'bg-emerald-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Calendar Events (${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')})`, 14, 15);
    
    const tableData = filteredBookings.map(b => [
      format(parseISO(b.eventDate), 'MMM d, yyyy'),
      b.clientName,
      b.eventType,
      b.status,
      `Rs. ${b.rate.toLocaleString()}`
    ]);

    autoTable(doc, {
      head: [['Date', 'Customer', 'Event Type', 'Status', 'Amount']],
      body: tableData,
      startY: 20,
    });

    doc.save(`calendar_events_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}.pdf`);
    setShowDownloads(false);
  };

  const exportToExcel = () => {
    const data = filteredBookings.map(b => ({
      Date: format(parseISO(b.eventDate), 'MMM d, yyyy'),
      Customer: b.clientName,
      'Event Type': b.eventType,
      Status: b.status,
      Amount: b.rate
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Events");
    XLSX.writeFile(wb, `calendar_events_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}.xlsx`);
    setShowDownloads(false);
  };

  const renderDateHeader = () => {
    if (viewType === 'day') return format(currentDate, 'MMMM d, yyyy');
    if (viewType === 'week') return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    if (viewType === 'month') return format(currentDate, 'MMMM yyyy');
    if (viewType === 'quarter') return `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${format(currentDate, 'yyyy')}`;
    if (viewType === 'year') return format(currentDate, 'yyyy');
    return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const renderCalendarGrid = () => {
    if (viewType === 'month') {
      const startDay = getDay(startDate);
      const paddingArray = Array.from({ length: startDay }, (_, i) => null);
      const totalCells = startDay + daysInView.length;
      const endPadding = (7 - (totalCells % 7)) % 7;
      const paddingEndArray = Array.from({ length: endPadding }, (_, i) => null);
      
      return (
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-full">
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 border-l border-gray-100">
              {paddingArray.map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[120px] bg-gray-50/30 border-b border-r border-gray-100"></div>
              ))}
              {daysInView.map((day, idx) => {
                const bookings = getBookingsForDay(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[120px] p-2 transition-all cursor-pointer group relative border-b border-r border-gray-100 ${
                      isSelected ? 'bg-blue-50/50 ring-2 ring-inset ring-blue-500 z-10' : 
                      isToday ? 'bg-blue-50/10 hover:bg-gray-50/50' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                        isSelected ? 'bg-blue-600 text-white shadow-sm' :
                        isToday ? 'bg-blue-100 text-blue-700' : 
                        'text-gray-700 group-hover:text-blue-600'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {bookings.length > 0 && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-500 bg-gray-100'
                        }`}>
                          {bookings.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {bookings.map(b => (
                        <div 
                          key={b.id} 
                          className={`text-[10px] font-medium px-2 py-1 rounded-md border flex items-center gap-1.5 truncate hover:shadow-sm transition-all ${
                            b.shift === 'Night' 
                              ? 'bg-slate-900 border-slate-800 text-white' 
                              : getEventStyles(b.status)
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            b.shift === 'Night' ? 'bg-white' : getEventDot(b.status)
                          }`} />
                          <span className="truncate">{b.clientName.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {paddingEndArray.map((_, i) => (
                <div key={`pad-end-${i}`} className="min-h-[120px] bg-gray-50/30 border-b border-r border-gray-100"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // List view for other modes
    return (
      <div className="p-4 sm:p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {daysInView.map((day, idx) => {
          const bookings = getBookingsForDay(day);
          if (bookings.length === 0 && viewType !== 'day' && viewType !== 'week') return null;
          
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div 
              key={idx} 
              onClick={() => setSelectedDate(day)}
              className={`relative pl-4 sm:pl-6 py-3 cursor-pointer transition-all rounded-xl ${isSelected ? 'bg-blue-50/50 ring-1 ring-blue-100' : 'hover:bg-gray-50/50'}`}
            >
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
              {/* Timeline dot */}
              <div className={`absolute left-[-4px] top-5 w-2 h-2 rounded-full transition-all ${
                isSelected ? 'bg-blue-600 ring-4 ring-blue-100 scale-125' : 
                isToday ? 'bg-blue-600 ring-4 ring-blue-50' : 'bg-gray-300'
              }`}></div>
              
              <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${isSelected ? 'text-blue-800' : isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                {format(day, 'EEEE, MMMM d, yyyy')}
                {isToday && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Today</span>}
              </h4>
              
              {bookings.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No events scheduled.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookings.map(b => (
                    <div key={b.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{b.clientName}</span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getEventStyles(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center shrink-0"><CalendarIcon size={12} className="text-gray-400" /></div>
                          <span className="truncate">{b.eventType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center shrink-0"><span className="text-[10px] font-bold text-gray-400">₹</span></div>
                          <span>{b.rate.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {daysInView.every(day => getBookingsForDay(day).length === 0) && viewType !== 'day' && viewType !== 'week' && (
          <div className="text-center py-16 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon size={24} className="text-gray-300" />
            </div>
            <p className="font-medium text-gray-500">No events found in this period</p>
            <p className="text-sm mt-1">Try adjusting your filters or date range</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="text-amber-600" /> Event Calendar
          </h1>
          <p className="text-gray-500 text-sm font-medium">Availability overview for Season {season}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* View Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter size={16} />
              <span className="capitalize">{viewType} View</span>
            </button>
            
            {showFilters && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Select View</div>
                <div className="space-y-1 p-1">
                  {(['day', 'week', 'month', 'quarter', 'year', 'custom'] as ViewType[]).map(type => (
                    <div key={type}>
                      <button
                        onClick={() => {
                          setViewType(type);
                          if (type !== 'custom') setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${viewType === type ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-gray-700'}`}
                      >
                        {type} View
                      </button>
                      
                      {type === 'custom' && viewType === 'custom' && (
                        <div className="mt-2 mb-1 pt-2 border-t border-gray-100 px-2 space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                            <input 
                              type="date" 
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                            <input 
                              type="date" 
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                            />
                          </div>
                          <button 
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm font-bold hover:bg-gray-800"
                          >
                            Apply Range
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex-1 lg:flex-none">
            <button onClick={navigatePrev} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 shrink-0">
              <ChevronLeft size={18} />
            </button>
            <span className="px-2 sm:px-4 font-black text-gray-800 min-w-[140px] text-center truncate text-sm">
              {renderDateHeader()}
            </span>
            <button onClick={navigateNext} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-500 shrink-0">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <PrintCalendarButton onClick={() => window.print()} />
          
          {/* Download Dropdown */}
          <div className="relative" ref={downloadRef}>
            <button 
              onClick={() => setShowDownloads(!showDownloads)}
              className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              title="Download Report"
            >
              <Download size={18} />
            </button>
            
            {showDownloads && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Export As</div>
                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors"
                >
                  <FileText size={16} /> PDF Document
                </button>
                <button
                  onClick={exportToExcel}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors"
                >
                  <FileSpreadsheet size={16} /> Excel Spreadsheet
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={onNewReservation}
            className="flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 whitespace-nowrap"
            style={{ backgroundColor: org.primary_color, boxShadow: `0 8px 15px -3px ${org.primary_color}40` }}
          >
            <Plus size={18} /> Reservation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid / List */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {renderCalendarGrid()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-4 lg:h-fit">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CalendarIcon size={16} className="text-blue-500" /> 
              {isSameDay(selectedDate, new Date()) ? 'Events Today' : format(selectedDate, 'MMM d, yyyy')}
            </h3>
            
            <div className="space-y-4">
              {getBookingsForDay(selectedDate).length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <CalendarIcon size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">No events scheduled</p>
                </div>
              ) : (
                getBookingsForDay(selectedDate).map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    primaryColor={org.primary_color} 
                    secondaryColor={org.secondary_color} 
                  />
                ))
              )}
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 space-y-4">
             <div className="flex items-center gap-3 text-amber-800">
                <Clock size={24} />
                <h3 className="font-black">Period Summary</h3>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-amber-700">Total Events</span>
                  <span className="text-amber-900">{filteredBookings.length}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-amber-700">Upcoming</span>
                  <span className="text-blue-600">{filteredBookings.filter(b => b.status === 'Upcoming').length}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-amber-700">Completed</span>
                  <span className="text-emerald-600">{filteredBookings.filter(b => b.status === 'Completed').length}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
