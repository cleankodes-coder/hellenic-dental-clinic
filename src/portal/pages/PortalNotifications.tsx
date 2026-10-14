import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Phone, Mail, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { NotificationRecord } from '../../types/index.ts';

export const PortalNotifications: React.FC = () => {
  const { refreshTrigger } = usePortal();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Simulated Notification Dispatch Audit
          </h1>
          <p className="text-xs text-slate-500">
            Log of customer confirmation, rejection, and rescheduling notifications.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>STATUTORY NOTICE: ALL MESSAGES ARE SIMULATED — NOT SENT</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    notif.channel === 'SMS' ? 'bg-blue-100 text-blue-800' :
                    notif.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {notif.channel}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                </div>

                <span className="inline-block text-[10px] font-extrabold text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded border border-amber-300 font-mono">
                  {notif.statusText}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                {notif.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Recipient: {notif.recipient}</span>
                <span>Timestamp: {new Date(notif.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}

          {notifications.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No simulated notifications recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
