import fs from 'fs';
import path from 'path';
import { Booking, SlotLock, Enquiry, NotificationRecord, ActivityLog, ClinicSettings, Doctor, ServiceCategory, TimeSlot } from '../src/types/index.ts';

// Paths
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Initial defaults from src/data
import clinicDetails from '../src/data/clinic_details.json' with { type: 'json' };
import doctorsData from '../src/data/doctors.json' with { type: 'json' };
import serviceCatalogData from '../src/data/service_catalog.json' with { type: 'json' };
import { hellenicDoctors } from '../HellenicDoctorsEmbedded.ts';

interface StoreData {
  doctors: Doctor[];
  categories: ServiceCategory[];
  bookings: Booking[];
  slotLocks: SlotLock[];
  enquiries: Enquiry[];
  notifications: NotificationRecord[];
  activityLogs: ActivityLog[];
  settings: ClinicSettings;
}

const defaultSettings: ClinicSettings = {
  clinicHours: {
    weekday: "09:30 – 20:00",
    saturday: "09:30 – 19:00",
    sunday: "11:00 – 17:00"
  },
  minimumLeadHours: 2,
  holdDurationMinutes: 10,
  slotStepMinutes: 15,
  bufferBetweenAppointmentsMinutes: 0,
  allowInstantHold: true,
  notificationSimulated: true
};

// Helper: current Dubai time string or Date
export function getDubaiTime(): Date {
  // Current ISO date
  return new Date();
}

export function formatDubaiDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate realistic synthetic seed bookings around current date
function generateSeedBookings(): Booking[] {
  const today = new Date();
  const todayStr = formatDubaiDate(today);

  // Tomorrow
  const tomorrow = new Date(today.getTime() + 86400000);
  const tomorrowStr = formatDubaiDate(tomorrow);

  // Day after tomorrow
  const dayAfter = new Date(today.getTime() + 86400000 * 2);
  const dayAfterStr = formatDubaiDate(dayAfter);

  return [
    {
      id: 'book-1001',
      reference: 'HDC-8491',
      doctorId: 'dr-eleni-tzomaa',
      doctorName: 'Dr. Eleni Tzomaa',
      serviceId: 'porcelain-veneers',
      serviceName: 'Custom Porcelain Veneers',
      categoryName: 'Cosmetic & Aesthetic Dentistry',
      date: todayStr,
      startTime: '10:30',
      endTime: '11:30',
      durationMinutes: 60,
      patientName: 'Sophia Al-Mansoor (Demo)',
      patientEmail: 'sophia.demo@example.com',
      patientPhone: '+971 50 248 1192',
      patientNotes: 'Requesting consultation on upper arch aesthetic veneer replacement.',
      status: 'Confirmed',
      receptionNotes: 'Verified patient record; smile mock-up prepared.',
      source: 'website',
      createdAt: new Date(today.getTime() - 86400000 * 2).toISOString(),
      updatedAt: new Date(today.getTime() - 86400000).toISOString()
    },
    {
      id: 'book-1002',
      reference: 'HDC-9204',
      doctorId: 'dr-mada-jeshi',
      doctorName: 'Dr. Mada Jeshi',
      serviceId: 'clear-aligners',
      serviceName: 'Digital Clear Aligners',
      categoryName: 'Orthodontics & Aligner Therapy',
      date: todayStr,
      startTime: '14:00',
      endTime: '14:45',
      durationMinutes: 45,
      patientName: 'Alexander Vance (Demo)',
      patientEmail: 'alex.vance.test@example.com',
      patientPhone: '+971 55 918 3042',
      patientNotes: 'Interested in invisible aligner progression scan.',
      status: 'Pending',
      receptionNotes: 'Requires digital radiograph confirmation upon arrival.',
      source: 'website',
      createdAt: new Date(today.getTime() - 3600000 * 4).toISOString(),
      updatedAt: new Date(today.getTime() - 3600000 * 4).toISOString()
    },
    {
      id: 'book-1003',
      reference: 'HDC-7153',
      doctorId: 'dr-mohammad-hayem',
      doctorName: 'Dr. Mohammad Hayem',
      serviceId: 'dental-implants',
      serviceName: 'Precision Dental Implants',
      categoryName: 'Oral Surgery & Dental Implants',
      date: tomorrowStr,
      startTime: '11:00',
      endTime: '12:00',
      durationMinutes: 60,
      patientName: 'Mariam Al-Hashemi (Demo)',
      patientEmail: 'mariam.h.test@example.com',
      patientPhone: '+971 52 401 8831',
      patientNotes: 'Evaluation for lower molar implant restoration.',
      status: 'Confirmed',
      receptionNotes: 'CBCT scan uploaded from partner imaging center.',
      source: 'portal',
      createdAt: new Date(today.getTime() - 86400000 * 3).toISOString(),
      updatedAt: new Date(today.getTime() - 86400000 * 2).toISOString()
    },
    {
      id: 'book-1004',
      reference: 'HDC-6382',
      doctorId: 'dr-firas-alshak-khallel',
      doctorName: 'Dr. Firas Alshak Khallel',
      serviceId: 'root-canal-therapy',
      serviceName: 'Microscopic Root Canal Therapy',
      categoryName: 'Restorative Dentistry & Endodontics',
      date: tomorrowStr,
      startTime: '15:30',
      endTime: '16:30',
      durationMinutes: 60,
      patientName: 'Omar Farooq (Demo)',
      patientEmail: 'omar.f.sample@example.com',
      patientPhone: '+971 50 677 2390',
      patientNotes: 'Cold sensitivity in upper left first molar.',
      status: 'Pending',
      receptionNotes: 'Awaiting reception review of provisional hold.',
      source: 'ai_concierge',
      createdAt: new Date(today.getTime() - 3600000 * 2).toISOString(),
      updatedAt: new Date(today.getTime() - 3600000 * 2).toISOString()
    },
    {
      id: 'book-1005',
      reference: 'HDC-5129',
      doctorId: 'dr-majd-alrabadi',
      doctorName: 'Dr. Majd Alrabadi',
      serviceId: 'teeth-whitening',
      serviceName: 'Professional Laser Teeth Whitening',
      categoryName: 'Cosmetic & Aesthetic Dentistry',
      date: dayAfterStr,
      startTime: '12:00',
      endTime: '12:45',
      durationMinutes: 45,
      patientName: 'Elena Rostova (Demo)',
      patientEmail: 'elena.rostova.test@example.com',
      patientPhone: '+971 54 819 4432',
      patientNotes: 'Pre-wedding in-office laser whitening session.',
      status: 'Confirmed',
      receptionNotes: 'Airflow stain removal recommended first.',
      source: 'website',
      createdAt: new Date(today.getTime() - 86400000).toISOString(),
      updatedAt: new Date(today.getTime() - 3600000 * 12).toISOString()
    }
  ];
}

function generateSeedEnquiries(): Enquiry[] {
  const now = new Date();
  return [
    {
      id: 'enq-101',
      name: 'Nathalie Dupont (Demo)',
      email: 'nathalie.d@example.com',
      phone: '+971 50 789 0123',
      subject: 'Inquiry regarding porcelain veneers consultation',
      message: 'Hello, I am visiting Dubai next month and would like to understand if veneers can be fabricated within a 10-day trip. Thank you.',
      status: 'New',
      notes: 'Doctor Eleni reviewed; requires 3D digital scan upon arrival.',
      createdAt: new Date(now.getTime() - 3600000 * 5).toISOString()
    },
    {
      id: 'enq-102',
      name: 'Tariq Al-Sabah (Demo)',
      email: 'tariq.alsabah@example.com',
      phone: '+971 55 456 7890',
      subject: 'Wisdom tooth extraction recovery time',
      message: 'I have a partially erupted wisdom tooth with mild discomfort. Could you confirm if sedation is available?',
      status: 'In Review',
      notes: 'Referred to Dr. Mohammad Hayem surgical team.',
      createdAt: new Date(now.getTime() - 86400000).toISOString()
    }
  ];
}

function generateSeedNotifications(): NotificationRecord[] {
  const now = new Date();
  return [
    {
      id: 'notif-1',
      type: 'booking_confirmed',
      channel: 'SMS',
      recipient: '+971 50 248 1192',
      title: 'Appointment Confirmed — HDC-8491',
      content: 'Dear Sophia, your appointment with Dr. Eleni Tzomaa for Custom Porcelain Veneers is confirmed today at 10:30 AM at Hellenic Dental Clinic, Al Wasl Road.',
      timestamp: new Date(now.getTime() - 3600000 * 8).toISOString(),
      statusText: 'SIMULATED — NOT SENT',
      relatedReference: 'HDC-8491'
    },
    {
      id: 'notif-2',
      type: 'booking_request',
      channel: 'WhatsApp',
      recipient: '+971 55 918 3042',
      title: 'Request Received — HDC-9204',
      content: 'Hello Alexander, Hellenic Dental Clinic received your request for Digital Clear Aligners with Dr. Mada Jeshi. Our reception team will review slot availability shortly.',
      timestamp: new Date(now.getTime() - 3600000 * 4).toISOString(),
      statusText: 'SIMULATED — NOT SENT',
      relatedReference: 'HDC-9204'
    }
  ];
}

function generateSeedActivity(): ActivityLog[] {
  const now = new Date();
  return [
    {
      id: 'act-1',
      actor: 'Receptionist Sarah (Staff)',
      actorRole: 'receptionist',
      action: 'Confirmed Appointment',
      details: 'Confirmed HDC-8491 for Sophia Al-Mansoor after verifying room availability.',
      timestamp: new Date(now.getTime() - 3600000 * 8).toISOString(),
      category: 'booking'
    },
    {
      id: 'act-2',
      actor: 'Online Booking Engine',
      actorRole: 'system',
      action: 'Created Request',
      details: 'New appointment request HDC-9204 created with provisional slot hold.',
      timestamp: new Date(now.getTime() - 3600000 * 4).toISOString(),
      category: 'booking'
    }
  ];
}

class Database {
  private data: StoreData;

  constructor() {
    this.data = this.loadOrInit();
  }

  private loadOrInit(): StoreData {
    const enrichDoctorRecords = (docs: Doctor[]): Doctor[] => {
      return docs.map(doc => {
        const norm = doc.id.toLowerCase().replace(/^dr-/, '');
        const embedded = hellenicDoctors.find(
          ed => ed.id.toLowerCase().replace(/^dr-/, '') === norm || ed.name.toLowerCase() === doc.name.toLowerCase()
        );
        if (embedded) {
          return {
            ...doc,
            name: embedded.name || doc.name,
            image: embedded.image || doc.image,
            isAuthenticPortrait: embedded.authenticPortrait,
          };
        }
        return doc;
      });
    };

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed: StoreData = JSON.parse(raw);
        if (parsed.doctors && Array.isArray(parsed.doctors)) {
          parsed.doctors = enrichDoctorRecords(parsed.doctors);
          this.save(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing store. Initializing seed data.', e);
    }

    const initial: StoreData = {
      doctors: enrichDoctorRecords(doctorsData as Doctor[]),
      categories: serviceCatalogData as ServiceCategory[],
      bookings: generateSeedBookings(),
      slotLocks: [],
      enquiries: generateSeedEnquiries(),
      notifications: generateSeedNotifications(),
      activityLogs: generateSeedActivity(),
      settings: defaultSettings
    };

    this.save(initial);
    return initial;
  }

  private save(dataToSave?: StoreData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving store to disk:', e);
    }
  }

  // Doctors
  public getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  public getDoctor(id: string): Doctor | undefined {
    return this.data.doctors.find(d => d.id === id || d.slug === id);
  }

  public updateDoctor(id: string, updates: Partial<Doctor>, actor = 'Admin'): Doctor {
    const idx = this.data.doctors.findIndex(d => d.id === id || d.slug === id);
    if (idx === -1) throw new Error('Doctor not found');
    this.data.doctors[idx] = { ...this.data.doctors[idx], ...updates };
    this.logActivity(actor, 'administrator', 'Updated Doctor Profile', `Updated doctor record for ${this.data.doctors[idx].name}`, 'doctor');
    this.save();
    return this.data.doctors[idx];
  }

  // Services
  public getCategories(): ServiceCategory[] {
    return this.data.categories;
  }

  public getAllServices(): (ServiceCategory['services'][0] & { categoryName: string; categoryId: string })[] {
    const result: (ServiceCategory['services'][0] & { categoryName: string; categoryId: string })[] = [];
    for (const cat of this.data.categories) {
      for (const s of cat.services) {
        result.push({
          ...s,
          categoryId: cat.id,
          categoryName: cat.name
        });
      }
    }
    return result;
  }

  public getService(idOrSlug: string) {
    for (const cat of this.data.categories) {
      const match = cat.services.find(s => s.id === idOrSlug || s.slug === idOrSlug);
      if (match) {
        return { ...match, categoryId: cat.id, categoryName: cat.name };
      }
    }
    return undefined;
  }

  public updateService(idOrSlug: string, updates: Partial<ServiceCategory['services'][0]>, actor = 'Admin') {
    for (const cat of this.data.categories) {
      const idx = cat.services.findIndex(s => s.id === idOrSlug || s.slug === idOrSlug);
      if (idx !== -1) {
        cat.services[idx] = { ...cat.services[idx], ...updates };
        this.logActivity(actor, 'administrator', 'Updated Service Catalog', `Updated treatment ${cat.services[idx].name}`, 'service');
        this.save();
        return cat.services[idx];
      }
    }
    throw new Error('Service not found');
  }

  // Clean expired slot locks
  private cleanExpiredLocks() {
    const now = Date.now();
    this.data.slotLocks = this.data.slotLocks.filter(l => l.expiresAt > now);
  }

  // Real, Authoritative Slot Calculation Engine
  public getAvailableSlots(doctorId: string, serviceDurationMinutes: number, dateStr: string): TimeSlot[] {
    this.cleanExpiredLocks();

    const doctor = this.getDoctor(doctorId);
    if (!doctor || doctor.status !== 'active') {
      return [];
    }

    // Determine Day of week: 1 (Mon) to 7 (Sun)
    // Date parsing in YYYY-MM-DD
    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    let dayOfWeek = targetDate.getDay(); // 0 is Sun in JS
    if (dayOfWeek === 0) dayOfWeek = 7; // Map Sun to 7

    // Check if doctor works on this day
    if (!doctor.workingDays.includes(dayOfWeek)) {
      return [];
    }

    // Clinic hours check
    let clinicOpen = "09:30";
    let clinicClose = "20:00";
    if (dayOfWeek === 6) {
      clinicClose = "19:00";
    } else if (dayOfWeek === 7) {
      clinicOpen = "11:00";
      clinicClose = "17:00";
    }

    // Effective shift is intersection of doctor shift and clinic hours
    const shiftStart = doctor.shiftStart > clinicOpen ? doctor.shiftStart : clinicOpen;
    const shiftEnd = doctor.shiftEnd < clinicClose ? doctor.shiftEnd : clinicClose;

    // Helper: convert HH:mm to minutes from midnight
    const toMinutes = (timeStr: string) => {
      const [hh, mm] = timeStr.split(':').map(Number);
      return hh * 60 + mm;
    };
    const toTimeStr = (mins: number) => {
      const hh = Math.floor(mins / 60);
      const mm = mins % 60;
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    const startMins = toMinutes(shiftStart);
    const endMins = toMinutes(shiftEnd);
    const step = this.data.settings.slotStepMinutes || 15;
    const duration = serviceDurationMinutes || 30;

    // Get doctor bookings on this date (Confirmed and non-cancelled Pending)
    const activeBookings = this.data.bookings.filter(b => 
      b.doctorId === doctor.id &&
      b.date === dateStr &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected'
    );

    // Active slot locks for this doctor on this date
    const now = Date.now();
    const activeLocks = this.data.slotLocks.filter(l =>
      l.doctorId === doctor.id &&
      l.date === dateStr &&
      l.expiresAt > now
    );

    const slots: TimeSlot[] = [];

    // Loop through shift intervals
    for (let slotStart = startMins; slotStart + duration <= endMins; slotStart += step) {
      const slotEnd = slotStart + duration;
      const timeStr = toTimeStr(slotStart);
      const endTimeStr = toTimeStr(slotEnd);

      // Check conflict with active bookings
      let isBooked = false;
      for (const b of activeBookings) {
        const bStart = toMinutes(b.startTime);
        const bEnd = toMinutes(b.endTime);
        // Overlap condition: max(start1, start2) < min(end1, end2)
        if (Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd)) {
          isBooked = true;
          break;
        }
      }

      // Check conflict with active slot locks
      let isHeld = false;
      let holdExpiresIn = 0;
      for (const l of activeLocks) {
        const lStart = toMinutes(l.startTime);
        const lEnd = lStart + l.durationMinutes;
        if (Math.max(slotStart, lStart) < Math.min(slotEnd, lEnd)) {
          isHeld = true;
          holdExpiresIn = Math.max(0, Math.floor((l.expiresAt - now) / 1000));
          break;
        }
      }

      if (isBooked) {
        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          available: false,
          reason: 'booked'
        });
      } else if (isHeld) {
        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          available: false,
          reason: 'held',
          holdExpiresInSeconds: holdExpiresIn
        });
      } else {
        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          available: true
        });
      }
    }

    return slots;
  }

  // Mutex Hold / Provisional Lock
  public createSlotLock(doctorId: string, date: string, startTime: string, durationMinutes: number): SlotLock {
    this.cleanExpiredLocks();

    // Check if already booked or held
    const [hh, mm] = startTime.split(':').map(Number);
    const startMins = hh * 60 + mm;
    const endMins = startMins + durationMinutes;

    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    // Check booking overlap
    const conflictBooking = this.data.bookings.find(b =>
      b.doctorId === doctorId &&
      b.date === date &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected' &&
      Math.max(startMins, toMinutes(b.startTime)) < Math.min(endMins, toMinutes(b.endTime))
    );

    if (conflictBooking) {
      throw new Error('This slot is already booked. Please choose another time.');
    }

    const now = Date.now();
    const conflictLock = this.data.slotLocks.find(l =>
      l.doctorId === doctorId &&
      l.date === date &&
      l.expiresAt > now &&
      Math.max(startMins, toMinutes(l.startTime)) < Math.min(endMins, toMinutes(l.startTime) + l.durationMinutes)
    );

    if (conflictLock) {
      throw new Error('This slot is temporarily held by another patient. Please wait or pick another time.');
    }

    const holdMs = (this.data.settings.holdDurationMinutes || 10) * 60 * 1000;
    const lock: SlotLock = {
      id: 'lock-' + Math.random().toString(36).substring(2, 9),
      doctorId,
      date,
      startTime,
      durationMinutes,
      expiresAt: now + holdMs,
      lockToken: 'token-' + Math.random().toString(36).substring(2, 11)
    };

    this.data.slotLocks.push(lock);
    this.save();
    return lock;
  }

  public releaseSlotLock(lockIdOrToken: string) {
    this.data.slotLocks = this.data.slotLocks.filter(l => l.id !== lockIdOrToken && l.lockToken !== lockIdOrToken);
    this.save();
  }

  // Create authoritative booking
  public createBooking(payload: {
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientNotes?: string;
    source?: Booking['source'];
    lockToken?: string;
  }): Booking {
    this.cleanExpiredLocks();

    const doctor = this.getDoctor(payload.doctorId);
    if (!doctor) throw new Error('Selected doctor not found');

    const service = this.getService(payload.serviceId);
    if (!service) throw new Error('Selected service not found');

    const duration = service.durationMinutes || 30;
    const [hh, mm] = payload.startTime.split(':').map(Number);
    const startMins = hh * 60 + mm;
    const endMins = startMins + duration;

    const toTimeStr = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    const endTime = toTimeStr(endMins);

    // Server-Authoritative Conflict Validation:
    // Ensure no overlapping confirmed or non-cancelled booking exists for this doctor
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const conflict = this.data.bookings.find(b =>
      b.doctorId === doctor.id &&
      b.date === payload.date &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected' &&
      Math.max(startMins, toMinutes(b.startTime)) < Math.min(endMins, toMinutes(b.endTime))
    );

    if (conflict) {
      throw new Error(`Scheduling Conflict: ${doctor.name} already has an appointment (${conflict.reference}) overlapping ${payload.startTime} - ${endTime}. Please select another slot.`);
    }

    // Release any associated lock
    if (payload.lockToken) {
      this.releaseSlotLock(payload.lockToken);
    }

    const refNumber = Math.floor(1000 + Math.random() * 9000);
    const reference = `HDC-${refNumber}`;
    const nowIso = new Date().toISOString();

    const newBooking: Booking = {
      id: 'book-' + Math.random().toString(36).substring(2, 9),
      reference,
      doctorId: doctor.id,
      doctorName: doctor.name,
      serviceId: service.id,
      serviceName: service.name,
      categoryName: service.categoryName,
      date: payload.date,
      startTime: payload.startTime,
      endTime,
      durationMinutes: duration,
      patientName: payload.patientName,
      patientEmail: payload.patientEmail,
      patientPhone: payload.patientPhone,
      patientNotes: payload.patientNotes || '',
      status: 'Pending', // Must start as Pending
      source: payload.source || 'website',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.data.bookings.unshift(newBooking);

    // Create Simulated Notification Record
    this.data.notifications.unshift({
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      type: 'booking_request',
      channel: 'SMS',
      recipient: payload.patientPhone,
      title: `Booking Request Received — ${reference}`,
      content: `Dear ${payload.patientName}, your demo appointment request with ${doctor.name} on ${payload.date} at ${payload.startTime} has been recorded (Status: Pending). Ref: ${reference}.`,
      timestamp: nowIso,
      statusText: 'SIMULATED — NOT SENT',
      relatedReference: reference
    });

    this.logActivity(
      payload.patientName + ' (Patient)',
      'patient',
      'Submitted Booking Request',
      `Submitted request for ${service.name} with ${doctor.name} on ${payload.date} at ${payload.startTime}. Status: Pending.`,
      'booking'
    );

    this.save();
    return newBooking;
  }

  // Update Booking Status with Re-Validation
  public updateBookingStatus(
    idOrRef: string,
    newStatus: Booking['status'],
    receptionNotes?: string,
    cancellationReason?: string,
    actor = 'Reception Staff'
  ): Booking {
    const booking = this.data.bookings.find(b => b.id === idOrRef || b.reference === idOrRef);
    if (!booking) throw new Error('Booking not found');

    const nowIso = new Date().toISOString();

    // If attempting to confirm, perform authoritative re-validation to protect against race conditions
    if (newStatus === 'Confirmed' && booking.status !== 'Confirmed') {
      const toMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      const bStart = toMinutes(booking.startTime);
      const bEnd = toMinutes(booking.endTime);

      const conflict = this.data.bookings.find(b =>
        b.id !== booking.id &&
        b.doctorId === booking.doctorId &&
        b.date === booking.date &&
        b.status === 'Confirmed' &&
        Math.max(bStart, toMinutes(b.startTime)) < Math.min(bEnd, toMinutes(b.endTime))
      );

      if (conflict) {
        throw new Error(`Confirmation Conflict: Dr. ${booking.doctorName} already has another Confirmed booking (${conflict.reference}) during ${booking.startTime} - ${booking.endTime}. Please re-schedule to another slot before confirming.`);
      }
    }

    const prevStatus = booking.status;
    booking.status = newStatus;
    if (receptionNotes !== undefined) booking.receptionNotes = receptionNotes;
    if (cancellationReason !== undefined) booking.cancellationReason = cancellationReason;
    booking.updatedAt = nowIso;

    // Trigger Simulated Notification
    let notifTitle = `Appointment ${newStatus} — ${booking.reference}`;
    let notifContent = `Dear ${booking.patientName}, your demo appointment (${booking.reference}) status is now ${newStatus}.`;
    if (newStatus === 'Confirmed') {
      notifContent = `Dear ${booking.patientName}, your appointment with ${booking.doctorName} on ${booking.date} at ${booking.startTime} is now CONFIRMED. Clinic address: Al Wasl Road, Dubai.`;
    } else if (newStatus === 'Cancelled') {
      notifContent = `Dear ${booking.patientName}, your appointment (${booking.reference}) has been cancelled. Reason: ${cancellationReason || 'Patient/Reception request'}.`;
    }

    this.data.notifications.unshift({
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      type: newStatus === 'Confirmed' ? 'booking_confirmed' : newStatus === 'Cancelled' ? 'booking_cancelled' : 'booking_request',
      channel: 'SMS',
      recipient: booking.patientPhone,
      title: notifTitle,
      content: notifContent,
      timestamp: nowIso,
      statusText: 'SIMULATED — NOT SENT',
      relatedReference: booking.reference
    });

    this.logActivity(
      actor,
      'receptionist',
      `Changed Status: ${prevStatus} ➔ ${newStatus}`,
      `Appointment ${booking.reference} updated to ${newStatus}. ${receptionNotes ? 'Note: ' + receptionNotes : ''}`,
      'booking'
    );

    this.save();
    return booking;
  }

  // Reschedule Booking with Authoritative Validation
  public rescheduleBooking(
    idOrRef: string,
    newDate: string,
    newStartTime: string,
    newDoctorId?: string,
    actor = 'Reception Staff'
  ): Booking {
    const booking = this.data.bookings.find(b => b.id === idOrRef || b.reference === idOrRef);
    if (!booking) throw new Error('Booking not found');

    const doctorId = newDoctorId || booking.doctorId;
    const doctor = this.getDoctor(doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const duration = booking.durationMinutes || 30;
    const [hh, mm] = newStartTime.split(':').map(Number);
    const startMins = hh * 60 + mm;
    const endMins = startMins + duration;

    const toTimeStr = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    const newEndTime = toTimeStr(endMins);

    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    // Check conflict
    const conflict = this.data.bookings.find(b =>
      b.id !== booking.id &&
      b.doctorId === doctorId &&
      b.date === newDate &&
      b.status !== 'Cancelled' &&
      b.status !== 'Rejected' &&
      Math.max(startMins, toMinutes(b.startTime)) < Math.min(endMins, toMinutes(b.endTime))
    );

    if (conflict) {
      throw new Error(`Conflict on proposed new time: Dr. ${doctor.name} already has appointment (${conflict.reference}) during ${newStartTime} - ${newEndTime}.`);
    }

    const prevDate = booking.date;
    const prevTime = booking.startTime;

    booking.date = newDate;
    booking.startTime = newStartTime;
    booking.endTime = newEndTime;
    booking.doctorId = doctor.id;
    booking.doctorName = doctor.name;
    booking.updatedAt = new Date().toISOString();

    this.data.notifications.unshift({
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      type: 'booking_rescheduled',
      channel: 'SMS',
      recipient: booking.patientPhone,
      title: `Appointment Rescheduled — ${booking.reference}`,
      content: `Dear ${booking.patientName}, your appointment has been rescheduled from ${prevDate} ${prevTime} to ${newDate} at ${newStartTime} with ${doctor.name}.`,
      timestamp: new Date().toISOString(),
      statusText: 'SIMULATED — NOT SENT',
      relatedReference: booking.reference
    });

    this.logActivity(
      actor,
      'receptionist',
      'Rescheduled Appointment',
      `Booking ${booking.reference} moved from ${prevDate} ${prevTime} to ${newDate} ${newStartTime}`,
      'booking'
    );

    this.save();
    return booking;
  }

  // Get Bookings with filters
  public getBookings(filters?: {
    doctorId?: string;
    serviceId?: string;
    date?: string;
    status?: string;
    search?: string;
  }): Booking[] {
    return this.data.bookings.filter(b => {
      if (filters?.doctorId && filters.doctorId !== 'all' && b.doctorId !== filters.doctorId) return false;
      if (filters?.serviceId && filters.serviceId !== 'all' && b.serviceId !== filters.serviceId) return false;
      if (filters?.date && b.date !== filters.date) return false;
      if (filters?.status && filters.status !== 'all' && b.status !== filters.status) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matchesRef = b.reference.toLowerCase().includes(q);
        const matchesName = b.patientName.toLowerCase().includes(q);
        const matchesPhone = b.patientPhone.toLowerCase().includes(q);
        const matchesEmail = b.patientEmail.toLowerCase().includes(q);
        if (!matchesRef && !matchesName && !matchesPhone && !matchesEmail) return false;
      }
      return true;
    });
  }

  public getBooking(idOrRef: string): Booking | undefined {
    return this.data.bookings.find(b => b.id === idOrRef || b.reference === idOrRef);
  }

  // Enquiries
  public getEnquiries(status?: string, search?: string): Enquiry[] {
    return this.data.enquiries.filter(e => {
      if (status && status !== 'all' && e.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  public createEnquiry(payload: { name: string; email: string; phone?: string; subject: string; message: string }): Enquiry {
    const enq: Enquiry = {
      id: 'enq-' + Math.random().toString(36).substring(2, 9),
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      subject: payload.subject,
      message: payload.message,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(enq);

    this.logActivity(payload.name, 'patient', 'Submitted Enquiry', `Contact enquiry: ${payload.subject}`, 'enquiry');
    this.save();
    return enq;
  }

  public updateEnquiryStatus(id: string, status: Enquiry['status'], notes?: string): Enquiry {
    const enq = this.data.enquiries.find(e => e.id === id);
    if (!enq) throw new Error('Enquiry not found');
    enq.status = status;
    if (notes !== undefined) enq.notes = notes;
    this.save();
    return enq;
  }

  // Notifications
  public getNotifications(): NotificationRecord[] {
    return this.data.notifications;
  }

  // Activity Logs
  public getActivityLogs(): ActivityLog[] {
    return this.data.activityLogs;
  }

  public logActivity(actor: string, actorRole: string, action: string, details: string, category: ActivityLog['category']) {
    this.data.activityLogs.unshift({
      id: 'act-' + Math.random().toString(36).substring(2, 9),
      actor,
      actorRole,
      action,
      details,
      timestamp: new Date().toISOString(),
      category
    });
    // Keep max 200 logs
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 200);
    }
  }

  // Settings
  public getSettings(): ClinicSettings {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<ClinicSettings>, actor = 'Admin'): ClinicSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.logActivity(actor, 'administrator', 'Updated Clinic Settings', 'Modified clinic operational parameters & rules', 'settings');
    this.save();
    return this.data.settings;
  }

  // Dashboard Metrics Computation (Real time from authoritative records)
  public getDashboardMetrics() {
    const todayStr = formatDubaiDate(new Date());
    const bookings = this.data.bookings;

    const todayAppointments = bookings.filter(b => b.date === todayStr && b.status !== 'Cancelled' && b.status !== 'Rejected');
    const pendingRequests = bookings.filter(b => b.status === 'Pending');
    const confirmedTotal = bookings.filter(b => b.status === 'Confirmed');
    const completedTotal = bookings.filter(b => b.status === 'Completed');
    const cancelledTotal = bookings.filter(b => b.status === 'Cancelled' || b.status === 'Rejected');

    // Doctor utilization (number of bookings per doctor)
    const doctorUtilization = this.data.doctors.map(doc => {
      const docBookings = bookings.filter(b => b.doctorId === doc.id && b.status !== 'Cancelled');
      return {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        totalBookings: docBookings.length,
        todayBookings: docBookings.filter(b => b.date === todayStr).length
      };
    });

    // Service popularity
    const serviceCounts: Record<string, number> = {};
    for (const b of bookings) {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
    }
    const popularServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Source breakdown
    const sourceBreakdown: Record<string, number> = {
      website: 0,
      portal: 0,
      ai_concierge: 0,
      phone: 0
    };
    for (const b of bookings) {
      sourceBreakdown[b.source] = (sourceBreakdown[b.source] || 0) + 1;
    }

    // Status breakdown
    const statusCounts: Record<string, number> = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      'No-show': 0
    };
    for (const b of bookings) {
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status]++;
      }
    }

    return {
      todayCount: todayAppointments.length,
      pendingCount: pendingRequests.length,
      confirmedCount: confirmedTotal.length,
      completedCount: completedTotal.length,
      cancelledCount: cancelledTotal.length,
      totalCount: bookings.length,
      todayAppointments,
      pendingRequests: pendingRequests.slice(0, 6),
      recentActivity: this.data.activityLogs.slice(0, 8),
      doctorUtilization,
      popularServices,
      sourceBreakdown,
      statusCounts
    };
  }

  // Controlled Demo Data Reset
  public resetDemoData(actor = 'Admin') {
    this.data.bookings = generateSeedBookings();
    this.data.slotLocks = [];
    this.data.enquiries = generateSeedEnquiries();
    this.data.notifications = generateSeedNotifications();
    this.data.activityLogs = generateSeedActivity();
    this.data.settings = { ...defaultSettings };
    this.logActivity(actor, 'administrator', 'Reset Demo Records', 'Authoritative demo records refreshed to initial state', 'settings');
    this.save();
    return { success: true, message: 'Synthetic demo data reset successfully' };
  }
}

export const dbStore = new Database();
