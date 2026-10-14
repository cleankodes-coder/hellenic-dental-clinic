import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Languages, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Doctor } from '../types/index.ts';
import { hellenicDoctors } from '@/HellenicDoctorsEmbedded.ts';
import { enrichDoctor } from '../data/doctorsHelper.ts';

export const DoctorProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/doctors/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Doctor not found');
        return res.json();
      })
      .then(data => {
        setDoctor(enrichDoctor(data));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        navigate('/doctors');
      });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!doctor) return null;

  const daysMap: Record<number, string> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Editorial Header */}
      <div className="bg-[#14294A] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Specialists</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
              {doctor.specialty}
            </span>
            {doctor.isAuthenticPortrait && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Portrait</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Content Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait & Action Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xl overflow-hidden">
              <div className="aspect-[4/5] rounded-2xl bg-slate-900 overflow-hidden relative shadow-inner">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {doctor.name}
                  </h1>
                  <p className="text-sm font-semibold text-blue-700 mt-0.5">
                    {doctor.title}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Languages className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Languages: <strong>{doctor.languages.join(', ')}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Experience: <strong>{doctor.experienceYears}+ Years Clinical Practice</strong></span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Synthetic Working Shift:</span>
                      <p className="text-slate-500">
                        {doctor.workingDays.map(d => daysMap[d]).join(', ')} ({doctor.shiftStart} – {doctor.shiftEnd})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/book?doctor=${doctor.id}`}
                    className="w-full py-3.5 rounded-xl bg-[#1762B2] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment With {doctor.name.split(' ')[1] || 'Doctor'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bio, Qualifications, Expertise */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
            {/* About Biography */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Clinical Biography
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {doctor.about}
              </p>
            </div>

            {/* Education & Credentials */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-700" />
                <span>Education &amp; Qualifications</span>
              </h3>
              <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                {doctor.education}
              </p>
            </div>

            {/* Core Expertise Areas */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Core Clinical Focus &amp; Procedures
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {doctor.expertise.map((exp, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Factual Integrity Notice */}
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 leading-relaxed">
              <strong>Factual Data Policy:</strong> Information is compiled from public clinic directory references. Individual doctor hours represent synthetic demo schedules for demonstration of the booking engine.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
