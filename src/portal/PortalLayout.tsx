import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Calendar as CalendarDays, 
  Users, 
  Stethoscope, 
  MessageSquare, 
  Bell, 
  BarChart3, 
  Bot, 
  Settings, 
  LogOut, 
  Shield, 
  Monitor, 
  ArrowLeft,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { usePortal } from './PortalContext.tsx';
import { UserRole } from '../types/index.ts';

export const PortalLayout: React.FC = () => {
  const { currentUser, switchRole, isAuthenticated, logout } = usePortal();
  const location = useLocation();
  const navigate = useNavigate();

  // Desktop viewport check (requires ~1024px and above)
  const [isDesktop, setIsDesktop] = useState(true);
  const [dubaiTime, setDubaiTime] = useState<string>('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Update Dubai Time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDubaiTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Dubai',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    navigate('/portal/login');
    return null;
  }

  // Mobile / Narrow Viewport Interstitial
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto">
            <Monitor className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono">
              DESKTOP-ONLY INTERFACE
            </span>
            <h1 className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">
              Clinical Operations Portal
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              This management portal is optimized for desktop workstations (1200px+). Please open it on a desktop or laptop computer to manage clinic operations.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Website (Fully Responsive)</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/portal', icon: LayoutDashboard, exact: true },
    { label: 'Appointments', path: '/portal/appointments', icon: CalendarCheck },
    { label: 'Calendar', path: '/portal/calendar', icon: CalendarDays },
    { label: 'Doctors', path: '/portal/doctors', icon: Users, roles: ['administrator'] },
    { label: 'Treatments', path: '/portal/services', icon: Stethoscope, roles: ['administrator'] },
    { label: 'Enquiries', path: '/portal/enquiries', icon: MessageSquare, roles: ['administrator', 'receptionist'] },
    { label: 'Notifications', path: '/portal/notifications', icon: Bell },
    { label: 'Analytics', path: '/portal/analytics', icon: BarChart3, roles: ['administrator', 'receptionist'] },
    { label: 'AI Receptionist', path: '/portal/assistant', icon: Bot, roles: ['administrator'] },
    { label: 'Settings', path: '/portal/settings', icon: Settings, roles: ['administrator'] },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === '/portal';
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
      {/* 1. NAVY SIDEBAR */}
      <aside className="w-64 bg-[#14294A] text-slate-200 flex flex-col justify-between shrink-0 border-r border-blue-950/60 shadow-xl select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-blue-900/40 flex items-center gap-3">
            <img
              src="/assets/brand/hellenic-dental-symbol.jpg"
              alt="Hellenic Dental"
              className="w-10 h-10 rounded-xl object-cover border border-blue-400/30"
            />
            <div>
              <span className="block text-sm font-extrabold text-white tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
                HELLENIC DENTAL
              </span>
              <span className="block text-[10px] tracking-wider text-blue-300 font-semibold uppercase">
                STAFF PORTAL
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              // Role guard check for nav items
              if (item.roles && !item.roles.includes(currentUser.role)) {
                return null;
              }
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-300'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Identity & Switcher Footer in Sidebar */}
        <div className="p-4 border-t border-blue-900/40 bg-slate-900/60 space-y-3">
          {/* Active User Pill */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {currentUser.avatarText}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-white truncate leading-tight">
                  {currentUser.name.split(' (')[0]}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-blue-300 font-semibold">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-slate-400 hover:text-red-400 p-1.5 transition-colors"
              title="Sign Out of Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="block text-[10px] text-slate-400 font-mono mb-1.5 uppercase tracking-wider">
              Demo Role Preview:
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => switchRole('administrator')}
                className={`py-1 rounded text-center transition-colors ${
                  currentUser.role === 'administrator'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => switchRole('receptionist')}
                className={`py-1 rounded text-center transition-colors ${
                  currentUser.role === 'receptionist'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Reception
              </button>
              <button
                type="button"
                onClick={() => switchRole('doctor')}
                className={`py-1 rounded text-center transition-colors ${
                  currentUser.role === 'doctor'
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Doctor
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN DESKTOP CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Bar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Section Identifier & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Clinic Operational Portal</span>
              <span>•</span>
              <span className="text-blue-700 font-medium">Dubai Sandbox System</span>
            </div>
          </div>

          {/* Right: Live Dubai Time, Public Site Link */}
          <div className="flex items-center gap-5 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Dubai: <strong>{dubaiTime || '09:30:00'}</strong> (GST)</span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Child Views Content */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
