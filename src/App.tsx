import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AskHellenicChat } from './components/AskHellenicChat.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { TreatmentsPage } from './pages/TreatmentsPage.tsx';
import { TreatmentDetailPage } from './pages/TreatmentDetailPage.tsx';
import { DoctorsPage } from './pages/DoctorsPage.tsx';
import { DoctorProfilePage } from './pages/DoctorProfilePage.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPage, TermsPage } from './pages/LegalPages.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

// Portal Infrastructure
import { PortalProvider } from './portal/PortalContext.tsx';
import { PortalLayout } from './portal/PortalLayout.tsx';
import { PortalLogin } from './portal/pages/PortalLogin.tsx';
import { PortalDashboard } from './portal/pages/PortalDashboard.tsx';
import { PortalAppointments } from './portal/pages/PortalAppointments.tsx';
import { PortalCalendar } from './portal/pages/PortalCalendar.tsx';
import { PortalDoctors } from './portal/pages/PortalDoctors.tsx';
import { PortalServices } from './portal/pages/PortalServices.tsx';
import { PortalEnquiries } from './portal/pages/PortalEnquiries.tsx';
import { PortalNotifications } from './portal/pages/PortalNotifications.tsx';
import { PortalAnalytics } from './portal/pages/PortalAnalytics.tsx';
import { PortalAssistant } from './portal/pages/PortalAssistant.tsx';
import { PortalSettings } from './portal/pages/PortalSettings.tsx';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AskHellenicChat />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/treatments" element={<PublicLayout><TreatmentsPage /></PublicLayout>} />
        <Route path="/treatments/:slug" element={<PublicLayout><TreatmentDetailPage /></PublicLayout>} />
        <Route path="/doctors" element={<PublicLayout><DoctorsPage /></PublicLayout>} />
        <Route path="/doctors/:slug" element={<PublicLayout><DoctorProfilePage /></PublicLayout>} />
        <Route path="/book" element={<PublicLayout><BookingPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

        {/* Portal Login Route */}
        <Route 
          path="/portal/login" 
          element={
            <PortalProvider>
              <PortalLogin />
            </PortalProvider>
          } 
        />

        {/* Desktop-Only Staff Management Portal Routes */}
        <Route 
          path="/portal" 
          element={
            <PortalProvider>
              <PortalLayout />
            </PortalProvider>
          }
        >
          <Route index element={<PortalDashboard />} />
          <Route path="appointments" element={<PortalAppointments />} />
          <Route path="calendar" element={<PortalCalendar />} />
          <Route path="doctors" element={<PortalDoctors />} />
          <Route path="services" element={<PortalServices />} />
          <Route path="enquiries" element={<PortalEnquiries />} />
          <Route path="notifications" element={<PortalNotifications />} />
          <Route path="analytics" element={<PortalAnalytics />} />
          <Route path="assistant" element={<PortalAssistant />} />
          <Route path="settings" element={<PortalSettings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
