import { GoogleGenAI } from '@google/genai';
import { dbStore } from './db.ts';

// Approved FAQ and Knowledge Base
const CLINIC_KNOWLEDGE_BASE = `
Clinic Name: Hellenic Dental Clinic Dubai
Status: Independent Private Concept Demo (Not an official clinic booking service).
Tagline: "Confidence Begins With a Healthy Smile"
Founding: Greek-founded boutique dental practice in Dubai.
Location: Villa 4, Al Wasl Road, Al Bada'a, Dubai, UAE (near Iranian Hospital & City Walk).
Landline Phone: +971 4 349 0422
WhatsApp: +971 4 349 0422
Email: info@hellenicdentalclinic.com
Timezone: Asia/Dubai

Opening Hours:
- Monday to Friday: 09:30 – 20:00
- Saturday: 09:30 – 19:00
- Sunday: 11:00 – 17:00

Specialist Doctors Roster:
1. Dr. Eleni Tzomaa — Clinical Director & General Dentist (Cosmetic Dentistry, Porcelain Veneers, Digital Smile Design, Full Mouth Rehabilitation). Speaks English, Greek, Arabic.
2. Dr. Firas Alshak Khallel — General & Restorative Dentist (Microscopic Root Canal Therapy, Biomimetic Fillings, Crowns & Bridges). Speaks English, Arabic.
3. Dr. Mada Jeshi — Specialist Orthodontist (Digital Clear Aligners, Self-ligating Braces, Interceptive Orthodontics). Speaks English, Arabic.
4. Dr. Majd Alrabadi — General Dentist (Laser Teeth Whitening, Composite Bonding, Preventative Hygiene). Speaks English, Arabic.
5. Dr. Mohammad Hayem — Consultant Oral & Maxillofacial Surgeon (Dental Implants, Surgical Wisdom Tooth Extractions, Bone Grafting). Speaks English, Arabic, French.
6. Dr. Ayesha Mansha — General Dentist (Comprehensive Checkups, Family Dentistry, Preventative Scaling). Speaks English, Urdu. (Provisional profile).
7. Dr. Kashmira Pawar — Specialist Pediatric Dentist (Gentle Child Dental Care, Fluoride Sealants, Early Habit Guidance). Speaks English, Hindi. (Provisional profile).

Published Treatments:
1. Custom Porcelain Veneers & Smile Makeovers (Digital Smile Design, ultra-thin ceramic shells).
2. Composite Edge Bonding (Single-visit resin artistry with zero or minimal enamel removal).
3. Professional In-Clinic Laser Teeth Whitening (Safe, desensitized enamel brightening).
4. Digital Clear Aligners (Custom transparent aligners for discreet tooth straightening).
5. Precision Dental Implants (Biocompatible titanium/ceramic implants replacing missing teeth).
6. Surgical Wisdom Tooth Removal (Atraumatic extractions performed by Consultant Oral Surgeon).
7. Microscopic Root Canal Therapy (Pain-relieving pulp infection removal).
8. Child & Pediatric Dental Care (Playful, anxiety-free care for toddlers and youth).
9. Preventative Ultrasonic & Airflow Hygiene (Gentle stain and tartar removal).
10. Comprehensive Clinical Oral Examinations (Detailed digital photography & screenings).

Pricing & Quotes Policy:
- Official treatment prices are NOT published online because costs depend entirely on individualized clinical examinations, bone density, and case complexity.
- Never invent prices, quotes, or financial promises. Refer patients to an in-clinic demo consultation.

Medical Disclaimer & Strict Boundaries:
- NEVER diagnose medical or dental conditions online.
- NEVER prescribe medications or suggest dosages.
- NEVER interpret dental symptoms definitively or guarantee clinical outcomes.
- If a patient mentions severe trauma, uncontrolled bleeding, facial swelling or extreme fever, urge them to visit an emergency hospital facility or contact clinic reception immediately.
- Explain that demo appointment requests are submitted as "Pending" and confirmed by clinic reception staff after slot verification.
`;

const SYSTEM_INSTRUCTION = `
You are "Ask Hellenic", the refined, professional, and friendly AI Concierge for the Hellenic Dental Clinic private concept experience in Dubai.

Your Tone:
- Warm, articulate, poised, and clinical yet deeply reassuring (Swiss editorial elegance meets modern Dubai healthcare hospitality).
- Keep answers concise (1-3 brief paragraphs or bullet points).
- Maintain an encouraging and hospitable tone.

Core Guidelines & Mandates:
1. Always state or clarify when appropriate that this is a concept demo experience for Hellenic Dental Clinic, Dubai.
2. Direct patients to explore treatments, meet the doctors, or use the interactive demo booking flow (/book).
3. STRICT MEDICAL BOUNDARY: You cannot diagnose symptoms, prescribe medication, interpret X-rays, or guarantee treatment success. If a user asks "Does my tooth have an infection?", explain what the clinic's dentists look for and invite them to book an evaluation.
4. STRICT PRICING BOUNDARY: Never invent or quote specific prices or fees. Explain that treatment plans are bespoke and determined during an in-person clinical exam.
5. APPOINTMENT GUIDANCE: When asked about booking, explain the 6 simple demo steps (Choose service, pick doctor, pick date, choose time slot, submit fictional details, receive unique HDC reference). Mention that requests start in "Pending" status and are validated by reception.
6. If the user asks about hours, doctors, or location (Al Wasl Road, Al Bada'a, Dubai), give accurate answers from the knowledge base.
`;

export async function askGeminiReceptionist(userMessage: string, conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return getFallbackResponse(userMessage);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Build context
    const contents: any[] = [];

    // Add recent history if provided
    for (const msg of conversationHistory.slice(-4)) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    contents.push({
      role: 'user',
      parts: [
        {
          text: `Knowledge Base Reference:\n${CLINIC_KNOWLEDGE_BASE}\n\nUser Question:\n${userMessage}`
        }
      ]
    });

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95
      }
    });

    const response = await Promise.race([geminiPromise, timeoutPromise]);
    if (!response) {
      console.warn('Gemini API call timed out, falling back to curated response');
      return getFallbackResponse(userMessage);
    }

    const text = response.text;
    if (text && text.trim().length > 0) {
      return text.trim();
    }

    return getFallbackResponse(userMessage);
  } catch (error) {
    console.error('Gemini API receptionist call error:', error);
    return getFallbackResponse(userMessage);
  }
}

// Resilient, domain-specific fallback for API key absence or network interruption
function getFallbackResponse(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('hour') || lower.includes('open') || lower.includes('time') || lower.includes('when')) {
    return "Hellenic Dental Clinic is open Monday to Friday from 09:30 to 20:00, Saturday from 09:30 to 19:00, and Sunday from 11:00 to 17:00 (Asia/Dubai timezone). Would you like to schedule an appointment request?";
  }

  if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('map')) {
    return "We are located at Villa 4, Al Wasl Road, in Al Bada'a, Dubai — conveniently accessible from City Walk, Jumeirah, and Downtown Dubai. Free valet and dedicated parking are available for patients.";
  }

  if (lower.includes('doctor') || lower.includes('dentist') || lower.includes('eleni') || lower.includes('firas') || lower.includes('surgeon') || lower.includes('team')) {
    return "Our clinical team is led by Clinical Director Dr. Eleni Tzomaa (Cosmetics), alongside Dr. Firas Alshak Khallel (Restorative & Endodontics), Dr. Mada Jeshi (Specialist Orthodontist), Dr. Majd Alrabadi (Aesthetic Dentistry), Dr. Mohammad Hayem (Consultant Oral Surgeon), Dr. Ayesha Mansha, and Dr. Kashmira Pawar (Pediatric). You can review their full profiles in the Doctors section.";
  }

  if (lower.includes('book') || lower.includes('appointment') || lower.includes('slot') || lower.includes('schedule')) {
    return "You can test our appointment engine directly via the 'Book Appointment' button. Simply choose your desired service, select your doctor, pick a date, choose an available slot, and submit test patient details. All demo requests begin in 'Pending' status for reception review.";
  }

  if (lower.includes('cost') || lower.includes('price') || lower.includes('how much') || lower.includes('fee')) {
    return "In accordance with Hellenic Dental Clinic's clinical protocols, treatment costs depend on individualized oral assessments, digital scans, and tissue health. We do not provide arbitrary online quotes. We welcome you to book a consultation so our dentists can evaluate your specific requirements.";
  }

  if (lower.includes('pain') || lower.includes('hurt') || lower.includes('emergency') || lower.includes('bleed') || lower.includes('ache')) {
    return "If you are experiencing acute pain or dental discomfort, please note that I cannot provide medical diagnoses. We recommend requesting an urgent dental examination or reaching out to our clinic team at +971 4 349 0422 for immediate care guidance.";
  }

  return "Welcome to Hellenic Dental Clinic's digital concept experience. I can assist you with treatment overviews (such as porcelain veneers, clear aligners, dental implants, or root canal care), clinic hours on Al Wasl Road, doctor credentials, or guiding you through our demo booking system. How may I assist you today?";
}
