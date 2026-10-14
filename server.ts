import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dbStore, formatDubaiDate } from './server/db.ts';
import { askGeminiReceptionist } from './server/gemini.ts';
import clinicDetails from './src/data/clinic_details.json' with { type: 'json' };

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes

// 1. Clinic Info
app.get('/api/clinic', (_req: Request, res: Response) => {
  res.json({
    ...clinicDetails,
    settings: dbStore.getSettings()
  });
});

// 2. Doctors
app.get('/api/doctors', (_req: Request, res: Response) => {
  res.json(dbStore.getDoctors());
});

app.get('/api/doctors/:id', (req: Request, res: Response) => {
  const doc = dbStore.getDoctor(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doc);
});

app.put('/api/doctors/:id', (req: Request, res: Response) => {
  try {
    const actor = req.headers['x-actor-name'] as string || 'Clinic Administrator';
    const updated = dbStore.updateDoctor(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Services / Categories
app.get('/api/services', (_req: Request, res: Response) => {
  res.json(dbStore.getCategories());
});

app.get('/api/services/all', (_req: Request, res: Response) => {
  res.json(dbStore.getAllServices());
});

app.get('/api/services/:slug', (req: Request, res: Response) => {
  const service = dbStore.getService(req.params.slug);
  if (!service) return res.status(404).json({ error: 'Treatment service not found' });
  res.json(service);
});

app.put('/api/services/:slug', (req: Request, res: Response) => {
  try {
    const actor = req.headers['x-actor-name'] as string || 'Clinic Administrator';
    const updated = dbStore.updateService(req.params.slug, req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Authoritative Available Slots Engine
app.get('/api/slots/available', (req: Request, res: Response) => {
  const { doctorId, serviceId, date } = req.query as { doctorId?: string; serviceId?: string; date?: string };

  if (!doctorId || !date) {
    return res.status(400).json({ error: 'doctorId and date query parameters are required' });
  }

  let duration = 30;
  if (serviceId) {
    const service = dbStore.getService(serviceId);
    if (service) duration = service.durationMinutes;
  }

  const slots = dbStore.getAvailableSlots(doctorId, duration, date);
  res.json({
    doctorId,
    date,
    durationMinutes: duration,
    slots
  });
});

// 5. Provisional Slot Lock / Hold (Anti-Race Condition)
app.post('/api/bookings/hold', (req: Request, res: Response) => {
  try {
    const { doctorId, date, startTime, durationMinutes } = req.body;
    if (!doctorId || !date || !startTime) {
      return res.status(400).json({ error: 'doctorId, date, and startTime are required' });
    }
    const lock = dbStore.createSlotLock(doctorId, date, startTime, durationMinutes || 30);
    res.json(lock);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

// 6. Bookings (Authoritative Server Submission & Management)
app.post('/api/bookings', (req: Request, res: Response) => {
  try {
    const { doctorId, serviceId, date, startTime, patientName, patientEmail, patientPhone, patientNotes, source, lockToken } = req.body;

    if (!doctorId || !serviceId || !date || !startTime || !patientName || !patientEmail || !patientPhone) {
      return res.status(400).json({ error: 'Missing required booking details (doctor, service, date, time, patient contact)' });
    }

    const booking = dbStore.createBooking({
      doctorId,
      serviceId,
      date,
      startTime,
      patientName,
      patientEmail,
      patientPhone,
      patientNotes,
      source: source || 'website',
      lockToken
    });

    res.status(201).json(booking);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

app.get('/api/bookings', (req: Request, res: Response) => {
  const { doctorId, serviceId, date, status, search } = req.query as any;
  const bookings = dbStore.getBookings({ doctorId, serviceId, date, status, search });
  res.json(bookings);
});

app.get('/api/bookings/:idOrRef', (req: Request, res: Response) => {
  const booking = dbStore.getBooking(req.params.idOrRef);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

app.put('/api/bookings/:idOrRef/status', (req: Request, res: Response) => {
  try {
    const { status, receptionNotes, cancellationReason } = req.body;
    const actor = req.headers['x-actor-name'] as string || 'Reception Staff';
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = dbStore.updateBookingStatus(req.params.idOrRef, status, receptionNotes, cancellationReason, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

app.post('/api/bookings/:idOrRef/reschedule', (req: Request, res: Response) => {
  try {
    const { newDate, newStartTime, newDoctorId } = req.body;
    const actor = req.headers['x-actor-name'] as string || 'Reception Staff';
    if (!newDate || !newStartTime) {
      return res.status(400).json({ error: 'newDate and newStartTime are required' });
    }

    const rescheduled = dbStore.rescheduleBooking(req.params.idOrRef, newDate, newStartTime, newDoctorId, actor);
    res.json(rescheduled);
  } catch (err: any) {
    res.status(409).json({ error: err.message });
  }
});

// 7. Enquiries
app.get('/api/enquiries', (req: Request, res: Response) => {
  const { status, search } = req.query as any;
  res.json(dbStore.getEnquiries(status, search));
});

app.post('/api/enquiries', (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const enquiry = dbStore.createEnquiry({ name, email, phone, subject: subject || 'General Inquiry', message });
    res.status(201).json(enquiry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/enquiries/:id/status', (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const updated = dbStore.updateEnquiryStatus(req.params.id, status, notes);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 8. Notifications & Activity Logs
app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json(dbStore.getNotifications());
});

app.get('/api/activity', (_req: Request, res: Response) => {
  res.json(dbStore.getActivityLogs());
});

// 9. Portal Dashboard & Metrics
app.get('/api/portal/dashboard', (_req: Request, res: Response) => {
  res.json(dbStore.getDashboardMetrics());
});

// 10. Settings & Reset
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(dbStore.getSettings());
});

app.put('/api/settings', (req: Request, res: Response) => {
  try {
    const actor = req.headers['x-actor-name'] as string || 'Admin';
    const updated = dbStore.updateSettings(req.body, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/portal/reset-demo', (req: Request, res: Response) => {
  const actor = req.headers['x-actor-name'] as string || 'Administrator';
  res.json(dbStore.resetDemoData(actor));
});

// 11. Gemini AI Receptionist ('Ask Hellenic')
app.post('/api/ai-receptionist', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }
    const reply = await askGeminiReceptionist(message, history || []);
    res.json({ reply });
  } catch (err: any) {
    console.error('AI receptionist endpoint error:', err);
    res.status(500).json({ error: 'Failed to process AI request', fallback: true });
  }
});

// Frontend Serving: Vite dev middleware or static dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hellenic Dental Clinic server listening on http://0.0.0.0:${PORT} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer().catch(err => {
  console.error('Failed to start Hellenic Dental Clinic server:', err);
  process.exit(1);
});
