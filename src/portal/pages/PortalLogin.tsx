import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowRight, CheckCircle2, User, KeyRound } from 'lucide-react';
import { usePortal } from '../PortalContext.tsx';
import { UserRole } from '../../types/index.ts';

export const PortalLogin: React.FC = () => {
  const { login } = usePortal();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('administrator');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/95 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
              STAFF AUTHORIZATION
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif] mt-1">
              Clinic Operations Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select authorized staff role to enter the desktop management system.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Choose Staff Profile Role:</label>
            <div className="space-y-2">
              <label
                onClick={() => setSelectedRole('administrator')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === 'administrator'
                    ? 'border-blue-500 bg-blue-600/20 text-white'
                    : 'border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold text-sm">Administrator</span>
                  <span className="block text-xs text-slate-400">Dr. Eleni Tzomaa (Clinical Director)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedRole === 'administrator' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                }`}>
                  {selectedRole === 'administrator' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>

              <label
                onClick={() => setSelectedRole('receptionist')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === 'receptionist'
                    ? 'border-blue-500 bg-blue-600/20 text-white'
                    : 'border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold text-sm">Receptionist</span>
                  <span className="block text-xs text-slate-400">Sarah Al-Nuaimi (Intake &amp; Front Desk)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedRole === 'receptionist' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                }`}>
                  {selectedRole === 'receptionist' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>

              <label
                onClick={() => setSelectedRole('doctor')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedRole === 'doctor'
                    ? 'border-blue-500 bg-blue-600/20 text-white'
                    : 'border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold text-sm">Doctor Practitioner</span>
                  <span className="block text-xs text-slate-400">Dr. Mohammad Hayem (Oral Surgeon)</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedRole === 'doctor' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                }`}>
                  {selectedRole === 'doctor' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </label>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Role-Based Access Control (RBAC) enforced across all operational tabs.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Enter Staff Management System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link to="/" className="text-xs text-blue-400 hover:underline">
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
