import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Sparkles, PieChart as PieIcon } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';

export const PortalAnalytics: React.FC = () => {
  const { refreshTrigger } = usePortal();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/dashboard')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Transform data for charts
  const statusChartData = Object.entries(metrics.statusCounts || {}).map(([name, value]) => ({
    name,
    count: value
  }));

  const sourceChartData = Object.entries(metrics.sourceBreakdown || {}).map(([name, value]) => ({
    name: name === 'ai_concierge' ? 'AI Concierge' : name.charAt(0).toUpperCase() + name.slice(1),
    count: value
  }));

  const doctorChartData = (metrics.doctorUtilization || []).map((doc: any) => ({
    name: doc.name.replace('Dr. ', ''),
    Bookings: doc.totalBookings
  }));

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#64748B'];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Operational Intelligence &amp; Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time reporting generated from synthetic demo records.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>SYNTHETIC DEMO ANALYTICS — NO LIVE CLINIC PATIENT METRICS</span>
        </div>
      </div>

      {/* Row 1: Doctor Utilization Bar Chart + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doctor Utilization */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Doctor Workload &amp; Scheduled Utilization
            </h3>
            <p className="text-xs text-slate-400">Total appointments per doctor in synthetic database</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Bookings" fill="#1762B2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Appointment Status Breakdown
            </h3>
            <p className="text-xs text-slate-400">Pending vs Confirmed vs Completed vs Cancelled</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Popular Treatments & Inbound Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Treatments */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Top In-Demand Clinical Treatments
            </h3>
            <p className="text-xs text-slate-400">Most requested treatments</p>
          </div>

          <div className="space-y-3 pt-2">
            {metrics.popularServices?.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {item.count} bookings
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inbound Booking Channels */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Inbound Acquisition Channels
            </h3>
            <p className="text-xs text-slate-400">Origin of demo booking requests</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceChartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
