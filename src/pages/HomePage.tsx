import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DentalHero3D } from '../components/DentalHero3D.tsx';
import { 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ChevronRight, 
  Star,
  Award,
  Layers,
  HeartHandshake,
  Activity,
  Smile,
  Shield
} from 'lucide-react';
import { Doctor, ServiceCategory } from '../types/index.ts';
import { hellenicDoctors } from '@/HellenicDoctorsEmbedded.ts';
import { getDoctorImage, enrichDoctors } from '../data/doctorsHelper.ts';

export const HomePage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [docRes, srvRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/services')
        ]);
        const docs = await docRes.json();
        const srvs = await srvRes.json();
        setDoctors(enrichDoctors(docs));
        setCategories(srvs);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION WITH 3D DENTAL SCULPTURE */}
      <section className="relative bg-gradient-to-b from-[#0F1F38] via-[#14294A] to-[#0A1628] text-white pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Subtle Luxury Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm text-xs font-semibold text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Boutique Dental Sanctuary • Al Wasl Road, Dubai</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] leading-[1.12]">
                Confidence Begins <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-200 to-white">
                  With a Healthy Smile.
                </span>
              </h1>

              {/* Reassuring Editorial Subcopy */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience bespoke aesthetic smile architecture, precision orthodontics, and restorative excellence. Swiss clinical discipline meets warm Mediterranean hospitality in the heart of Dubai.
              </p>

              {/* Key Trust Signals */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Greek Heritage &amp; Modern Technology</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3D Digital Smile Scanning</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero-Pressure Consultations</span>
                </span>
              </div>

              {/* Dual Action CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/book"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-base shadow-xl shadow-blue-900/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book a Demo Appointment</span>
                </Link>

                <Link
                  to="/treatments"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Explore Our Treatments</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Verified Staff Preview Snippet */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0F1F38] object-cover"
                    src={getDoctorImage('eleni-tzomaa', '/assets/doctors/portraits/eleni-tzomaa.webp')}
                    alt="Dr. Eleni Tzomaa"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0F1F38] object-cover"
                    src={getDoctorImage('firas-alshak-khallel', '/assets/doctors/portraits/firas-alshak-khallel.webp')}
                    alt="Dr. Firas Alshak Khallel"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0F1F38] object-cover"
                    src={getDoctorImage('mada-jeshi', '/assets/doctors/portraits/mada-jeshi.webp')}
                    alt="Dr. Mada Jeshi"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  <span className="text-white font-semibold">Led by Dr. Eleni Tzomaa</span> &amp; specialist surgical &amp; orthodontic faculty
                </div>
              </div>
            </div>

            {/* Right Column: 3D Dental Sculpture Viewport */}
            <div className="lg:col-span-5 relative w-full h-[460px] lg:h-[540px]">
              <DentalHero3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLINIC INTRODUCTION: SWISS DISCIPLINE & GREEK HOSPITALITY */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Brand Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-br from-[#14294A] to-[#1E3A8A] rounded-3xl p-8 sm:p-10 text-white shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-blue-400/40 shadow-lg">
                    <img
                      src="/assets/brand/hellenic-dental-symbol.jpg"
                      alt="Hellenic Dental Clinic Emblem"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">OUR COMMITMENT</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                      Unhurried, Evidence-Based Dentistry.
                    </h3>
                  </div>

                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    At Hellenic Dental Clinic, we believe dentistry should never feel rushed or transactional. Located along tranquil Al Wasl Road in Dubai, our clinic is thoughtfully designed to provide restorative calm, personalized attention, and clinical transparency.
                  </p>

                  <div className="pt-4 border-t border-blue-400/20 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-2xl font-black text-white">16+</span>
                      <span className="text-blue-200">Years Clinical Leadership</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-black text-white">7</span>
                      <span className="text-blue-200">Specialist Practitioners</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pillars List */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-widest text-blue-700 uppercase">CARE PHILOSOPHY</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  Where Heritage Meets Cutting-Edge Precision.
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  Every patient journey begins with high-definition digital radiography, intraoral optical photography, and a collaborative discussion. We believe in preserving natural dentition wherever possible and creating smiles that look authentic, healthy, and timeless.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Aesthetic Architecture</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Custom porcelain veneers and composite edge bonding designed to harmonize with your unique facial anatomy and lip dynamics.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Smile className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Gentle Orthodontics</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Digital clear aligners mapped with 3D precision for discreet tooth straightening that fits seamlessly into your Dubai routine.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Consultant Oral Surgery</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Titanium dental implants and wisdom teeth extractions conducted under hospital-grade surgical sterility by our Consultant Oral Surgeon.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Preventative Wellness</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Warm Swiss Airflow prophylaxis and microscopic endodontics that save natural teeth and safeguard lifelong gum vitality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TREATMENT CATEGORIES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-[#1762B2] uppercase">TREATMENT SPECTRUM</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Tailored Clinical Solutions.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Explore our published treatment categories. All procedures are delivered in private suites with strict European sterilization protocols.
              </p>
            </div>

            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>View Complete Treatment Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold transition-colors group-hover:bg-[#1762B2] group-hover:text-white">
                    <Sparkles className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] group-hover:text-blue-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-medium text-blue-600 mt-1">
                      {cat.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Sample Services Pill List */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {cat.services.slice(0, 3).map((s) => (
                      <span
                        key={s.id}
                        className="inline-block text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/treatments/${cat.services[0]?.slug || ''}`}
                    className="text-xs font-bold text-slate-900 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Explore Procedures</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/book"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                  >
                    Book Demo
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DOCTORS PREVIEW: AUTHENTIC PORTRAITS & SILHOUETTE PLACEHOLDERS */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-[#1762B2] uppercase">CLINICAL FACULTY</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Meet Our Specialists.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Led by Clinical Director Dr. Eleni Tzomaa. All five authentic portraits and two provisional placeholder profiles are verified on local deterministic assets.
              </p>
            </div>

            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>View All 7 Specialists</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Doctors Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
              >
                {/* Doctor Portrait Image */}
                <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {doc.isAuthenticPortrait ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-600/90 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Authentic Profile</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded-full backdrop-blur-xs border border-slate-600">
                        <span>Provisional Roster</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="block text-xs font-semibold text-blue-300">
                      {doc.specialty}
                    </span>
                    <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif] leading-tight">
                      {doc.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="font-medium text-slate-900">{doc.title}</p>
                    <p className="line-clamp-2 text-slate-500">{doc.about}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/doctors/${doc.slug}`}
                      className="text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
                    >
                      View Profile
                    </Link>

                    <Link
                      to={`/book?doctor=${doc.id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1762B2] text-white hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              <strong>Authenticity Note:</strong> Five doctor profiles are mapped to authentic supplied portraits (Dr. Eleni Tzomaa, Dr. Firas, Dr. Mada, Dr. Majd, Dr. Mohammad Hayem). Two members (Dr. Ayesha, Dr. Kashmira) display standard illustrated placeholder cards.
            </span>
            <Link to="/doctors" className="font-bold underline text-blue-700 hover:text-blue-800 shrink-0">
              See All Profiles &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW DEMO SCHEDULING WORKS (6 CLEAR STEPS) */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">TRANSPARENT SCHEDULING ENGINE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              How Demo Appointment Requests Work.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Test our end-to-end appointment-request workflow backed by server validation, anti-conflict slot locks, and live management portal synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">1</span>
              <h4 className="font-bold text-base text-white">Select Service</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from published treatment categories including veneers, aligners, dental implants, root canal care, or preventative hygiene.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">2</span>
              <h4 className="font-bold text-base text-white">Choose Doctor</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your preferred specialist or opt for &ldquo;First Available&rdquo; across our active clinical roster.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">3</span>
              <h4 className="font-bold text-base text-white">Pick Future Date</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our calendar validates opening days and doctor working shifts (Monday–Friday 09:30–20:00, Saturday until 19:00, Sunday until 17:00).
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">4</span>
              <h4 className="font-bold text-base text-white">Dynamic Slot Lock</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selecting a slot places a provisional 10-minute hold to prevent race conditions and conflicting overlapping bookings.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">5</span>
              <h4 className="font-bold text-base text-white">Enter Demo Patient Details</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit fictional patient contact information and clinical notes without collecting sensitive real medical history.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold text-sm flex items-center justify-center border border-blue-500/30">6</span>
              <h4 className="font-bold text-base text-white">Receive Reference (Pending)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive an authoritative HDC reference. The request syncs into the staff portal where reception reviews and confirms it.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span>Launch Appointment Request Flow</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CLINIC LOCATION & CONTACT PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold tracking-widest text-[#1762B2] uppercase">VISIT OUR CLINIC</span>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  Conveniently Situated on Al Wasl Road.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Located in the elegant residential quarter of Al Bada'a, close to City Walk, Jumeirah, and Downtown Dubai. Our standalone villa setting guarantees privacy, discretion, and effortless parking.
                </p>

                <div className="space-y-3 pt-2 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>Villa / Building 4, Al Wasl Road, Al Bada'a, Dubai, UAE</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                    <a href="tel:+97143490422" className="hover:text-blue-600 font-semibold transition-colors">
                      +971 4 349 0422 (Reception)
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Standard Consultation Hours:</p>
                      <p className="text-xs text-slate-600">Monday–Friday: 09:30–20:00 • Saturday: 09:30–19:00 • Sunday: 11:00–17:00</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <a
                    href="https://maps.google.com/?q=Hellenic+Dental+Clinic+Al+Wasl+Road+Dubai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                  >
                    <span>Send Test Message</span>
                  </Link>
                </div>
              </div>

              {/* Map Illustration / Visual Card */}
              <div className="lg:col-span-6 bg-[#0F1F38] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">DUBAI LANDMARK PROXIMITY</span>
                  <span className="text-xs text-slate-400 font-mono">25.2155° N, 55.2635° E</span>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <span className="font-semibold text-white">City Walk Dubai</span>
                    <span className="text-blue-400">4 Minutes Drive</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <span className="font-semibold text-white">Jumeirah 1 &amp; La Mer</span>
                    <span className="text-blue-400">6 Minutes Drive</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <span className="font-semibold text-white">Downtown Dubai &amp; Burj Khalifa</span>
                    <span className="text-blue-400">8 Minutes Drive</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                    <span className="font-semibold text-white">Dubai International Airport (DXB)</span>
                    <span className="text-blue-400">16 Minutes Drive</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 italic">
                  Dedicated on-site valet parking and ground floor accessible entrance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLOSING CTA BANNER */}
      <section className="py-16 bg-[#14294A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">
            Ready to Experience the Private Concept?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Test the live appointment scheduling flow or access the desktop management portal to see real-time status transitions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/book"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm shadow-xl transition-all"
            >
              Book Demo Appointment
            </Link>
            <Link
              to="/portal"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              Open Staff Management Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
