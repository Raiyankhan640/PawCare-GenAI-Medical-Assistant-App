# PawCare Local Database Setup Guide

This guide will help you set up a local PostgreSQL database for the PawCare application after cloning from GitHub.

## Prerequisites

1. **PostgreSQL 14+** installed on your system
2. **Node.js 18+** installed
3. **Git** for cloning the repository

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` superuser
4. Make sure to include **pgAdmin 4** during installation (optional but recommended)

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Create Database and User

### Option A: Using pgAdmin (Recommended for Windows)

1. Open **pgAdmin 4**
2. Connect to your local PostgreSQL server
3. Right-click on **Databases** → **Create** → **Database**
4. Name it: `PawCare`
5. Right-click on **Login/Group Roles** → **Create** → **Login/Group Role**
6. Create user with:
   - Name: `pawcare_user`
   - Password: `admin123` (or your preferred password)
   - Privileges: Can login, Create databases
7. Grant permissions:
   - Right-click on `PawCare` database → **Properties** → **Security**
   - Add `pawcare_user` with all privileges

### Option B: Using Command Line

Connect to PostgreSQL:
```bash
# Windows (in PowerShell as admin, or use pgAdmin SQL Query tool)
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

Run these SQL commands:
```sql
-- Create database
CREATE DATABASE "PawCare";

-- Create user
CREATE USER pawcare_user WITH PASSWORD 'admin123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "PawCare" TO pawcare_user;

-- Connect to the database
\c PawCare

-- Grant schema permissions (important!)
ALTER SCHEMA public OWNER TO pawcare_user;
GRANT ALL ON SCHEMA public TO pawcare_user;
GRANT CREATE ON SCHEMA public TO pawcare_user;

-- Exit
\q
```

## Step 3: Clone and Setup Project

```bash
# Clone the repository
git clone https://github.com/Raiyankhan640/PawCare-GenAI-Medical-Assistant-App.git
cd PawCare-GenAI-Medical-Assistant-App

# Install dependencies
npm install
```

## Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Local PostgreSQL Database (Primary)
DATABASE_URL=postgresql://pawcare_user:admin123@localhost:5432/PawCare

# Neon Cloud Database (Optional - for backup/sync)
# NEON_DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Clerk Authentication (Get from https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Google Gemini AI (Get from https://ai.google.dev/)
GEMINI_API_KEY=your_gemini_api_key

# Vonage Video API (Optional - for video calls)
NEXT_PUBLIC_VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_secret

# Google Maps API (for clinic search)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Getting API Keys:

1. **Clerk** (Authentication):
   - Go to [https://clerk.com](https://clerk.com)
   - Create an account and application
   - Copy the publishable and secret keys

2. **Gemini AI** (PetChat):
   - Go to [https://ai.google.dev/](https://ai.google.dev/)
   - Get an API key from Google AI Studio

3. **Vonage** (Video Calls - Optional):
   - Go to [https://www.vonage.com/developer-center/](https://www.vonage.com/developer-center/)
   - Create a Video API project

## Step 5: Initialize Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

## Step 6: Seed Initial Data

### Seed Doctors
```bash
node scripts/seed-doctors.js
```

### Seed More Veterinarians (Optional)
```bash
node scripts/seed-more-vets.js
node scripts/seed-vets-by-specialty.js
```

### Create Test User
If you need a test user with credits:
```bash
node scripts/seed-user.js
```

**Note:** Update the `clerkUserId` in `scripts/seed-user.js` with your actual Clerk user ID before running.

## Step 7: Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Error: "permission denied for schema public"
Run in pgAdmin SQL Query or psql:
```sql
\c PawCare
ALTER SCHEMA public OWNER TO pawcare_user;
GRANT ALL ON SCHEMA public TO pawcare_user;
GRANT CREATE ON SCHEMA public TO pawcare_user;
```

### Error: "role pawcare_user does not exist"
Make sure you created the user:
```sql
CREATE USER pawcare_user WITH PASSWORD 'admin123';
```

### Error: "database PawCare does not exist"
Create the database:
```sql
CREATE DATABASE "PawCare";
```

### Prisma errors
Try resetting and regenerating:
```bash
npx prisma generate
npx prisma db push --force-reset
```

### Clock skew errors with Clerk
This is a known issue when system clock is out of sync. The app has workarounds for this, but you can fix it by:
1. Windows: Settings → Time & Language → Sync now
2. macOS: System Preferences → Date & Time → Set date and time automatically
3. Linux: `sudo timedatectl set-ntp true`

## Database Schema Overview

The PawCare database includes these main tables:

- **User**: Patients and doctors
- **Doctor**: Extended doctor profiles with specialties
- **Availability**: Doctor availability slots
- **Appointment**: Booked appointments
- **Review**: Patient reviews for doctors
- **Payment**: Payment records
- **Transaction**: Payout transactions for doctors
- **ChatConversation**: PetChat conversation sessions
- **ChatMessage**: Individual chat messages

## Copying Data from Neon (Optional)

If you have an existing Neon database and want to copy data:

1. Update `NEON_DATABASE_URL` in `.env`
2. Run the copy script:
```bash
node scripts/copy-from-neon.js
```

This will copy all doctors and users from Neon to your local database.

## Admin Setup

To make a user an admin:

1. Find the user's email in your database
2. Run in pgAdmin or psql:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
```

## Project Structure

```
pawcare/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Main app routes (requires auth)
│   │   ├── appointments/  # Appointments management
│   │   ├── doctor/        # Doctor dashboard
│   │   ├── petchat/       # AI chat feature
│   │   └── video-call/    # Video consultations
│   └── api/               # API routes
├── actions/               # Server actions
├── components/            # React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema
└── scripts/              # Database scripts
```

## Support

If you encounter issues:
1. Check the [docs/](./docs/) folder for more guides
2. Review the error logs in the terminal
3. Ensure all environment variables are set correctly
4. Verify PostgreSQL service is running

---

Happy coding! 🐾
