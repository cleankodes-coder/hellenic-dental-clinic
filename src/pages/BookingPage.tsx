import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ArrowRight,
  FileText,
  Lock,
  RefreshCw
} from 'lucide-react';
import { Doctor, ServiceCategory, ServiceItem, TimeSlot, Booking } from '../types/index.ts';
import { hellenicDoctors } from '@/HellenicDoctorsEmbedded.ts';
import { enrichDoctors } from '../data/doctorsHelper.ts';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service');
  const preselectedDoctorId = searchParams.get('doctor');

  // Step state: 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Data
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allServices, setAllServices] = useState<(ServiceItem & { categoryName: string; categoryId: string })[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [lockToken, setLockToken] = useState<string | null>(null);

  // Fictional Patient Details
  const [patientName, setPatientName] = useState('Alexander Vance (Demo)');
  const [patientEmail, setPatientEmail] = useState('alex.vance@example.com');
  const [patientPhone, setPatientPhone] = useState('+971 50 123 4567');
  const [patientNotes, setPatientNotes] = useState('First consultation for smile assessment.');

  // Confirmed Result
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Load initial data
  useEffect(() => {
    async function init() {
      try {
        const [catRes, docRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/doctors')
        ]);
        const cats: ServiceCategory[] = await catRes.json();
        const docs: Doctor[] = await docRes.json();
        setCategories(cats);
        setDoctors(enrichDoctors(docs));

        const flat = cats.flatMap(c => c.services.map(s => ({ ...s, categoryName: c.name, categoryId: c.id })));
        setAllServices(flat);

        // Preselect
        if (preselectedServiceId && flat.some(s => s.id === preselectedServiceId)) {
          setSelectedServiceId(preselectedServiceId);
        }
        if (preselectedDoctorId && docs.some(d => d.id === preselectedDoctorId)) {
          setSelectedDoctorId(preselectedDoctorId);
        }

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const y = tomorrow.getFullYear();
        const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const d = String(tomorrow.getDate()).padStart(2, '0');
        setSelectedDate(`${y}-${m}-${d}`);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, [preselectedServiceId, preselectedDoctorId]);

  // Selected Service & Doctor Objects
  const selectedService = allServices.find(s => s.id === selectedServiceId);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  // Filter compatible doctors based on selected service
  const compatibleDoctors = doctors.filter(doc => {
    if (!selectedService) return true;
    return selectedService.compatibleDoctorIds.includes(doc.id);
  });

  // Fetch slots whenever doctor, service, or date changes
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    let isMounted = true;
    async function fetchSlots() {
      setLoadingSlots(true);
      setErrorMsg(null);
      setSelectedSlot(null);

      try {
        const duration = selectedService?.durationMinutes || 30;
        const res = await fetch(`/api/slots/available?doctorId=${selectedDoctorId}&serviceId=${selectedServiceId}&date=${selectedDate}`);
        if (!res.ok) {
          throw new Error('Failed to compute slot availability');
        }
        const data = await res.json();
        if (isMounted) {
          setAvailableSlots(data.slots || []);
        }
      } catch (err: any) {
        if (isMounted) setErrorMsg(err.message);
      } finally {
        if (isMounted) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => { isMounted = false; };
  }, [selectedDoctorId, selectedServiceId, selectedDate, selectedService]);

  // Handle selecting a slot & requesting provisional slot lock
  const handleSelectSlot = async (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setErrorMsg(null);

    // Call server to place provisional mutex hold
    try {
      const res = await fetch('/api/bookings/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          date: selectedDate,
          startTime: slot.time,
          durationMinutes: selectedService?.durationMinutes || 30
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Unable to place provisional hold on this slot');
      }

      const lockData = await res.json();
      setLockToken(lockData.lockToken);
    } catch (err: any) {
      console.warn('Hold warning:', err.message);
      // Still allow step progression for demo if server allows
    }
  };

  // Submit Authoritative Booking Request
  const handleSubmitBooking = async () => {
    if (!selectedServiceId || !selectedDoctorId || !selectedDate || !selectedSlot) {
      setErrorMsg('Please complete all scheduling steps before submitting.');
      return;
    }

    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      setErrorMsg('Please provide demo patient name, email, and telephone.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          serviceId: selectedServiceId,
          date: selectedDate,
          startTime: selectedSlot.time,
          patientName: patientName.trim(),
          patientEmail: patientEmail.trim(),
          patientPhone: patientPhone.trim(),
          patientNotes: patientNotes.trim(),
          source: 'website',
          lockToken: lockToken || undefined
        })
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || 'Server rejected booking request due to a slot conflict.');
      }

      const booking: Booking = await res.json();
      setCreatedBooking(booking);
      setCurrentStep(6); // Step 6 = Confirmation

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28">
      {/* Editorial Header */}
      <div className="bg-[#14294A] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-blue-300 uppercase">
            HELLENIC DENTAL CLINIC DUBAI
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Demo Appointment Scheduling Engine
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Experience our dynamic availability engine with provisional slot locks, doctor shift checks, and real-time synchronization with the clinic management portal.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Fictional Demonstration • Initial status is strictly Pending</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-md mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Doctor' },
              { num: 3, label: 'Date' },
              { num: 4, label: 'Slot' },
              { num: 5, label: 'Details' },
              { num: 6, label: 'Status' }
            ].map(step => (
              <div 
                key={step.num}
                className={`flex items-center gap-1.5 sm:gap-2 ${
                  currentStep === step.num 
                    ? 'text-blue-700 font-extrabold' 
                    : currentStep > step.num 
                    ? 'text-emerald-600' 
                    : 'text-slate-400'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  currentStep === step.num 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : currentStep > step.num 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Scheduling Conflict or Notice</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Step Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* STEP 1: CHOOSE SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Step 1 of 5</span>
                <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  Select Treatment Service
                </h2>
                <p className="text-sm text-slate-600">
                  Select the clinical dental procedure you would like to test.
                </p>
              </div>

              <div className="space-y-6">
                {categories.map(cat => (
                  <div key={cat.id} className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {cat.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {cat.services.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedServiceId(s.id);
                            // Auto select doctor if current selected doctor is not compatible
                            if (selectedDoctorId && !s.compatibleDoctorIds.includes(selectedDoctorId)) {
                              setSelectedDoctorId(s.compatibleDoctorIds[0] || '');
                            }
                          }}
                          className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                            selectedServiceId === s.id
                              ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                              {selectedServiceId === s.id && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                              {s.shortDescription}
                            </p>
                          </div>
                          <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>Duration: ~{s.durationMinutes} mins</span>
                            <span className="text-blue-700 font-semibold">{s.compatibleDoctorIds.length} Doctors</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  disabled={!selectedServiceId}
                  onClick={() => {
                    // Set default doctor if none chosen
                    if (!selectedDoctorId && selectedService) {
                      setSelectedDoctorId(selectedService.compatibleDoctorIds[0] || doctors[0]?.id || '');
                    }
                    setCurrentStep(2);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#1762B2] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Continue to Doctor Selection</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE DOCTOR */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Step 2 of 5</span>
                <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  Choose Dentist or Specialist
                </h2>
                <p className="text-sm text-slate-600">
                  Showing practitioners certified for <strong>{selectedService?.name}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {compatibleDoctors.map(doc => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                      selectedDoctorId === doc.id
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-16 h-20 rounded-xl object-cover bg-slate-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h4>
                        {selectedDoctorId === doc.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-blue-700 mt-0.5 truncate">{doc.specialty}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doc.title}</p>
                      <div className="mt-2 text-[10px] text-slate-400 font-mono">
                        Shift: {doc.shiftStart} – {doc.shiftEnd}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedDoctorId}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#1762B2] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Select Date</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PICK FUTURE DATE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Step 3 of 5</span>
                <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  Choose Appointment Date
                </h2>
                <p className="text-sm text-slate-600">
                  Select a consultation date for <strong>{selectedDoctor?.name}</strong>.
                </p>
              </div>

              {/* Doctor working days reminder */}
              {selectedDoctor && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-center justify-between">
                  <span>
                    <strong>Dr. {selectedDoctor.name.split(' ')[1] || 'Doctor'}&apos;s Working Days:</strong> Mon, Tue, Wed, Thu, Fri, Sat (09:30–20:00 depending on clinic opening).
                  </span>
                </div>
              )}

              {/* Date Input & Quick Selector */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Calendar Date:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                    />
                  </div>

                  {/* Quick Shortcut Buttons */}
                  <div className="w-full sm:w-auto flex flex-wrap gap-2 pt-5">
                    {[
                      { label: 'Tomorrow', offset: 1 },
                      { label: '+2 Days', offset: 2 },
                      { label: '+3 Days', offset: 3 },
                      { label: 'Next Week', offset: 7 }
                    ].map((btn, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + btn.offset);
                      const str = d.toISOString().split('T')[0];
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(str)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                            selectedDate === str
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <p><strong>Selected Target:</strong> {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'None'}</p>
                  <p>Clinic operates on Asia/Dubai local time.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Doctor</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-[#1762B2] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>View Available Slots</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: TIME SLOT SELECTION & PROVISIONAL LOCK */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Step 4 of 5</span>
                <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  Choose Time Slot
                </h2>
                <p className="text-sm text-slate-600">
                  Slots dynamically computed for <strong>{selectedDoctor?.name}</strong> on {selectedDate}.
                </p>
              </div>

              {/* Loading State */}
              {loadingSlots && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Validating clinic shifts &amp; active bookings...</p>
                </div>
              )}

              {/* Slot Grid */}
              {!loadingSlots && availableSlots.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
                    <span>Available slots (30-60 min step):</span>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Available</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> Booked / Held</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                    {availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => handleSelectSlot(slot)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedSlot?.time === slot.time
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                            : slot.available
                            ? 'bg-white hover:bg-blue-50 border-slate-200 text-slate-800 font-semibold'
                            : 'bg-slate-100 border-slate-200/60 text-slate-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <span className="block text-sm">{slot.time}</span>
                        <span className="block text-[10px] opacity-80">{slot.endTime}</span>
                        {!slot.available && (
                          <span className="block text-[9px] font-bold text-red-500 uppercase mt-0.5">
                            {slot.reason === 'held' ? 'Held' : 'Booked'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loadingSlots && availableSlots.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    No available time slots found for {selectedDoctor?.name} on this date.
                  </p>
                  <p className="text-xs text-slate-500">
                    The doctor may not be scheduled on this day of the week, or all shifts are fully reserved.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    Select Another Date
                  </button>
                </div>
              )}

              {/* Provisional Hold Notification */}
              {selectedSlot && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Slot Reserved:</strong> {selectedSlot.time} – {selectedSlot.endTime} is provisionally held for 10 minutes.
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">10:00 Hold</span>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Date</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 rounded-xl bg-[#1762B2] hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>Enter Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FICTIONAL PATIENT DETAILS & REVIEW */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Step 5 of 5</span>
                <h2 className="text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mt-1">
                  Enter Fictional Patient Details &amp; Review
                </h2>
                <p className="text-sm text-slate-600">
                  Please provide demo test details. Do not enter genuine confidential medical records.
                </p>
              </div>

              {/* Review Summary Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Request Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Service:</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedService?.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Doctor:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {selectedDoctor?.image && (
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 bg-slate-900 shrink-0"
                        />
                      )}
                      <p className="font-bold text-slate-900 text-sm">{selectedDoctor?.name}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Date:</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Time Window:</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedSlot?.time} – {selectedSlot?.endTime} (Dubai)</p>
                  </div>
                </div>
              </div>

              {/* Patient Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name (Demo)</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      placeholder="e.g. Alexander Vance"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Patient Email (Demo)</label>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={e => setPatientEmail(e.target.value)}
                      placeholder="e.g. alex.vance@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telephone / WhatsApp Number (Demo)</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Concerns / Reason for Visit (Demo Notes)</label>
                  <textarea
                    rows={3}
                    value={patientNotes}
                    onChange={e => setPatientNotes(e.target.value)}
                    placeholder="Brief description of primary concerns..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Initial Status Notice */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Pending Status:</strong> In compliance with clinic protocol, all requests are submitted as <strong>Pending</strong>. You will receive an HDC reference which reception staff will verify and confirm inside the management portal.
                </span>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Slots</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitBooking}
                  className="px-8 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Validating with Server...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Appointment Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS CONFIRMATION & UNIQUE HDC REFERENCE */}
          {currentStep === 6 && createdBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Request Recorded (Status: Pending)
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Appointment Request Successful
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your simulated appointment request has been recorded in the database and synchronized with the clinic operations portal.
                </p>
              </div>

              {/* Reference Card */}
              <div className="max-w-md mx-auto bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                <span className="text-xs font-mono text-blue-300 uppercase tracking-widest">UNIQUE BOOKING REFERENCE</span>
                <div className="text-3xl font-black font-mono tracking-widest text-amber-400">
                  {createdBooking.reference}
                </div>

                <div className="pt-3 border-t border-slate-800 text-left space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Patient:</span>
                    <span className="font-semibold text-white">{createdBooking.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Doctor:</span>
                    <span className="font-semibold text-white">{createdBooking.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-semibold text-white">{createdBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date &amp; Time:</span>
                    <span className="font-semibold text-white">{createdBooking.date} at {createdBooking.startTime} – {createdBooking.endTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initial Status:</span>
                    <span className="font-bold text-amber-400">{createdBooking.status}</span>
                  </div>
                </div>
              </div>

              {/* Verification & Management Bridge Notice */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 text-left space-y-1">
                <p className="font-bold">Verify in Management Portal:</p>
                <p>
                  You can immediately search for reference <strong>{createdBooking.reference}</strong> in the Staff Portal, verify slot validation, and test receptionist confirmation or rescheduling.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/portal/appointments"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#14294A] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>Open in Staff Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setCreatedBooking(null);
                    setSelectedSlot(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Book Another Demo
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
