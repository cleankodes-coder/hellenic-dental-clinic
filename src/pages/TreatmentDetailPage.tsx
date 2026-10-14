import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  UserCheck, 
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ServiceItem, Doctor } from '../types/index.ts';
import { hellenicDoctors } from '@/HellenicDoctorsEmbedded.ts';
import { enrichDoctors } from '../data/doctorsHelper.ts';

export const TreatmentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<(ServiceItem & { categoryName: string; categoryId: string }) | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [srvRes, docRes] = await Promise.all([
          fetch(`/api/services/${slug}`),
          fetch('/api/doctors')
        ]);

        if (!srvRes.ok) {
          navigate('/treatments');
          return;
        }

        const srvData = await srvRes.json();
        const docData = await docRes.json();

        setService(srvData);
        setDoctors(enrichDoctors(docData));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!service) return null;

  const compatibleDoctors = doctors.filter(d => 
    service.compatibleDoctorIds?.includes(d.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Editorial Header */}
      <div className="bg-[#14294A] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link
            to="/treatments"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Treatments</span>
          </Link>

          <div className="space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
              {service.categoryName}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight text-white">
              {service.name}
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-3xl leading-relaxed pt-1">
              {service.shortDescription}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Estimated Session: ~{service.durationMinutes} Minutes (Provisional)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conducted in Private Clinical Suites</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            {/* Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Clinical Overview &amp; Philosophy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {service.fullDescription}
              </p>
            </div>

            {/* Suitability */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Recommended Indications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.suitableFor.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-[#1762B2] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step Protocol */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Treatment Procedure Protocol
              </h3>
              <div className="space-y-3">
                {service.processSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-slate-900">{step.step}</span>
                      <span className="text-xs font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                        {step.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Diagnostic Clinical FAQs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Frequently Asked Clinical Questions
              </h3>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Factual Integrity Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Transparent Pricing Policy:</strong> Hellenic Dental Clinic does not publish arbitrary prices online. All treatment plans and fee structures are established in-person based on radiographic analysis, digital scans, and tissue health.
              </div>
            </div>
          </div>

          {/* Right Column: Compatible Doctors & Booking Box */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Booking Action Box */}
            <div className="bg-[#14294A] text-white p-6 rounded-3xl border border-blue-900/60 shadow-xl space-y-4">
              <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">DEMO RESERVATION</span>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Book Consultation for {service.name}
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed">
                Test our slot availability engine. Select a doctor, choose your preferred Dubai time, and submit your simulated booking request.
              </p>

              <Link
                to={`/book?service=${service.id}`}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Time Slot</span>
              </Link>
            </div>

            {/* Compatible Doctors List */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Specialists Delivering This Care
              </h4>

              <div className="space-y-3">
                {compatibleDoctors.map(doc => (
                  <Link
                    key={doc.id}
                    to={`/doctors/${doc.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                        {doc.name}
                      </span>
                      <span className="block text-xs text-slate-500 truncate">
                        {doc.specialty}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
