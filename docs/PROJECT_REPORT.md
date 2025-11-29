# PawCare — AI Veterinary Telemedicine Platform
## Final Project Report

---

## 1. Introduction

PawCare is an AI-assisted telemedicine platform built with Next.js that connects pet owners with verified veterinarians for virtual appointments, real-time consultations, and comprehensive pet healthcare management.

---

## 2. Problem Statement

Pet owners frequently face significant challenges when seeking quality veterinary care:

- **Limited Accessibility** — Many pet owners live in areas with few veterinary clinics or specialists, making it difficult to access proper care for their animals.

- **Inconvenient Clinic Hours** — Traditional veterinary clinics operate during standard business hours, which often conflict with pet owners' work schedules.

- **Emergency Visit Costs** — When pets fall ill outside regular hours, owners are forced to use expensive emergency veterinary services, even for non-critical issues.

- **Travel Stress** — Transporting anxious or unwell pets to clinics causes additional stress for both the animal and the owner.

- **Long Wait Times** — Popular veterinary clinics often have booking backlogs stretching days or weeks, delaying critical care.

- **Information Gap** — Pet owners lack reliable sources for immediate guidance when their pets show concerning symptoms.

---

## 3. Solution: How PawCare Helps Users

PawCare addresses these challenges through a comprehensive digital platform:

### 3.1 Instant AI-Powered Guidance
The integrated **PetChat AI Assistant** provides immediate symptom analysis and first-aid recommendations. When a pet owner notices their dog vomiting or their cat refusing food, they can describe the symptoms and receive:
- Preliminary assessment of severity
- Recommended immediate actions
- Guidance on whether professional consultation is needed
- Information about potential causes and treatments

### 3.2 24/7 Access to Verified Veterinarians
Pet owners can browse and book appointments with licensed veterinarians at any time:
- View detailed doctor profiles with specializations
- Check real-time availability slots
- Book consultations that fit their schedule
- Access care outside traditional clinic hours

### 3.3 Specialist Matching
The platform organizes veterinarians by specialty, helping owners find the right expert:
- **General Practice** — Routine checkups and common ailments
- **Dermatology** — Skin conditions, allergies, coat issues
- **Cardiology** — Heart-related conditions
- **Orthopedics** — Bone and joint problems
- **Exotic Animals** — Care for non-traditional pets
- **Emergency Medicine** — Urgent care situations

### 3.4 Stress-Free Video Consultations
HD video calls powered by Vonage Video API enable:
- Face-to-face consultations from home
- Visual examination of symptoms
- Real-time guidance for pet owners
- Reduced anxiety for pets who fear car rides or clinics

### 3.5 Cost-Effective Care
The credit-based billing system offers:
- Transparent pricing with no hidden fees
- Lower costs compared to emergency clinic visits
- Preventive consultations that catch issues early
- Flexible credit packages for different needs

### 3.6 Organized Medical Records
All consultation data is stored securely:
- Doctor notes from each appointment
- Prescription history
- Symptom tracking over time
- Easy access for follow-up visits

---

## 4. Why Users Trust PawCare

| Trust Factor | Implementation |
|--------------|----------------|
| **Verified Professionals** | All veterinarians undergo admin verification before appearing on the platform |
| **Secure Consultations** | End-to-end encrypted video calls with Vonage's enterprise-grade infrastructure |
| **AI Transparency** | Clear disclaimers that AI provides guidance only; professional consultation recommended |
| **Data Privacy** | User data protected with industry-standard security practices |
| **Reliable Scheduling** | Real-time availability prevents double-bookings and scheduling conflicts |

---

## 5. Key Features

### For Pet Owners (Patients)
- Browse verified veterinarians by specialty
- View doctor profiles, ratings, and availability
- Book appointments with flexible time slots
- Join HD video consultations
- Chat with AI for immediate symptom guidance
- Purchase and manage consultation credits
- View appointment history and doctor notes

### For Veterinarians (Doctors)
- Set custom availability schedules
- Manage incoming appointments
- Conduct video consultations with patients
- Add consultation notes and prescriptions
- Track earnings and request payouts
- Build professional profile with specializations

### For Platform Administrators
- Review and verify doctor applications
- Approve payout requests
- Monitor platform activity
- Manage user accounts

---

## 6. Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router, React 19, Turbopack) |
| **Styling** | Tailwind CSS v4, shadcn/ui, Framer Motion, GSAP |
| **Authentication** | Clerk (multi-tenant, secure auth) |
| **Database** | PostgreSQL via Prisma ORM |
| **Video Calls** | Vonage Video API (OpenTok) |
| **AI Chat** | Google Gemini API |
| **Payments** | Credit-based system with admin-managed payouts |

---

## 7. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │  Tailwind   │  │  Framer Motion/GSAP │  │
│  │   React 19  │  │   CSS v4    │  │     Animations      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   API       │  │   Server    │  │     Middleware      │  │
│  │   Routes    │  │   Actions   │  │   (Auth, Routing)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│     Clerk     │    │   PostgreSQL  │    │    Vonage     │
│ Authentication│    │   (Prisma)    │    │   Video API   │
└───────────────┘    └───────────────┘    └───────────────┘
                              │
                              ▼
                     ┌───────────────┐
                     │  Gemini API   │
                     │   (AI Chat)   │
                     └───────────────┘
```

---

## 8. User Flow

### Patient Journey
1. **Sign Up/Login** → Clerk authentication
2. **Onboarding** → Complete patient profile
3. **Browse Doctors** → Filter by specialty, view profiles
4. **Book Appointment** → Select time slot, pay with credits
5. **Join Consultation** → HD video call with veterinarian
6. **Receive Guidance** → Doctor notes, prescriptions
7. **AI Chat** → Follow-up questions via PetChat

### Doctor Journey
1. **Sign Up** → Submit credentials for verification
2. **Admin Approval** → Wait for verification
3. **Set Availability** → Configure working hours
4. **Receive Bookings** → Patients book available slots
5. **Conduct Consultations** → Video calls with pet owners
6. **Add Notes** → Document findings and recommendations
7. **Earn & Withdraw** → Track earnings, request payouts

---

## 9. Database Schema (Key Models)

- **User** — Stores patients, doctors, and admins with role-based access
- **Availability** — Doctor's available time slots
- **Appointment** — Bookings linking patients to doctors with video session data
- **Transaction** — Credit purchases and payment history
- **Payout** — Doctor withdrawal requests and processing status

---

## 10. Conclusion

PawCare successfully addresses the accessibility gap in veterinary care by combining:
- **AI technology** for instant guidance
- **Telemedicine** for convenient consultations
- **Modern web development** for a seamless user experience

The platform empowers pet owners to access quality veterinary care anytime, anywhere, while providing veterinarians with a flexible way to expand their practice and reach more patients.

---

## 11. Future Enhancements

- Mobile application (React Native)
- Prescription delivery integration
- Pet health tracking and reminders
- Multi-language support
- Integration with pet insurance providers

---

*Submitted as Final Project Report*
*Date: November 2025*
