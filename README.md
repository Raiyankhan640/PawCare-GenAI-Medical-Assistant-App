# PawCare — Veterinary Telemedicine Platform

PawCare is a AI Powered Next.js app that connects pet owners with verified veterinarians for virtual appointments, scheduling, and credits.

## Stack
- Next.js (App Router) + React + TailwindCSS (shadcn/ui)
- Auth: Clerk
- DB: PostgreSQL via Prisma (Neon recommended)
- Video: Vonage Video API (OpenTok)
- Date utils: date-fns

## Quick start (Windows)
1) Clone and install
- git clone <repo-url>
- cd pawcare
- npm install

2) Configure environment
- Create .env from the example below
- Save your Vonage application private key file at lib/private.key (PEM)

3) Database
- npx prisma generate
- For a fresh DB: npx prisma migrate deploy
- Optional (local dev data): npm run seed:vets-by-specialty or npm run seed:more-vets

4) Run
- npm run dev
- Open http://localhost:3000

## Environment variables (.env)
Copy, then replace values with your own.
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Vonage Video
NEXT_PUBLIC_VONAGE_APPLICATION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# Path to PEM key contents (file is read by the SDK)
VONAGE_PRIVATE_KEY=lib/private.key

# Postgres (Neon recommended so multiple devices share the same data)
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
```
Notes:
- Keep .env out of Git. Rotate any keys that were ever committed.
- The VONAGE_PRIVATE_KEY is a path to a PEM file; place it at lib/private.key.

## Scripts
- npm run dev — start dev server (Turbopack)
- npm run build / npm start — production build/start
- npm run migrate:specialties — remap human specialties to veterinary ones
- npm run seed:vets-by-specialty — ensure multiple verified vets exist for each specialty listed in lib/specialities.js, and create availability
- npm run seed:more-vets — add more vets and availability (pet-care profiles)
- npm run seed:doctors, npm run seed:availability — legacy seed helpers
- npx prisma studio — browse/edit data in a web UI

## Data model (high level)
- User: roles UNASSIGNED | PATIENT | DOCTOR | ADMIN, verificationStatus for doctors, credits for patients
- Availability: one time range per doctor used as a daily template (30‑min slots are computed at runtime)
- Appointment: SCHEDULED → COMPLETED/CANCELLED, stores Vonage sessionId and token
- CreditTransaction, Payout: bookkeeping for credits and withdrawals

## Developer workflows
- DB migrations: 
  - Local: npx prisma migrate dev
  - CI/Production: npx prisma migrate deploy
- Seeding vets and availability:
  - SPECIALTIES live in lib/specialities.js. Seeder scripts read that file to create realistic, verified veterinarians with availability (no hardcoding of names).
  - Run: npm run seed:vets-by-specialty
- Viewing vets:
  - /doctors — grid by specialty with counts
  - Click a specialty → /doctors/[specialty] to see vets
  - “View Profile & Book” opens the doctor page, shows availability, and lets you book

## Using this project on another device (share the same data)
Because the DATABASE_URL points to a remote Postgres (e.g., Neon), data is shared automatically across devices.
1) On the new device:
- Clone the repo and run npm install
- Copy the .env from your primary device (and lib/private.key)
- Run npx prisma generate and npm run dev (or npx prisma migrate deploy on a fresh DB)
2) If you used a local Postgres instead of Neon:
- Export on device A: pg_dump <db-url> > dump.sql
- Import on device B: psql <db-url> -f dump.sql

## Vonage setup (Video)
- Create a Vonage application (Video API)
- Download the private key (PEM) and save as lib/private.key
- Set NEXT_PUBLIC_VONAGE_APPLICATION_ID and VONAGE_PRIVATE_KEY in .env

## Clerk setup
- Create a Clerk application and copy the publishable and secret keys
- The app expects routes: /sign-in and /sign-up
- On first booking, a “patient” row is auto-created for the signed-in Clerk user (with starter credits)

## Troubleshooting
- Module not found: @vonage/auth — run: npm i @vonage/server-sdk @vonage/auth
- Availability query error (updatedAt not found) — fixed to order by startTime
- “Patient not found” on booking — the app now auto-creates a PATIENT row for the signed-in user
- “No availability set by doctor” — code falls back to 9:00–17:00 if none exists; you can seed availability with the scripts above
- Profile page bouncing back — usually indicates a server error at fetch time; check terminal for Prisma errors

## Project structure (key paths)
- app/ — routes (Home, Doctors, About, Contact)
- actions/ — server actions (appointments, credits, etc.)
- lib/prisma.js — Prisma client
- lib/specialities.js — specialties listed on the Find Vets page (seeders read this)
- components/ — UI components (header, buttons, etc.)
- scripts/ — seed/migration utilities used by npm scripts
- prisma/ — schema and migrations

## License
For personal or educational use. Replace branding and assets for production.
