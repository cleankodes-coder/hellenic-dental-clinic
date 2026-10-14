import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">LEGAL &amp; PRIVACY</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Privacy Notice &amp; Demonstration Sandbox
          </h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: October 2026 • Status: Concept Demo Sandbox</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <strong>Important Notice:</strong> This software is an independent private concept demonstration for Hellenic Dental Clinic Dubai. No real patient data is shared or transmitted to live clinic EHR/EMR systems.
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. Data Storage &amp; Scope</h2>
          <p>
            Any fictional names, telephone numbers, and email addresses entered into the appointment booking form or contact interface are recorded strictly within this application&apos;s isolated demonstration database for feature testing purposes.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. No Medical Record Collection</h2>
          <p>
            Users are explicitly instructed not to enter real confidential medical histories, diagnostic imaging files, or sensitive health numbers.
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. AI Receptionist Privacy</h2>
          <p>
            Interactions with the &ldquo;Ask Hellenic&rdquo; AI Concierge are processed via secure server-side API calls. Conversations are transient and not used to train global external AI models.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">TERMS OF USE</span>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Terms of Concept Demo Experience
          </h1>
          <p className="text-xs text-slate-500 font-mono">Last Updated: October 2026</p>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
          <strong>Notice:</strong> This web application is not an official clinical booking service or endorsed representation of Hellenic Dental Clinic Dubai.
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900">1. Nature of the Service</h2>
          <p>
            The software represents a multidisciplinary architectural concept demonstration incorporating a 3D dental hero, server-authoritative slot scheduling, a desktop staff portal, and an AI receptionist.
          </p>

          <h2 className="text-lg font-bold text-slate-900">2. Non-Diagnostic Disclaimer</h2>
          <p>
            Information provided across all pages and the AI assistant does not constitute dental, medical, or diagnostic advice. Patients requiring clinical intervention must seek an in-person consultation with a licensed dentist.
          </p>

          <h2 className="text-lg font-bold text-slate-900">3. Simulated Notifications</h2>
          <p>
            All SMS, WhatsApp, and email alerts shown within the portal and booking flow carry the statutory badge <strong>SIMULATED — NOT SENT</strong>. No external third-party telecommunications charges or dispatches take place.
          </p>
        </div>
      </div>
    </div>
  );
};
