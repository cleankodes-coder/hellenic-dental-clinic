import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  Eye, 
  Edit3, 
  RotateCcw,
  RefreshCw,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { Booking, BookingStatus, Doctor, ServiceItem } from '../../types/index.ts';

export const PortalAppointments: React.FC = () => {
  const { currentUser, refreshTrigger, triggerRefresh } = usePortal();
  const [searchParams] = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Reschedule Form
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Reception notes input inside detail modal
  const [receptionNotes, setReceptionNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');

  // New Booking Form State
  const [newDoctorId, setNewDoctorId] = useState('');
  const [newServiceId, setNewServiceId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00');
  const [newPatientName, setNewPatientName] = useState('Fictional Patient');
  const [newPatientEmail, setNewPatientEmail] = useState('patient@example.com');
  const [newPatientPhone, setNewPatientPhone] = useState('+971 50 999 8877');
  const [newNotes, setNewNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'all') q.set('status', statusFilter);
      if (doctorFilter !== 'all') q.set('doctorId', doctorFilter);
      if (searchQuery) q.set('search', searchQuery);

      const [bookRes, docRes, srvRes] = await Promise.all([
        fetch(`/api/bookings?${q.toString()}`),
        fetch('/api/doctors'),
        fetch('/api/services/all')
      ]);

      const b = await bookRes.json();
      const d = await docRes.json();
      const s = await srvRes.json();

      setBookings(b);
      setDoctors(d);
      setServices(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, doctorFilter, searchQuery, refreshTrigger]);

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        },
        body: JSON.stringify({
          status: newStatus,
          receptionNotes: receptionNotes || undefined,
          cancellationReason: cancellationReason || undefined
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update booking status');
      }

      const updated = await res.json();
      setSelectedBooking(updated);
      triggerRefresh();
      if (newStatus === 'Cancelled' || newStatus === 'Confirmed' || newStatus === 'Rejected') {
        setIsDetailOpen(false);
      }
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleTime) {
      setActionError('Please specify date and time');
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        },
        body: JSON.stringify({
          newDate: rescheduleDate,
          newStartTime: rescheduleTime,
          newDoctorId: rescheduleDoctorId || selectedBooking.doctorId
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Reschedule rejected due to conflict');
      }

      const updated = await res.json();
      setSelectedBooking(updated);
      setIsRescheduleOpen(false);
      triggerRefresh();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorId || !newServiceId || !newDate || !newTime || !newPatientName) {
      setActionError('Please fill in all required fields');
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: newDoctorId,
          serviceId: newServiceId,
          date: newDate,
          startTime: newTime,
          patientName: newPatientName,
          patientEmail: newPatientEmail,
          patientPhone: newPatientPhone,
          patientNotes: newNotes,
          source: 'portal'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Server rejected creation');
      }

      setIsNewBookingOpen(false);
      triggerRefresh();
    } catch (err: any) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openDetail = (b: Booking) => {
    setSelectedBooking(b);
    setReceptionNotes(b.receptionNotes || '');
    setCancellationReason(b.cancellationReason || '');
    setActionError(null);
    setIsDetailOpen(true);
  };

  const openReschedule = (b: Booking) => {
    setSelectedBooking(b);
    setRescheduleDate(b.date);
    setRescheduleTime(b.startTime);
    setRescheduleDoctorId(b.doctorId);
    setActionError(null);
    setIsRescheduleOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Appointment Scheduling &amp; Intake
          </h1>
          <p className="text-xs text-slate-500">
            Real-time management of synthetic bookings, slot locks, and reception confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setNewDoctorId(doctors[0]?.id || '');
              setNewServiceId(services[0]?.id || '');
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              setNewDate(tomorrow.toISOString().split('T')[0]);
              setActionError(null);
              setIsNewBookingOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Demo Booking</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 text-xs">
            {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#14294A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>

          {/* Doctor Dropdown */}
          <select
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none"
          >
            <option value="all">All Doctors</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref, patient, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Ref #</th>
                <th className="py-3.5 px-4">Patient Details</th>
                <th className="py-3.5 px-4">Specialist &amp; Service</th>
                <th className="py-3.5 px-4">Scheduled Time</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                    {b.reference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{b.patientName}</span>
                    <span className="text-[11px] text-slate-400 block">{b.patientPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-800 block">{b.doctorName}</span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[200px]">{b.serviceName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{b.date}</span>
                    <span className="text-[11px] text-slate-500 font-mono block">{b.startTime} – {b.endTime}</span>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-600">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                      {b.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      b.status === 'Pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      b.status === 'Completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      b.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {b.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openDetail(b)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px]"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => openReschedule(b)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px]"
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching booking records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {isDetailOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">BOOKING RECORD</span>
                <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {selectedBooking.reference}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedBooking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                selectedBooking.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {actionError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold">Patient Information</span>
                <p className="font-bold text-slate-900 text-sm">{selectedBooking.patientName}</p>
                <p className="text-slate-600">{selectedBooking.patientEmail} • {selectedBooking.patientPhone}</p>
                {selectedBooking.patientNotes && (
                  <p className="text-slate-500 italic pt-1">&ldquo;{selectedBooking.patientNotes}&rdquo;</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-semibold">Specialist</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedBooking.doctorName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-semibold">Service</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedBooking.serviceName}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-semibold">Scheduled Date &amp; Time</span>
                <span className="font-bold text-slate-900 text-sm">{selectedBooking.date} at {selectedBooking.startTime} – {selectedBooking.endTime} (Dubai GST)</span>
              </div>

              {/* Reception Notes Input */}
              <div className="space-y-1 pt-1">
                <label className="block text-slate-700 font-bold">Reception Staff Notes</label>
                <textarea
                  rows={2}
                  value={receptionNotes}
                  onChange={e => setReceptionNotes(e.target.value)}
                  placeholder="Add internal reception notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                {selectedBooking.status === 'Pending' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Confirmed')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Confirm Appointment
                  </button>
                )}

                {selectedBooking.status === 'Confirmed' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Completed')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Mark Completed
                  </button>
                )}

                {selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-red-600 font-bold rounded-xl"
                  >
                    Cancel Booking
                  </button>
                )}

                {selectedBooking.status === 'Confirmed' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'No-show')}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100 font-semibold rounded-xl"
                  >
                    No-Show
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {isRescheduleOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">RESCHEDULING ENGINE</span>
              <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Reschedule {selectedBooking.reference}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Authoritative conflict check will be performed on new slot.</p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {actionError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Specialist</label>
                <select
                  value={rescheduleDoctorId}
                  onChange={e => setRescheduleDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Calendar Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Start Time (HH:mm)</label>
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRescheduleOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRescheduleSubmit}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                {actionLoading ? 'Validating...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW DEMO BOOKING MODAL */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewBooking} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">INTAKE CREATION</span>
              <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Create Fictional Appointment
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Direct reception entry with server validation.</p>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {actionError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor</label>
                  <select
                    value={newDoctorId}
                    onChange={e => setNewDoctorId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service</label>
                  <select
                    value={newServiceId}
                    onChange={e => setNewServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPatientPhone}
                    onChange={e => setNewPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newPatientEmail}
                  onChange={e => setNewPatientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewBookingOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                {actionLoading ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
