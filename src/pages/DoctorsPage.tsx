import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Calendar, ChevronRight, Award, Shield, User, Filter } from 'lucide-react';
import { Doctor } from '../types/index.ts';
import { hellenicDoctors } from '@/HellenicDoctorsEmbedded.ts';
import { enrichDoctors } from '../data/doctorsHelper.ts';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

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
  }, []);

  const categories = [
    { id: 'all', label: 'All Faculty' },
    { id: 'cosmetic', label: 'Cosmetic & Aesthetic' },
    { id: 'orthodontics', label: 'Orthodontics' },
    { id: 'surgery', label: 'Oral Surgery' },
    { id: 'restorative', label: 'Restorative & Endodontics' },
    { id: 'pediatric', label: 'Pediatric Care' },
    { id: 'general', label: 'General Practice' },
  ];

  const filteredDoctors = doctors.filter(doc => {
    if (activeFilter === 'all') return true;
    return doc.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <div className="bg-[#14294A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
            MEDICAL &amp; DENTAL FACULTY
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Our Specialist Team in Dubai
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Led by Clinical Director Dr. Eleni Tzomaa. A multidisciplinary clinical group committed to gentle, high-precision care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Specialty Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveFilter(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFilter === c.id
                  ? 'bg-[#1762B2] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Notice on Roster */}
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Authentic Portraits Mapped:</strong> 5 doctors feature verified supplied photographs. 2 members feature standard illustrated placeholders.
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-700 font-semibold shrink-0">
            PROVISIONAL DEMO ROSTER
          </span>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredDoctors.map(doc => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group"
            >
              {/* Doctor Portrait Image */}
              <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-90" />

                {/* Authenticity Badge */}
                <div className="absolute top-3 left-3">
                  {doc.isAuthenticPortrait ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Authentic Mapped Photo</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-800/90 text-slate-300 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-slate-600">
                      <span>Provisional Placeholder</span>
                    </span>
                  )}
                </div>

                {/* Overlay Name & Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="block text-xs font-semibold text-blue-300 uppercase tracking-wider">
                    {doc.specialty}
                  </span>
                  <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif] leading-tight mt-0.5">
                    {doc.name}
                  </h3>
                  <span className="block text-xs text-slate-300 font-medium">
                    {doc.title}
                  </span>
                </div>
              </div>

              {/* Card Footer / Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="line-clamp-3 leading-relaxed">{doc.about}</p>
                  <div className="pt-1 flex flex-wrap gap-1 text-[11px] text-slate-500 font-medium">
                    <span>Languages:</span>
                    <span className="text-slate-800 font-semibold">{doc.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/doctors/${doc.slug}`}
                    className="text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
                  >
                    View Profile
                  </Link>

                  <Link
                    to={`/book?doctor=${doc.id}`}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#1762B2] text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Book Visit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
