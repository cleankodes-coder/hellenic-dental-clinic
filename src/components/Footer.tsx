import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Mail, Instagram, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A1628] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Clinic Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/brand/hellenic-dental-symbol.jpg"
                alt="Hellenic Dental Clinic Emblem"
                className="w-10 h-10 rounded-lg object-cover border border-blue-500/30"
              />
              <div>
                <span className="block font-bold tracking-tight text-white text-base font-['Plus_Jakarta_Sans',sans-serif]">
                  HELLENIC DENTAL CLINIC
                </span>
                <span className="block text-[10px] tracking-widest text-blue-400 font-semibold uppercase">
                  DUBAI • AL WASL ROAD
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Boutique dental excellence on prestigious Al Wasl Road. Integrating Greek clinical heritage, digital smile design, and gentle healthcare hospitality.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://www.instagram.com/hellenicdentalclinic/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://hellenicdentalclinic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                title="Official Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                to="/portal"
                className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-900/40 text-blue-300 border border-blue-700/50 hover:bg-blue-800/50 transition-colors font-medium"
              >
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/treatments" className="hover:text-blue-400 transition-colors">
                  All Treatments & Services
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-blue-400 transition-colors">
                  Our Specialists & Team
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-blue-400 transition-colors">
                  Book a Demo Appointment
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About Hellenic Dental Clinic
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link to="/portal" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                  Desktop Management Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Treatments */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
              Featured Treatments
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/treatments/porcelain-veneers" className="hover:text-white transition-colors">
                  Custom Porcelain Veneers
                </Link>
              </li>
              <li>
                <Link to="/treatments/clear-aligners" className="hover:text-white transition-colors">
                  Digital Clear Aligners
                </Link>
              </li>
              <li>
                <Link to="/treatments/dental-implants" className="hover:text-white transition-colors">
                  Precision Dental Implants
                </Link>
              </li>
              <li>
                <Link to="/treatments/teeth-whitening" className="hover:text-white transition-colors">
                  Laser Teeth Whitening
                </Link>
              </li>
              <li>
                <Link to="/treatments/root-canal-therapy" className="hover:text-white transition-colors">
                  Microscopic Root Canal
                </Link>
              </li>
              <li>
                <Link to="/treatments/preventative-scaling" className="hover:text-white transition-colors">
                  Airflow Prophylaxis & Hygiene
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
              Contact & Hours
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Villa / Building 4, Al Wasl Road, Al Bada'a, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:+97143490422" className="hover:text-white transition-colors">
                  +971 4 349 0422
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:info@hellenicdentalclinic.com" className="hover:text-white transition-colors">
                  info@hellenicdentalclinic.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="text-slate-300">Mon–Fri: 09:30 – 20:00</p>
                  <p className="text-slate-300">Saturday: 09:30 – 19:00</p>
                  <p className="text-slate-400">Sunday: 11:00 – 17:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Concept Demo Disclaimer & Legal Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-slate-400 font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Concept Demo — Not an Official Clinic Booking Service.</span>
            </p>
            <p>
              This is an independent private architectural concept build for evaluation. All doctor schedules, appointment records, and patient details are fictional synthetic demonstrations.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400 shrink-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Notice</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Demo</Link>
            <span>•</span>
            <Link to="/portal" className="text-blue-400 hover:text-blue-300 transition-colors">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
