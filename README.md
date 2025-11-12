# PawCare — AI Veterinary Telemedicine Platform

PawCare is an AI-assisted Next.js platform that connects pet owners with verified veterinarians for virtual appointments, scheduling, and credit-based billing.

## Features
- Authenticated onboarding for patients, doctors, and admins (Clerk)
- Dynamic doctor directory with specialty filters and animated profile pages
- Real-time slot selection and booking tied to Prisma-managed availability
- Credits marketplace, payouts, and admin review workflows
- Integrated Vonage video sessions for remote consultations
- Responsive, polished UI built with Tailwind CSS, shadcn/ui, Framer Motion, and GSAP

## UI Preview
| Home | About | Pricing | Contact |
| --- | --- | --- | --- |
| ![Home screen](images/home.png) | ![About screen](images/about.png) | ![Pricing screen](images/pricing.png) | ![Contact screen](images/contact.png) |

## Tech Stack
- Framework: Next.js App Router (React 19, Turbopack)
- Styling: Tailwind CSS v4, shadcn/ui, custom motion/GSAP effects
- Auth: Clerk (hosted auth, multi-tenant ready)
- Database: PostgreSQL via Prisma (Neon recommended for cloud syncing)
- Video: Vonage Video API (OpenTok)
- Tooling: ESLint 9, Prisma CLI, Date-fns, React Hook Form, Zod

## Requirements
- Node.js 20+
- npm 10+
- Access to a Postgres database (Neon, Supabase, RDS, etc.)
- Clerk application (publishable + secret key)
- Vonage Video API application + private key (PEM)

## Getting Started

### 1. Clone and Install
```bash
git clone <your-fork-or-clone-url>
cd PawCare-GenAI-Medical-Assistant-App
npm install
```

### 2. Environment Variables
Create `.env` by copying `.env.example` and update the values:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Vonage Video
NEXT_PUBLIC_VONAGE_APPLICATION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VONAGE_PRIVATE_KEY=lib/private.key

# Postgres (Neon recommended for remote access)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
```
Place the Vonage PEM file at `lib/private.key` (ignored by Git).

### 3. Database Prep
```bash
npx prisma generate
npx prisma migrate deploy   # apply existing migrations
```

Seed helper data (optional but recommended for demos):
```bash
npm run migrate:specialties
npm run seed:vets-by-specialty
# or npm run seed:more-vets / npm run seed:availability as needed
```

### 4. Run the App
```bash
npm run dev
```
Visit `http://localhost:3000` (use `http://localhost:3001` if the dev server selects a different port).

## Using PawCare
- **Patients**: Sign up via Clerk, complete onboarding, browse `/doctors`, select a vet, pick a slot, and confirm booking with available credits.
- **Doctors**: After onboarding, set availability and await admin verification within `/doctor/verification`.
- **Admins**: Access `/admin` to review pending doctors and payouts, manage credits, and oversee appointments.
- **Video visits**: Each appointment stores Vonage credentials; join sessions from the appointment detail view when the meeting starts.

## NPM Scripts
- `npm run dev` — start the Next.js dev server with Turbopack
- `npm run build` / `npm start` — production build and start
- `npm run migrate:specialties` — normalize imported specialties
- `npm run seed:vets-by-specialty` — populate verified doctors and availability
- `npm run seed:more-vets` — add extended vet roster and slots
- `npm run seed:doctors`, `npm run seed:availability` — legacy seed helpers
- `npx prisma studio` — open Prisma Studio for data inspection

## Data Model Highlights
- **User**: roles `UNASSIGNED | PATIENT | DOCTOR | ADMIN`, doctor verification state, patient credit balance
- **Availability**: template rows per doctor; runtime derives 30-minute slots
- **Appointment**: lifecycle `SCHEDULED → COMPLETED | CANCELLED`, stores Vonage `sessionId` + `token`
- **CreditTransaction / Payout**: tracks wallet changes and doctor withdrawals

## Working Across Devices
When `DATABASE_URL` points to cloud Postgres (Neon/Supabase):
1. Clone repo on the new device and run `npm install`.
2. Copy `.env` (and `lib/private.key`).
3. Run `npx prisma generate` then `npm run dev`.

If you rely on a local Postgres instance instead:
1. Export: `pg_dump <db-url> > dump.sql`
2. Transfer `dump.sql`.
3. Import: `psql <db-url> -f dump.sql`

## Integrations
- **Vonage Video**: create an app, download the PEM key, update `.env`, store key at `lib/private.key`.
- **Clerk Auth**: configure sign-in/up URLs to match this project; on first booking a patient row is auto-created.

## Troubleshooting
- `Module not found: @vonage/auth` → `npm i @vonage/server-sdk @vonage/auth`
- Availability errors due to missing slots → rerun `npm run seed:vets-by-specialty` or adjust availability in the doctor dashboard.
- “Patient not found” → ensure you are signed in; the system auto-creates patient records post onboarding.
- Unexpected redirect on profile pages → check server logs for Prisma errors or missing environment variables.

## Project Structure
- `app/` — Next.js routes (auth, onboarding, doctors, admin, marketing pages)
- `actions/` — server actions for appointments, payouts, credits
- `components/` — shared UI, layout primitives, animated widgets
- `lib/` — Prisma client, data helpers, specialty lists
- `scripts/` — database seeding and specialty migration utilities
- `prisma/` — schema and migration history

## License
For personal or educational use. Replace branding, assets, and credentials before production deployment.
