# PawCare Setup Guide

## Initial Setup Steps (After Cloning)

You've successfully completed the basic setup! Here's what was done:

### ✅ Completed Steps:

1. **Dependencies Installed** - All npm packages are installed
2. **Prisma Client Generated** - The `@prisma/client` error is now fixed
3. **Environment Variables Fixed** - DATABASE_URL format corrected

### 🔧 Remaining Steps (Required for Running):

#### 1. Set Up Your Own Database

The cloned database credentials won't work. You need to create your own PostgreSQL database:

**Option A: Using Neon (Free PostgreSQL hosting)**
1. Go to https://neon.tech
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update `DATABASE_URL` in your `.env` file

**Option B: Using Supabase (Free PostgreSQL hosting)**
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Get the connection string from Project Settings > Database
5. Update `DATABASE_URL` in your `.env` file

**Option C: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a database named `pawcare`
3. Update `DATABASE_URL` with: `postgresql://username:password@localhost:5432/pawcare`

#### 2. Set Up Clerk Authentication

1. Go to https://clerk.com and create a free account
2. Create a new application
3. Copy the API keys from the dashboard
4. Update these in your `.env` file:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

#### 3. Set Up Vonage Video API (Optional - for video calls)

1. Go to https://www.vonage.com/communications-apis/
2. Create an account
3. Create an application
4. Get your Application ID and Private Key
5. Update these in your `.env` file:
   - `NEXT_PUBLIC_VONAGE_APPLICATION_ID`
   - `VONAGE_PRIVATE_KEY`

#### 4. Run Database Migrations

After setting up your database, run:
```bash
npx prisma migrate deploy
# or if that doesn't work:
npx prisma db push
```

#### 5. (Optional) Seed the Database

To add sample data:
```bash
npm run seed:doctors
# or for more vets:
npm run seed:more-vets
```

### 🚀 Running the Project

Once you've set up the database and Clerk:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

### 📝 Common Issues

**Issue: Database connection error**
- Make sure your DATABASE_URL is correct
- Check if your database is running
- Verify network connectivity

**Issue: Clerk authentication not working**
- Make sure all Clerk environment variables are set
- Check if keys are valid and not expired

**Issue: Port already in use**
- Run: `npx kill-port 3000` (Windows)
- Or change the port: `npm run dev -- -p 3001`

### 📚 Project Structure

- `/app` - Next.js App Router pages
- `/components` - Reusable React components
- `/actions` - Server actions for data operations
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/scripts` - Database seeding scripts

### 🆘 Need Help?

Check the README.md file for more information about the project.
