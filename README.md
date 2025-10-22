# PawCare - GenAI Medical Assistant App

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18.0-green)](https://prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-orange)](https://clerk.com/)

A comprehensive telemedicine platform for pet healthcare, connecting pet owners with licensed veterinarians through secure video consultations, appointment scheduling, and AI-powered medical assistance.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure authentication via Clerk with role-based access (Patients, Doctors, Admins)
- **Appointment Scheduling**: Book telemedicine consultations with available veterinarians
- **Video Consultations**: Integrated video sessions for remote pet healthcare
- **Credit System**: Flexible payment system with credit packages for consultations
- **Doctor Verification**: Comprehensive vet credential verification process
- **Payout Management**: Automated payout system for doctors with platform fee handling

### Upcoming Features
- **AI Chatbot**: Interactive LLM-powered chatbot for disease consultation and treatment advice
- **Image Analysis**: Upload and analyze pet infection images using advanced AI processing
- **Medical History Tracking**: Comprehensive pet health records and history management

### Technical Features
- **Real-time Notifications**: Webhook integration for payment and appointment updates
- **Responsive Design**: Mobile-first UI built with Tailwind CSS and Radix UI components
- **Database Management**: PostgreSQL with Prisma ORM for robust data handling
- **Type Safety**: Full TypeScript support for reliable development

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Video**: Vonage Video API (planned integration)
- **AI/ML**: OpenAI GPT models (for future chatbot and image analysis)
- **Deployment**: Vercel-ready configuration

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud instance)
- **Clerk Account** for authentication setup

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pawcare.git
   cd pawcare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/pawcare_db"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Webhooks (for payment processing)
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

   # Video API (for future video consultations)
   VONAGE_API_KEY=your_vonage_api_key
   VONAGE_API_SECRET=your_vonage_api_secret

   # AI Integration (for future features)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   # (Optional) Seed the database with initial data
   npx prisma db seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📁 Project Structure

```
pawcare/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   ├── layout.js          # Root layout
│   └── page.jsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # Radix UI components
│   └── ...               # Custom components
├── lib/                  # Utility functions and configurations
│   ├── prisma.js         # Prisma client setup
│   ├── checkUser.js      # User verification utilities
│   └── ...               # Other utilities
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema definition
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── ...                   # Configuration files
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 📚 API Documentation

### Webhooks
- **POST** `/api/webhooks` - Handles Clerk webhook events for user and payment updates

### Key Endpoints (Planned)
- **GET/POST** `/api/appointments` - Appointment management
- **GET/POST** `/api/doctors` - Doctor profiles and availability
- **POST** `/api/chatbot` - AI chatbot interactions (future feature)
- **POST** `/api/analyze-image` - Image analysis for medical conditions (future feature)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Clerk](https://clerk.com/) for seamless authentication
- [Prisma](https://prisma.io/) for database ORM
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

## 📞 Support

For support, email support@pawcare.com or join our Discord community.

---

**PawCare** - Making pet healthcare accessible, one consultation at a time. 🐾
