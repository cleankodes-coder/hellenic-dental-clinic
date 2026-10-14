import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Filter, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { Booking, Doctor } from '../../types/index.ts';

type CalendarViewMode = 'day' | 'week' | 'month';

export const PortalCalendar: React.FC = () => {
  const { currentUser, refreshTrigger } = usePortal();
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [docRes, bookRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/bookings')
        ]);
        const d = await docRes.json();
        const b = await bookRes.json();
        setDoctors(d);
        setBookings(b);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [refreshTrigger]);

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const formatDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Get current week days (Mon to Sun)
  const getWeekDays = (baseDate: Date): Date[] => {
    const curr = new Date(baseDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(curr.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDays = getWeekDays(currentDate);

  const filteredBookings = bookings.filter(b => {
    if (doctorFilter !== 'all' && b.doctorId !== doctorFilter) return false;
    return true;
  });

  const timeHours = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
    '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Calendar Toolbar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Doctor Filter */}
          <select
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Specialists</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'day' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'week' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR BODY */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 text-center">
            <div className="py-3 border-r border-slate-200 text-[11px] text-slate-400">Time (GST)</div>
            {weekDays.map((d, i) => {
              const isToday = formatDateStr(d) === formatDateStr(new Date());
              return (
                <div 
                  key={i} 
                  className={`py-3 px-2 border-r last:border-r-0 border-slate-200 ${
                    isToday ? 'bg-blue-50 text-blue-800' : ''
                  }`}
                >
                  <span className="block text-[11px] uppercase tracking-wider">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className={`inline-block text-sm font-extrabold mt-0.5 ${
                    isToday ? 'w-6 h-6 rounded-full bg-blue-600 text-white leading-6 mx-auto' : 'text-slate-900'
                  }`}>
                    {d.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="divide-y divide-slate-100 max-h-[680px] overflow-y-auto">
            {timeHours.map((hourStr, idx) => (
              <div key={idx} className="grid grid-cols-8 min-h-[58px] text-xs">
                {/* Time Column */}
                <div className="p-2 border-r border-slate-200 text-[11px] font-mono text-slate-400 text-right pr-3 bg-slate-50/50 shrink-0">
                  {hourStr}
                </div>

                {/* 7 Days Columns */}
                {weekDays.map((dayDate, dayIdx) => {
                  const dayStr = formatDateStr(dayDate);
                  // Find bookings matching this day & hour
                  const cellBookings = filteredBookings.filter(b => 
                    b.date === dayStr && 
                    b.startTime.startsWith(hourStr.slice(0, 2)) &&
                    b.status !== 'Cancelled'
                  );

                  return (
                    <div 
                      key={dayIdx} 
                      className="p-1 border-r last:border-r-0 border-slate-100 relative hover:bg-slate-50/80 transition-colors"
                    >
                      {cellBookings.map(b => (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBooking(b)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:scale-102 shadow-2xs mb-1 ${
                            b.status === 'Confirmed'
                              ? 'bg-blue-600 text-white border border-blue-700'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{b.startTime}</span>
                            <span className="font-mono text-[9px] opacity-80">{b.reference}</span>
                          </div>
                          <p className="truncate mt-0.5">{b.patientName}</p>
                          <p className="truncate text-[9px] opacity-80">{b.doctorName.split(' ')[1] || b.doctorName}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Schedule for {formatDateStr(currentDate)}
            </h3>
            <span className="text-xs text-slate-500 font-mono">Dubai Local Working Hours</span>
          </div>

          <div className="space-y-3">
            {filteredBookings
              .filter(b => b.date === formatDateStr(currentDate) && b.status !== 'Cancelled')
              .map(b => (
                <div 
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {b.startTime} – {b.endTime}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{b.patientName}</span>
                      <span className="text-xs text-slate-400 font-mono">({b.reference})</span>
                    </div>
                    <p className="text-xs text-slate-600">{b.serviceName} with Dr. {b.doctorName}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}

            {filteredBookings.filter(b => b.date === formatDateStr(currentDate) && b.status !== 'Cancelled').length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No active bookings scheduled on this date.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div className="text-xs text-slate-500 pb-2">
            Click any appointment card in the monthly calendar to inspect details and verify room allocations.
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => (
              <div key={idx} className="p-2 text-center text-xs font-bold text-slate-400 uppercase">
                {dayName}
              </div>
            ))}
            {/* Display 28-35 days */}
            {Array.from({ length: 35 }).map((_, idx) => {
              const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), idx - 2);
              const dateStr = formatDateStr(d);
              const dayBookings = filteredBookings.filter(b => b.date === dateStr && b.status !== 'Cancelled');

              return (
                <div 
                  key={idx}
                  className="min-h-[90px] p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-700">{d.getDate()}</span>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 2).map(b => (
                      <div 
                        key={b.id} 
                        onClick={() => setSelectedBooking(b)}
                        className="text-[9px] p-1 rounded bg-blue-100 text-blue-900 font-bold truncate cursor-pointer hover:bg-blue-200"
                      >
                        {b.startTime} {b.patientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-semibold block">
                        +{dayBookings.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BOOKING DETAIL POPUP */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">CALENDAR SLOT INSPECTION</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedBooking.reference}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedBooking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-semibold">Patient:</span>
                <p className="font-bold text-slate-900 text-sm">{selectedBooking.patientName}</p>
                <p className="text-slate-500">{selectedBooking.patientPhone} • {selectedBooking.patientEmail}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block font-semibold">Scheduled Appointment:</span>
                <p className="font-bold text-slate-900">{selectedBooking.serviceName}</p>
                <p className="text-blue-700 font-semibold">{selectedBooking.doctorName}</p>
                <p className="text-slate-600 font-mono pt-1">{selectedBooking.date} at {selectedBooking.startTime} – {selectedBooking.endTime}</p>
              </div>

              {selectedBooking.receptionNotes && (
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <span className="text-slate-400 block font-semibold">Reception Notes:</span>
                  <p className="italic">{selectedBooking.receptionNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
