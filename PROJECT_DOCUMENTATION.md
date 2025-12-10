# PawCare - Project Documentation

## 1. Project Overview
PawCare is a GenAI-powered medical assistant application designed for pet owners in Bangladesh. It connects pet parents with verified veterinarians through video consultations, providing a seamless healthcare experience for pets. The platform features an AI chatbot for immediate advice, an appointment booking system, and a credit-based payment model.

## 2. Tech Stack used
- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript / React 19
- **Styling**: Tailwind CSS 4, Shadcn UI, Framer Motion, GSAP
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Clerk
- **Video Calls**: Vonage Video API
- **State Management**: React Hooks

## 3. Project Structure
The project follows a standard Next.js App Router structure:

- **`app/`**: Contains the application routes and pages.
  - `(home)/`: Landing page components and layout.
  - `(auth)/`: Authentication pages (Sign-in/Sign-up provided by Clerk).
  - `(main)/`: Dashboard and main application functionality (protected routes).
    - `dashboard/`: User dashboard.
    - `doctors/`: Doctor listing and search.
    - `appointments/`: Appointment management.
    - `chat/`: AI Chatbot interface.
  - `api/`: Backend API routes (Webhooks, internal APIs).
- **`components/`**: Reusable UI components (Buttons, Cards, Modals).
- **`lib/`**: Utility functions, Prisma client instance, and static data.
- **`prisma/`**: Database schema and migration files.
- **`scripts/`**: Seeding scripts to populate the database with initial data (Doctors, Availability).
- **`actions/`**: Server actions for data mutations (Booking, Chat).

## 4. Key Routes and Functionality

| Route | Description | User Access |
|-------|-------------|-------------|
| `/` | Landing page with features, testimonials, and strong visual appeal. | Public |
| `/sign-in` | Login page interacting with Clerk. | Public |
| `/sign-up` | Registration page interacting with Clerk. | Public |
| `/dashboard` | Main hub for users to see appointments, credits, and stats. | Private (Auth) |
| `/doctors` | List of verified veterinarians with search and filter. | Private |
| `/doctors/[id]` | Detailed profile of a specific doctor with booking options. | Private |
| `/appointments` | List of past and upcoming appointments. | Private |
| `/chat` | AI-powered chatbot for pet health queries. | Private |
| `/pricing` | Credit purchase packages. | Private |

## 5. Database Architecture (Prisma Schema)

The database is built on PostgreSQL and managed using Prisma. Key models include:

### **User**
- Stores user information (Name, Email, Role).
- Roles: `PATIENT`, `DOCTOR`, `ADMIN`.
- Linked to Clerk via `clerkUserId`.
- Doctors have specific fields: `specialty`, `experience`, `description`.

### **Appointment**
- Connects a `Patient` (User) and a `Doctor` (User).
- Stores `startTime`, `endTime`, `status` (SCHEDULED, COMPLETED, CANCELLED).
- Includes `videoSessionId` for Vonage video calls.

### **Availability**
- Defines time slots when a Doctor is available.
- Linked to `Doctor`.

### **ChatConversation & ChatMessage**
- Stores chat history between the User and the AI Assistant.

### **CreditTransaction**
- Tracks the purchase and usage of credits.
- Users purchase credits to book appointments (e.g., 2 credits per consultation).

### **Relationships**
- **1-to-Many**: One User (Patient) can have multiple Appointments.
- **1-to-Many**: One User (Doctor) can have multiple Availabilities.
- **1-to-Many**: One User can have multiple CreditTransactions.

## 6. Authentication Flow
Authentication is handled entirely by **Clerk**.
1. **Sign Up/In**: Users are redirected to Clerk's hosted pages or embedded components.
2. **Session Management**: specific folders like `(main)` are protected using `middleware.js` to ensure only authenticated users can access them.
3. **Database Sync**: Webhooks (in `app/api/webhooks/clerk`) listen for user creation events from Clerk and sync the user data to the local PostgreSQL database (creating a `User` record).

## 7. Bangladeshi Context Customization
The content has been tailored for the Bangladeshi market:
- **Doctors**: Database seeded with local doctor names (e.g., Dr. Rahim, Dr. Fatema) and locations (Dhaka, Chittagong).
- **Testimonials**: reflect local user experiences.
- **Pricing**: Although universal credits are used, the context fits the local digital service model.

## 8. Integration Points
- **Vonage**: Used for generating tokens and sessions for video calls within the `Appointment` flow.
- **OpenAI / Gemini (implied)**: Used in the `Chatbot Section` for generating intelligent responses.
- **Stripe (via Clerk)**: Handles payments for credit packages.
