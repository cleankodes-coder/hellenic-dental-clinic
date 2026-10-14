import React, { useState } from 'react';
import { Bot, Sparkles, CheckCircle2, Shield, Save, Eye, Power } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';

export const PortalAssistant: React.FC = () => {
  const { currentUser } = usePortal();
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [testing, setTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [topics, setTopics] = useState([
    { id: 'hours', title: 'Clinic Consultation Hours', enabled: true, desc: 'Answers regarding Mon-Fri 09:30-20:00, Sat 09:30-19:00, Sun 11:00-17:00' },
    { id: 'location', title: 'Al Wasl Road Directions & Parking', enabled: true, desc: 'Location near Iranian Hospital and City Walk, valet info' },
    { id: 'doctors', title: 'Doctor Specializations & Bios', enabled: true, desc: 'Bios for Dr. Eleni, Dr. Firas, Dr. Mada, Dr. Majd, Dr. Mohammad Hayem' },
    { id: 'booking', title: 'Demo Booking Step Guidance', enabled: true, desc: 'Explaining how to reserve a slot and receive an HDC reference' },
    { id: 'pricing', title: 'No-Online-Quote Enforcement', enabled: true, desc: 'Explains bespoke consultation pricing and prevents price hallucinations' },
    { id: 'medical', title: 'Strict Medical Diagnosis Refusal', enabled: true, desc: 'Refuses diagnosis, prescriptions, and redirects to clinical consults' },
  ]);

  const toggleTopic = (id: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    setSaveStatus('Topic permissions updated');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    setTesting(true);
    setTestOutput('');

    try {
      const res = await fetch('/api/ai-receptionist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testInput.trim() })
      });
      const data = await res.json();
      setTestOutput(data.reply || 'No response returned');
    } catch (err: any) {
      setTestOutput('Error calling AI receptionist: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Gemini AI Receptionist Knowledge &amp; Guardrails
          </h1>
          <p className="text-xs text-slate-500">
            Configure approved FAQ topics, strict non-diagnostic guardrails, and audit chat behavior.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Model: gemini-3.8-flash (Server-Side)</span>
        </div>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 rounded-xl">
          {saveStatus}
        </div>
      )}

      {/* Grid: Approved Knowledge Topics + Sandbox Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Active Knowledge Modules &amp; Guardrails
            </h3>
            <p className="text-xs text-slate-500">Enable or toggle specific guidance policies</p>
          </div>

          <div className="space-y-3">
            {topics.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{t.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {t.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{t.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTopic(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    t.enabled
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {t.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Playground Sandbox */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Live Receptionist Playground
            </h3>
            <p className="text-xs text-slate-500">Test prompt outputs and strict medical/pricing refusals</p>
          </div>

          <form onSubmit={handleTestChat} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Simulate User Question</label>
              <textarea
                rows={3}
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
                placeholder="e.g. Can you quote me for 6 veneers? Or: Do I need antibiotics for tooth pain?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={testing || !testInput.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold"
              >
                {testing ? 'Processing...' : 'Run Test Prompt'}
              </button>
            </div>
          </form>

          {testOutput && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-blue-600" />
                <span>Model Response:</span>
              </span>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{testOutput}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
