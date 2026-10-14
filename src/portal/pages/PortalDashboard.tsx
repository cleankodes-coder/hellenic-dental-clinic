import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Layers, 
  RefreshCw,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { Booking } from '../../types/index.ts';

export const PortalDashboard: React.FC = () => {
  const { currentUser, refreshTrigger, triggerRefresh } = usePortal();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch('/api/portal/dashboard');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, [refreshTrigger]);

  const handleQuickConfirm = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        },
        body: JSON.stringify({
          status: 'Confirmed',
          receptionNotes: `Quick confirmed by ${currentUser.name}`
        })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to confirm booking due to conflict');
      } else {
        triggerRefresh();
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              ROLE: {currentUser.role.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">• Synthetic Demo Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Welcome back, {currentUser.name.split(' (')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Hellenic Dental Clinic Dubai clinical operations dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={triggerRefresh}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
          <Link
            to="/portal/appointments"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Schedule</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{metrics.todayCount}</span>
            <span className="text-xs text-slate-500 ml-2">appointments today</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Active Dubai clinic shifts</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending Requests</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{metrics.pendingCount}</span>
            <span className="text-xs text-slate-500 ml-2">awaiting review</span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            Requires receptionist confirmation
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Confirmed Bookings</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{metrics.confirmedCount}</span>
            <span className="text-xs text-slate-500 ml-2">validated &amp; locked</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {metrics.completedCount} completed sessions
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cancelled / No-Show</span>
            <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{metrics.cancelledCount}</span>
            <span className="text-xs text-slate-500 ml-2">slots released</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Total records: {metrics.totalCount}
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Requests & Doctor Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pending Requests Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Pending Online Requests
              </h3>
              <p className="text-xs text-slate-500">Submitted requests requiring conflict verification &amp; confirmation</p>
            </div>
            <Link to="/portal/appointments?status=Pending" className="text-xs font-bold text-blue-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.pendingRequests?.map((booking: Booking) => (
              <div 
                key={booking.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded">
                      {booking.reference}
                    </span>
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {booking.patientName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">
                    {booking.serviceName} • with <strong>{booking.doctorName}</strong>
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{booking.date} at {booking.startTime} – {booking.endTime}</span>
                    <span>•</span>
                    <span className="capitalize text-slate-600">Via {booking.source}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQuickConfirm(booking.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
                  >
                    Confirm
                  </button>
                  <Link
                    to={`/portal/appointments?search=${booking.reference}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}

            {(!metrics.pendingRequests || metrics.pendingRequests.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No pending requests currently awaiting confirmation.
              </div>
            )}
          </div>
        </div>

        {/* Doctor Workload Breakdown Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Specialist Workload
              </h3>
              <p className="text-xs text-slate-500">Bookings per doctor roster</p>
            </div>
            <Link to="/portal/doctors" className="text-xs font-bold text-blue-700 hover:underline">
              Doctors
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.doctorUtilization?.map((doc: any) => (
              <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{doc.name}</span>
                  <span className="text-[11px] text-slate-500">{doc.specialty}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-700 text-sm block">{doc.totalBookings} booked</span>
                  <span className="text-[10px] text-slate-400">{doc.todayBookings} today</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Log Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Recent Operational Activity Log</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Real-time persistence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {metrics.recentActivity?.map((act: any) => (
            <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">{act.action}</span>
                <span className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-slate-600 line-clamp-2">{act.details}</p>
              <div className="text-[10px] text-slate-400 font-medium pt-0.5">
                Actor: <span className="text-blue-700 font-semibold">{act.actor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
