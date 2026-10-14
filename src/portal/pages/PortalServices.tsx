import React, { useState, useEffect } from 'react';
import { Stethoscope, Edit3, Clock, CheckCircle2, Save, X, Sparkles } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { ServiceCategory, ServiceItem, Doctor } from '../../types/index.ts';

export const PortalServices: React.FC = () => {
  const { currentUser, refreshTrigger, triggerRefresh } = usePortal();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<(ServiceItem & { categoryId: string }) | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, docRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/doctors')
        ]);
        const cats = await catRes.json();
        const docs = await docRes.json();
        setCategories(cats);
        setDoctors(docs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshTrigger]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSaveStatus('Saving changes to treatment catalog...');
    try {
      const res = await fetch(`/api/services/${editingService.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-actor-name': currentUser.name
        },
        body: JSON.stringify(editingService)
      });

      if (!res.ok) throw new Error('Failed to update service');

      setSaveStatus('Treatment catalog updated successfully!');
      setTimeout(() => setSaveStatus(null), 2500);
      setEditingService(null);
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
            Treatment &amp; Procedure Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Manage published clinical categories, procedural step descriptions, demo durations, and doctor assignments.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          6 Clinical Categories • Strict No-Invented-Pricing Policy
        </div>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 rounded-xl">
          {saveStatus}
        </div>
      )}

      {/* Categories & Services Accordion / List */}
      <div className="space-y-8">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">CATEGORY</span>
                <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500">{cat.tagline}</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {cat.services.length} Procedures
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.services.map(s => (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                      <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        ~{s.durationMinutes}m
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.shortDescription}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {s.compatibleDoctorIds.length} Assigned Doctors
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingService({ ...s, categoryId: cat.id })}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">TREATMENT EDIT</span>
                <h3 className="text-xl font-bold text-slate-900">{editingService.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Duration (mins)</label>
                  <input
                    type="number"
                    value={editingService.durationMinutes}
                    onChange={e => setEditingService({ ...editingService, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pricing Notice</label>
                  <input
                    type="text"
                    disabled
                    value="Bespoke upon clinical exam"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Treatment Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  value={editingService.shortDescription}
                  onChange={e => setEditingService({ ...editingService, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Clinical Description</label>
                <textarea
                  rows={4}
                  value={editingService.fullDescription}
                  onChange={e => setEditingService({ ...editingService, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Specialist Doctors</label>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {doctors.map(d => {
                    const isChecked = editingService.compatibleDoctorIds.includes(d.id);
                    return (
                      <label key={d.id} className="flex items-center gap-2 cursor-pointer text-slate-800">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setEditingService({
                                ...editingService,
                                compatibleDoctorIds: [...editingService.compatibleDoctorIds, d.id]
                              });
                            } else {
                              setEditingService({
                                ...editingService,
                                compatibleDoctorIds: editingService.compatibleDoctorIds.filter(id => id !== d.id)
                              });
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{d.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Catalog Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
