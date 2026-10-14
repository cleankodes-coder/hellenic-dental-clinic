import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Phone, Menu, X, Shield, Clock, MapPin, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Treatments', path: '/treatments' },
    { label: 'Doctors', path: '/doctors' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Concept Notice Top Banner */}
      <div className="bg-[#14294A] text-slate-200 text-xs py-1.5 px-4 font-medium tracking-wide border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>
              <strong>Concept Demo</strong> — Not an Official Clinic Booking Service. Fictional demo data only.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span>Mon–Fri: 09:30–20:00 • Sat: 09:30–19:00</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>Al Wasl Road, Dubai</span>
            </span>
            <Link
              to="/portal"
              className="text-blue-300 hover:text-white underline font-semibold transition-colors"
            >
              Management Portal &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Clinic Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-blue-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/brand/hellenic-dental-symbol.jpg"
                alt="Hellenic Dental Clinic Emblem"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image load issues
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <span className="block font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl font-['Plus_Jakarta_Sans',sans-serif] leading-tight group-hover:text-blue-700 transition-colors">
                HELLENIC DENTAL CLINIC
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold tracking-widest text-[#1762B2] uppercase">
                DUBAI • AL WASL ROAD
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-700 bg-blue-50/80'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+97143490422"
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors border border-slate-200/80 bg-slate-50/60"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>+971 4 349 0422</span>
            </a>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-[#1762B2] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/book"
              className="bg-[#1762B2] text-white p-2 rounded-lg text-xs font-semibold"
              title="Book appointment"
            >
              <Calendar className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-semibold transition-colors ${
                isActive(link.path)
                  ? 'text-blue-700 bg-blue-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-[#1762B2] text-white py-3 rounded-xl font-bold shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Demo Appointment</span>
            </Link>
            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-slate-200 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Clinic Staff Portal (Desktop)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
