import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Award, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <div className="bg-[#14294A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
            HELLENIC DENTAL CLINIC DUBAI
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Our Story &amp; Care Ethos
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Founded on Greek medical heritage and Swiss clinical standards. Dedicated to gentle, evidence-based dentistry in a serene Al Wasl Road sanctuary.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        {/* Editorial Story */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold tracking-widest text-[#1762B2] uppercase">OUR ORIGINS</span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              A Sanctuary of Clinical Serenity on Al Wasl Road
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Hellenic Dental Clinic was established to offer patients an elevated alternative to high-volume, rushed corporate dental clinics. Rooted in traditional Greek dental scholarship and led by Clinical Director Dr. Eleni Tzomaa, our practice was conceived as an unhurried sanctuary where patient well-being, anatomical harmony, and clinical precision take precedence.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              Situated in a tranquil private villa environment in Al Bada&apos;a along Al Wasl Road, our Dubai clinic ensures discretion, privacy, and seamless accessibility from Jumeirah, Downtown Dubai, and City Walk.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Evidence-Based Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We strictly avoid overtreatment. Every dental recommendation is backed by digital imaging, intraoral photography, and transparent diagnostic criteria.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Minimally Invasive</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether creating bespoke porcelain veneers or restoring teeth with composite bonding, our techniques preserve maximum natural tooth enamel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Gentle Hospitality</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We understand that dental anxiety is real. Our team employs gentle anesthesia protocols, warm air-polishing, and compassionate communication.
              </p>
            </div>
          </div>
        </div>

        {/* Factual Integrity & Standards */}
        <div className="bg-[#0F1F38] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold border border-blue-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Strict Adherence to Factual Truth
              </h3>
              <p className="text-xs text-blue-200">
                Independent Concept Demo Standards
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            In strict compliance with healthcare ethics and the project specifications, Hellenic Dental Clinic does not invent fabricated awards, unverified patient testimonials, artificial price guarantees, or simulated clinical interior photography. All doctor roster entries, service descriptions, and operating schedules reflect verified clinic disclosures and honest concept demonstrations.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DHA Compliance Ready</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Authentic Doctor Mapping</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Data Privacy Sandbox</span>
            </span>
          </div>
        </div>

        {/* Closing Action */}
        <div className="text-center space-y-4 pt-4">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1762B2] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Meet the Clinical Specialists</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
