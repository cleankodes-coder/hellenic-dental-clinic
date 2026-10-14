import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Edit3, CheckCircle2, Shield, Clock, Plus, Save, X } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { Doctor } from '../../types/index.ts';
import { hellenicDoctors } from '@/HellenicDoctorsEmbedded.ts';
import { enrichDoctors } from '../../data/doctorsHelper.ts';

export const PortalDoctors: React.FC = () => {
  const { currentUser, refreshTrigger, triggerRefresh } = usePortal();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(enrichDoctors(data));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    setSaveStatus('Saving changes to backend...');
    try {
      const res = await fetch(`/api/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        },
        body: JSON.stringify(editingDoctor)
      });

      if (!res.ok) throw new Error('Failed to update doctor profile');

      setSaveStatus('Profile updated successfully!');
      setTimeout(() => setSaveStatus(null), 2500);
      setEditingDoctor(null);
      triggerRefresh();
    } catch (err: any) {
      setSaveStatus('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Doctor Faculty &amp; Schedule Management
          </h1>
          <p className="text-xs text-slate-500">
            Configure working shifts, active status, specialties, and service compatibility for Hellenic Dental Clinic staff.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          7 Faculty Members • 5 Mapped Portraits
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 rounded-xl">
          {saveStatus}
        </div>
      )}

      {/* Doctors Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-16 h-20 rounded-2xl object-cover bg-slate-900 shrink-0 border border-slate-100 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {doc.status.toUpperCase()}
                    </span>
                    {doc.isAuthenticPortrait && (
                      <span title="Authentic Mapped Photo">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1 truncate">{doc.name}</h3>
                  <p className="text-xs font-semibold text-blue-700 truncate">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{doc.title}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Shift Hours:</span>
                  <span className="font-mono font-bold text-slate-800">{doc.shiftStart} – {doc.shiftEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Working Days:</span>
                  <span className="font-medium text-slate-800">{doc.workingDays.length} Days / Week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slot Interval:</span>
                  <span className="font-mono text-slate-800">{doc.slotIntervalMinutes} mins</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/doctors/${doc.slug}`}
                target="_blank"
                className="text-xs font-semibold text-slate-600 hover:text-blue-700"
              >
                Public Page &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setEditingDoctor({ ...doc })}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">DOCTOR ROSTER EDIT</span>
                <h3 className="text-xl font-bold text-slate-900">{editingDoctor.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingDoctor.status}
                    onChange={e => setEditingDoctor({ ...editingDoctor, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slot Interval (mins)</label>
                  <input
                    type="number"
                    value={editingDoctor.slotIntervalMinutes}
                    onChange={e => setEditingDoctor({ ...editingDoctor, slotIntervalMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Start</label>
                  <input
                    type="time"
                    value={editingDoctor.shiftStart}
                    onChange={e => setEditingDoctor({ ...editingDoctor, shiftStart: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift End</label>
                  <input
                    type="time"
                    value={editingDoctor.shiftEnd}
                    onChange={e => setEditingDoctor({ ...editingDoctor, shiftEnd: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Published Title</label>
                <input
                  type="text"
                  value={editingDoctor.title}
                  onChange={e => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialty</label>
                <input
                  type="text"
                  value={editingDoctor.specialty}
                  onChange={e => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio Summary</label>
                <textarea
                  rows={3}
                  value={editingDoctor.about}
                  onChange={e => setEditingDoctor({ ...editingDoctor, about: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
