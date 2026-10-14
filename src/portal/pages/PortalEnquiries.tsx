import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, CheckCircle2, Clock, Eye, Save } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { Enquiry } from '../../types/index.ts';

export const PortalEnquiries: React.FC = () => {
  const { currentUser, refreshTrigger, triggerRefresh } = usePortal();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Enquiry['status']>('New');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (statusFilter !== 'all') q.set('status', statusFilter);
        if (search) q.set('search', search);

        const res = await fetch(`/api/enquiries?${q.toString()}`);
        const data = await res.json();
        setEnquiries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter, search, refreshTrigger]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        setSelectedEnquiry(null);
        triggerRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Patient Enquiries &amp; Triage
          </h1>
          <p className="text-xs text-slate-500">
            Messages recorded via public website contact forms for demonstration.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Badge: SIMULATED ENQUIRIES
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'New', 'In Review', 'Resolved', 'Archived'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === st ? 'bg-[#14294A] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Message Preview</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {enquiries.map(enq => (
                <tr key={enq.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {enq.name}
                    <span className="block text-[11px] font-normal text-slate-400">{enq.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {enq.subject}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {enq.message}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      enq.status === 'New' ? 'bg-amber-100 text-amber-800' :
                      enq.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEnquiry(enq);
                        setStatus(enq.status);
                        setNotes(enq.notes || '');
                      }}
                      className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}

              {enquiries.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No matching enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Enquiry Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Review Enquiry</h3>
              <span className="text-xs font-mono text-slate-400">{selectedEnquiry.id}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold">From: {selectedEnquiry.name}</span>
                <p className="text-slate-600">{selectedEnquiry.email} {selectedEnquiry.phone ? '• ' + selectedEnquiry.phone : ''}</p>
                <p className="font-semibold text-slate-800 pt-1">Subject: {selectedEnquiry.subject}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Notes on triage or referral..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
