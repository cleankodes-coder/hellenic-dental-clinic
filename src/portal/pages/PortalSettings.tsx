import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { ClinicSettings } from '../../types/index.ts';

export const PortalSettings: React.FC = () => {
  const { currentUser, triggerRefresh } = usePortal();
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaveStatus('Saving settings...');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to update settings');

      setSaveStatus('Operational settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 2500);
      triggerRefresh();
    } catch (e: any) {
      setSaveStatus('Error: ' + e.message);
    }
  };

  const handleResetData = async () => {
    setSaveStatus('Resetting synthetic demo data...');
    try {
      const res = await fetch('/api/portal/reset-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        }
      });
      if (!res.ok) throw new Error('Reset failed');

      setSaveStatus('Synthetic demo database reset to pristine initial state!');
      setResetConfirmOpen(false);
      setTimeout(() => setSaveStatus(null), 3000);
      triggerRefresh();
    } catch (e: any) {
      setSaveStatus('Error: ' + e.message);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Operational Settings &amp; Scheduling Parameters
          </h1>
          <p className="text-xs text-slate-500">
            Control clinic opening hours, slot hold limits, and test data maintenance.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Admin Control Plane
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 rounded-xl">
          {saveStatus}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Scheduling Rules */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] border-b border-slate-100 pb-2">
            Scheduling &amp; Provisional Slot Lock Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Provisional Hold Duration (Minutes)
              </label>
              <input
                type="number"
                value={settings.holdDurationMinutes}
                onChange={e => setSettings({ ...settings, holdDurationMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Time a selected slot remains locked to prevent race conditions</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Minimum Advance Lead Time (Hours)
              </label>
              <input
                type="number"
                value={settings.minimumLeadHours}
                onChange={e => setSettings({ ...settings, minimumLeadHours: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Minimum hours notice required before an appointment</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Calendar Step Increment (Minutes)
              </label>
              <input
                type="number"
                value={settings.slotStepMinutes}
                onChange={e => setSettings({ ...settings, slotStepMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Default slot interval granularity (15m, 30m)</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Simulated Notification Badge
              </label>
              <input
                type="text"
                disabled
                value="Enforced (SIMULATED — NOT SENT)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-semibold"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Statutory compliance requirement</span>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] border-b border-slate-100 pb-2">
            Published Clinic Operating Hours (Dubai Local)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monday – Friday</label>
              <input
                type="text"
                value={settings.clinicHours.weekday}
                onChange={e => setSettings({ ...settings, clinicHours: { ...settings.clinicHours, weekday: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Saturday</label>
              <input
                type="text"
                value={settings.clinicHours.saturday}
                onChange={e => setSettings({ ...settings, clinicHours: { ...settings.clinicHours, saturday: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sunday</label>
              <input
                type="text"
                value={settings.clinicHours.sunday}
                onChange={e => setSettings({ ...settings, clinicHours: { ...settings.clinicHours, sunday: e.target.value } })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Operational Rules</span>
          </button>
        </div>
      </form>

      {/* Controlled Demo Data Reset Card */}
      <div className="bg-red-50/60 rounded-3xl p-6 sm:p-8 border border-red-200/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-red-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Controlled Demo Data Reset
            </h3>
            <p className="text-xs text-red-700">
              Restore synthetic appointments, slot locks, enquiries, and notifications to default baseline.
            </p>
          </div>
        </div>

        <p className="text-xs text-red-800 leading-relaxed">
          Use this function during stakeholder evaluations or demonstrations to clear test submissions and recalculate clean slot availability around the current Dubai date.
        </p>

        {resetConfirmOpen ? (
          <div className="p-4 bg-white rounded-2xl border border-red-200 space-y-3 text-xs">
            <p className="font-bold text-red-900">Are you sure you want to reset all synthetic records to default seed state?</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Yes, Reset All Demo Records
              </button>
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Synthetic Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
