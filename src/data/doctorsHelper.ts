import { hellenicDoctors, HellenicDoctor } from '@/HellenicDoctorsEmbedded.ts';
import { Doctor } from '../types/index.ts';

export { hellenicDoctors };
export type { HellenicDoctor };

/**
 * Normalizes doctor IDs/slugs to match against HellenicDoctorsEmbedded
 * e.g., 'dr-eleni-tzomaa' -> 'eleni-tzomaa'
 */
export function normalizeDoctorId(idOrSlug: string): string {
  return idOrSlug.trim().toLowerCase().replace(/^dr-/, '');
}

/**
 * Finds the embedded doctor entry for an ID or slug
 */
export function findEmbeddedDoctor(idOrSlug: string): HellenicDoctor | undefined {
  const norm = normalizeDoctorId(idOrSlug);
  return hellenicDoctors.find(
    doc => normalizeDoctorId(doc.id) === norm || normalizeDoctorId(doc.name) === norm
  );
}

/**
 * Returns the exact authentic Base64 data URL for a doctor
 */
export function getDoctorImage(idOrSlug: string, fallbackImage = ''): string {
  const embedded = findEmbeddedDoctor(idOrSlug);
  if (embedded && embedded.image) {
    return embedded.image;
  }
  return fallbackImage;
}

/**
 * Checks if doctor has authentic supplied portrait
 */
export function isDoctorAuthenticPortrait(idOrSlug: string): boolean {
  const embedded = findEmbeddedDoctor(idOrSlug);
  return embedded ? embedded.authenticPortrait : false;
}

/**
 * Enriches a Doctor record with the genuine Base64 image and authenticity flag
 * while preserving existing doctor ID and relationships
 */
export function enrichDoctor(doc: Doctor): Doctor {
  const embedded = findEmbeddedDoctor(doc.id || doc.slug);
  if (!embedded) return doc;

  return {
    ...doc,
    name: embedded.name || doc.name,
    image: embedded.image || doc.image,
    isAuthenticPortrait: embedded.authenticPortrait,
  };
}

/**
 * Enriches a list of doctors
 */
export function enrichDoctors(doctors: Doctor[]): Doctor[] {
  return doctors.map(enrichDoctor);
}
