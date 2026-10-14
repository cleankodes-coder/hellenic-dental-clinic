export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'Rejected'
  | 'No-show';

export type UserRole = 'administrator' | 'receptionist' | 'doctor';

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  title: string;
  specialty: string;
  category: string;
  image: string;
  isAuthenticPortrait: boolean;
  gender: 'female' | 'male';
  languages: string[];
  experienceYears: number;
  education: string;
  about: string;
  expertise: string[];
  services: string[];
  workingDays: number[]; // 1 = Mon, 7 = Sun
  shiftStart: string; // e.g. "09:30"
  shiftEnd: string; // e.g. "18:00"
  slotIntervalMinutes: number;
  status: 'active' | 'on_leave' | 'inactive';
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  durationMinutes: number;
  suitableFor: string[];
  processSteps: { step: string; duration: string }[];
  faqs: { q: string; a: string }[];
  compatibleDoctorIds: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  services: ServiceItem[];
}

export interface Booking {
  id: string;
  reference: string;
  doctorId: string;
  doctorName: string;
  serviceId: string;
  serviceName: string;
  categoryName?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNotes?: string;
  status: BookingStatus;
  receptionNotes?: string;
  cancellationReason?: string;
  source: 'website' | 'portal' | 'ai_concierge' | 'phone';
  createdAt: string;
  updatedAt: string;
  // Conflict verification flags
  hasConflictWarning?: boolean;
}

export interface SlotLock {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  expiresAt: number; // Unix timestamp ms
  lockToken: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'In Review' | 'Resolved' | 'Archived';
  notes?: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'booking_rescheduled' | 'enquiry_received';
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Internal';
  recipient: string;
  title: string;
  content: string;
  timestamp: string;
  statusText: 'SIMULATED — NOT SENT';
  relatedReference?: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'booking' | 'doctor' | 'service' | 'settings' | 'enquiry';
}

export interface ClinicSettings {
  clinicHours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  minimumLeadHours: number;
  holdDurationMinutes: number;
  slotStepMinutes: number;
  bufferBetweenAppointmentsMinutes: number;
  allowInstantHold: boolean;
  notificationSimulated: boolean;
}

export interface TimeSlot {
  time: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
  reason?: 'booked' | 'held' | 'past' | 'outside_shift' | 'break' | 'time_off';
  holdExpiresInSeconds?: number;
}
