import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Ensure target directories exist
const dirs = [
  'public/assets/brand',
  'public/assets/doctors/portraits',
  'public/assets/doctors/placeholders'
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// 1. Hellenic Dental Symbol (Blue tooth geometric emblem)
const emblemSvg = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F1F38" />
      <stop offset="50%" stop-color="#14294A" />
      <stop offset="100%" stop-color="#0A1628" />
    </linearGradient>
    <linearGradient id="toothGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="40%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <linearGradient id="toothGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#1E40AF" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#93C5FD" />
      <stop offset="100%" stop-color="#E0F2FE" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" rx="48" fill="url(#bgGrad)" />

  <!-- Subtle Greek Key / Luxury Ring Accent -->
  <circle cx="300" cy="300" r="230" fill="none" stroke="#2563EB" stroke-width="2" stroke-opacity="0.3" stroke-dasharray="8 6" />
  <circle cx="300" cy="300" r="215" fill="none" stroke="#38BDF8" stroke-width="1" stroke-opacity="0.2" />

  <!-- The Distinctive Multifaceted Blue Tooth Emblem of Hellenic Dental Clinic -->
  <g filter="url(#glow)">
    <!-- Main Tooth Crown & Roots Silhouette -->
    <!-- Left Cusp & Root -->
    <path d="M 300 130 
             C 240 120, 180 150, 170 230 
             C 160 300, 190 380, 230 460 
             C 245 490, 260 480, 270 430 
             C 285 360, 295 330, 300 320 
             Z" 
          fill="url(#toothGrad1)" />

    <!-- Right Cusp & Root -->
    <path d="M 300 130 
             C 360 120, 420 150, 430 230 
             C 440 300, 410 380, 370 460 
             C 355 490, 340 480, 330 430 
             C 315 360, 305 330, 300 320 
             Z" 
          fill="url(#toothGrad2)" />

    <!-- Geometric Facets & Architectural Diamond Cutlines -->
    <path d="M 300 140 L 250 220 L 300 270 L 350 220 Z" fill="url(#accentGrad)" opacity="0.9" />
    <path d="M 250 220 L 190 230 L 220 310 L 300 270 Z" fill="#3B82F6" opacity="0.65" />
    <path d="M 350 220 L 410 230 L 380 310 L 300 270 Z" fill="#1D4ED8" opacity="0.75" />
    <path d="M 300 270 L 220 310 L 245 420 L 285 360 Z" fill="#1E3A8A" opacity="0.85" />
    <path d="M 300 270 L 380 310 L 355 420 L 315 360 Z" fill="#2563EB" opacity="0.7" />
  </g>

  <!-- Crown highlight shine -->
  <circle cx="280" cy="180" r="16" fill="#FFFFFF" opacity="0.6" filter="blur(4px)" />
</svg>
`;

// Helper to generate doctor portrait card
function generateDoctorCardSvg(name, title, specialty, initials, isPlaceholder = false) {
  const bgNavy = '#0F1F38';
  const accentBlue = isPlaceholder ? '#64748B' : '#2563EB';
  const badgeColor = isPlaceholder ? '#475569' : '#1D4ED8';
  
  if (isPlaceholder) {
    return `
    <svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="placeholderBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="50%" stop-color="#334155" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="600" height="750" fill="url(#placeholderBg)" />
      
      <!-- Subtle luxury grid lines -->
      <line x1="50" y1="0" x2="50" y2="750" stroke="#475569" stroke-opacity="0.15" stroke-width="1" />
      <line x1="550" y1="0" x2="550" y2="750" stroke="#475569" stroke-opacity="0.15" stroke-width="1" />
      <line x1="0" y1="600" x2="600" y2="600" stroke="#475569" stroke-opacity="0.15" stroke-width="1" />

      <!-- Minimal Silhouette Head & Shoulders -->
      <g transform="translate(300, 280)">
        <circle cx="0" cy="-60" r="90" fill="#94A3B8" opacity="0.35" />
        <path d="M -150 160 C -150 40, 150 40, 150 160 Z" fill="#94A3B8" opacity="0.35" />
        <!-- Stethoscope abstract curve -->
        <path d="M -70 50 C -70 110, 70 110, 70 50" fill="none" stroke="#64748B" stroke-width="6" opacity="0.6" />
        <circle cx="0" cy="115" r="14" fill="#64748B" opacity="0.6" />
      </g>

      <!-- Label Ribbon at bottom -->
      <rect x="50" y="580" width="500" height="120" rx="16" fill="#0F172A" fill-opacity="0.9" stroke="#475569" stroke-width="1" />
      <text x="300" y="625" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#F8FAFC" text-anchor="middle">${name}</text>
      <text x="300" y="655" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#94A3B8" text-anchor="middle">${title}</text>
      <text x="300" y="682" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#38BDF8" letter-spacing="1.5" text-anchor="middle">PROVISIONAL ROSTER • OFFICIAL PORTRAIT PENDING</text>
    </svg>
    `;
  }

  // Authentic Doctor Portrait Card (High resolution clinical portrait design)
  return `
  <svg width="600" height="750" viewBox="0 0 600 750" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14294A" />
        <stop offset="40%" stop-color="#1E3A8A" />
        <stop offset="100%" stop-color="#0A1628" />
      </linearGradient>
      <linearGradient id="avatarGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="100%" stop-color="#1D4ED8" />
      </linearGradient>
      <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity="0.4" />
      </filter>
    </defs>
    
    <rect width="600" height="750" fill="url(#docGrad)" />

    <!-- Hellenic Greek Architectural geometric backdrop lines -->
    <circle cx="300" cy="260" r="180" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="6 4" />
    <circle cx="300" cy="260" r="210" fill="none" stroke="#2563EB" stroke-width="1" stroke-opacity="0.15" />

    <!-- Doctor Silhouette Avatar Centerpiece with Initials -->
    <g transform="translate(300, 260)">
      <circle cx="0" cy="0" r="130" fill="#0F172A" stroke="url(#avatarGlow)" stroke-width="5" filter="url(#cardShadow)" />
      
      <!-- Doctor Icon Profile Silhouette -->
      <path d="M 0 -50 C 25 -50 45 -30 45 -5 C 45 20 25 40 0 40 C -25 40 -45 20 -45 -5 C -45 -30 -25 -50 0 -50 Z" fill="#E2E8F0" opacity="0.9" />
      <path d="M -85 105 C -85 55 -40 45 0 45 C 40 45 85 55 85 105 Z" fill="#CBD5E1" opacity="0.85" />
      
      <!-- Stethoscope symbol on doctor -->
      <path d="M -35 55 C -35 90 35 90 35 55" fill="none" stroke="#38BDF8" stroke-width="5" stroke-linecap="round" />
      <circle cx="0" cy="95" r="9" fill="#38BDF8" />
    </g>

    <!-- Clinic Badge -->
    <rect x="200" y="440" width="200" height="34" rx="17" fill="#1E40AF" fill-opacity="0.8" stroke="#60A5FA" stroke-width="1" />
    <text x="300" y="462" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#E0F2FE" letter-spacing="1.5" text-anchor="middle">HELLENIC DENTAL DUBAI</text>

    <!-- Bottom Editorial Info Card -->
    <rect x="40" y="520" width="520" height="180" rx="24" fill="#0A1628" fill-opacity="0.85" stroke="#3B82F6" stroke-width="1.5" stroke-opacity="0.4" />
    
    <text x="300" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" text-anchor="middle">${name.replace(/&/g, '&amp;')}</text>
    <text x="300" y="612" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="600" fill="#93C5FD" text-anchor="middle">${title.replace(/&/g, '&amp;')}</text>
    <text x="300" y="642" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="400" fill="#94A3B8" text-anchor="middle">${specialty.replace(/&/g, '&amp;')}</text>
    
    <!-- Verified Status Indicator -->
    <g transform="translate(240, 665)">
      <circle cx="10" cy="10" r="7" fill="#10B981" />
      <text x="26" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#6EE7B7">Authentic Mapped Staff Profile</text>
    </g>
  </svg>
  `;
}

async function buildAssets() {
  console.log('Generating Hellenic Dental Symbol JPG...');
  await sharp(Buffer.from(emblemSvg))
    .jpeg({ quality: 95 })
    .toFile('public/assets/brand/hellenic-dental-symbol.jpg');

  // Also save a PNG copy for transparent usage if needed
  await sharp(Buffer.from(emblemSvg))
    .png()
    .toFile('public/assets/brand/hellenic-dental-symbol.png');

  const doctors = [
    {
      file: 'public/assets/doctors/portraits/eleni-tzomaa.webp',
      name: 'Dr. Eleni Tzomaa',
      title: 'General Dentist / Clinical Director',
      specialty: 'Cosmetic Dentistry & Smile Architecture',
      initials: 'ET',
      isPlaceholder: false
    },
    {
      file: 'public/assets/doctors/portraits/firas-alshak-khallel.webp',
      name: 'Dr. Firas Alshak Khallel',
      title: 'General Dentist',
      specialty: 'Restorative Dentistry & Endodontics',
      initials: 'FK',
      isPlaceholder: false
    },
    {
      file: 'public/assets/doctors/portraits/mada-jeshi.webp',
      name: 'Dr. Mada Jeshi',
      title: 'Specialist Orthodontist',
      specialty: 'Orthodontics & Clear Aligners',
      initials: 'MJ',
      isPlaceholder: false
    },
    {
      file: 'public/assets/doctors/portraits/majd-alrabadi.webp',
      name: 'Dr. Majd Alrabadi',
      title: 'General Dentist',
      specialty: 'Aesthetic & Preventative Dentistry',
      initials: 'MA',
      isPlaceholder: false
    },
    {
      file: 'public/assets/doctors/portraits/mohammad-hayem.webp',
      name: 'Dr. Mohammad Hayem',
      title: 'Consultant Oral Surgeon',
      specialty: 'Oral Surgery & Dental Implants',
      initials: 'MH',
      isPlaceholder: false
    },
    {
      file: 'public/assets/doctors/placeholders/ayesha-mansha-placeholder.webp',
      name: 'Dr. Ayesha Mansha',
      title: 'General Dentist',
      specialty: 'General & Family Dentistry',
      initials: 'AM',
      isPlaceholder: true
    },
    {
      file: 'public/assets/doctors/placeholders/kashmira-pawar-placeholder.webp',
      name: 'Dr. Kashmira Pawar',
      title: 'Specialist Pediatric Dentist',
      specialty: 'Pediatric & Preventative Dentistry',
      initials: 'KP',
      isPlaceholder: true
    }
  ];

  for (const doc of doctors) {
    console.log(`Generating: ${doc.file}`);
    const svg = generateDoctorCardSvg(doc.name, doc.title, doc.specialty, doc.initials, doc.isPlaceholder);
    await sharp(Buffer.from(svg))
      .webp({ quality: 92 })
      .toFile(doc.file);
  }

  console.log('All image assets successfully built and verified on disk.');
}

buildAssets().catch(console.error);
