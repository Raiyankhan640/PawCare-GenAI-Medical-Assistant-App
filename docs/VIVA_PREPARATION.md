## Software Engineering Design Patterns, Architecture & Testing

---

## 1. Design Patterns Used

### 1.1 **Singleton Pattern**
**File:** `lib/prisma.js`

```javascript
const prismaClientSingleton = () => {
  return new PrismaClient({...});
};

export const db = globalThis.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
```

**What to say:**
> "I implemented the Singleton pattern for the database connection. This ensures only ONE instance of the Prisma client exists throughout the application lifecycle. This prevents connection pool exhaustion and ensures consistent database access across all server actions and API routes."

---

### 1.2 **Repository Pattern**
**Files:** `actions/*.js` (appointments.js, credits.js, doctor.js, patient.js, etc.)

**What to say:**
> "I used the Repository Pattern through Next.js Server Actions. Each action file acts as a repository that encapsulates data access logic. For example, `actions/appointments.js` contains all appointment-related database operations like `bookAppointment()`, `getDoctorById()`, `getAvailableTimeSlots()`. This separates business logic from data access, making the code more maintainable and testable."

**Example functions:**
- `getDoctorById(doctorId)` - Get doctor details
- `bookAppointment(formData)` - Create new appointment
- `getPatientAppointments()` - Fetch patient's appointments

---

### 1.3 **Factory Pattern**
**File:** `actions/appointments.js` (lines 25-47)

```javascript
function generateOpenTokAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: API_KEY, ist: "project", iat: now, exp: now + 300 };
  // ... creates JWT token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function generateClientToken(sessionId, options = {}) {
  // Creates different token based on options
}
```

**What to say:**
> "I used the Factory Pattern for creating video session tokens. The `generateOpenTokAuthToken()` and `generateClientToken()` functions create different types of JWT tokens based on parameters, encapsulating the complex token creation logic."

---

### 1.4 **Strategy Pattern**
**File:** `lib/gemini.js`

```javascript
export async function detectIntent(userMessage) {
  // Strategy 1: Keyword-based detection (fast)
  const hasLocation = locationKeywords.some(keyword => message.includes(keyword));
  if (hasLocation && hasVet) return "CLINIC_SEARCH";

  // Strategy 2: AI-based classification (fallback)
  const response = await fetch(GEMINI_API_URL, {...});
  return parsedIntent;
}
```

**What to say:**
> "I implemented the Strategy Pattern for intent detection in the PetChat feature. The system first tries fast keyword-based detection, and if that's inconclusive, it falls back to AI-based classification. This allows swapping detection strategies without changing the calling code."

---

### 1.5 **Observer Pattern (React State Management)**
**File:** `hooks/use-fetch.js`

```javascript
const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    const response = await cb(...args);
    setData(response);  // Observers (components) automatically re-render
  };

  return { data, loading, error, fn };
};
```

**What to say:**
> "I used the Observer Pattern through React's useState hooks. The `useFetch` custom hook implements this - when data changes, all subscribed components automatically re-render. This is used throughout the app for API calls with automatic loading/error states."

---

### 1.6 **Decorator Pattern (Higher-Order Components & Middleware)**
**File:** `middleware.js`

```javascript
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) return auth().redirectToSignIn();
  }
  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  return response;
});
```

**What to say:**
> "I used the Decorator Pattern via Next.js middleware. The middleware 'decorates' incoming requests with authentication checks and security headers without modifying the core route handlers."

---

### 1.7 **Facade Pattern**
**File:** `lib/cache.js`

```javascript
export const getCachedAllDoctors = unstable_cache(
  async () => {
    const doctors = await db.user.findMany({...});
    return doctors;
  },
  ["all-doctors"],
  { revalidate: 300, tags: [CACHE_TAGS.DOCTORS] }
);
```

**What to say:**
> "I implemented the Facade Pattern in the caching layer. Functions like `getCachedAllDoctors()`, `getCachedDoctorsBySpecialty()` provide a simple interface that hides the complexity of database queries, caching configuration, and cache invalidation logic."

---

### 1.8 **Adapter Pattern**
**File:** `lib/gemini.js` and `actions/petchat.js`

**What to say:**
> "I used the Adapter Pattern to integrate the Gemini AI API. The `getGeminiResponse()` function adapts the external Gemini API interface to match what our application expects, handling API-specific formatting and error handling."

---

### 1.9 **Provider Pattern (Composition)**
**File:** `app/layout.js` and `components/theme-provider.jsx`

```javascript
<ClerkProvider>
  <ThemeProvider attribute="class" defaultTheme="dark">
    <Header />
    <main>{children}</main>
    <Toaster />
  </ThemeProvider>
</ClerkProvider>
```

**What to say:**
> "I used the Provider Pattern for global state management. ClerkProvider handles authentication state, ThemeProvider handles dark/light mode, and these wrap the entire application, making their context available to all child components."

---

## 2. Architectural Patterns

### 2.1 **MVC-like Architecture (with Next.js App Router)**

| Layer | Location | Description |
|-------|----------|-------------|
| **Model** | `prisma/schema.prisma` | Database schema with User, Appointment, ChatMessage, etc. |
| **View** | `app/**/page.jsx`, `components/` | React components for UI |
| **Controller** | `actions/*.js`, `app/api/**/route.js` | Server Actions & API Routes |

---

### 2.2 **Layered Architecture**

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← app/**, components/
├─────────────────────────────────────┤
│          Business Logic             │  ← actions/*, lib/gemini.js
├─────────────────────────────────────┤
│           Data Access               │  ← lib/prisma.js, lib/cache.js
├─────────────────────────────────────┤
│            Database                 │  ← PostgreSQL (Prisma ORM)
└─────────────────────────────────────┘
```

---

### 2.3 **Component-Based Architecture**
- Reusable UI components in `components/ui/`
- Feature-specific components in `app/(main)/*/components/`
- Memoized components for performance (`React.memo()`)

---

## 3. Testing Approach

### 3.1 **Manual/Integration Testing Done**

Since this is a full-stack Next.js application, testing was done through:

1. **API Health Check Endpoint** - `app/api/health/route.js`
   - Tests database connectivity
   - Tests memory usage
   - Returns structured health status

2. **Database Scripts** - `scripts/test-db.mjs`
   - Connection testing
   - Data integrity checks

3. **Validation with Zod** - `lib/schema.js`
   ```javascript
   export const doctorFormSchema = z.object({
     specialty: z.string().min(1, "Specialty is required"),
     experience: z.number().int().min(1).max(70),
     credentialUrl: z.string().url(),
   });
   ```

### 3.2 **What Testing Could Be Added (For Discussion)**

If asked about unit testing frameworks, say:

> "For a production application, I would add:
> - **Jest** - For unit testing utility functions
> - **React Testing Library** - For component testing
> - **Playwright/Cypress** - For E2E testing
> 
> Currently, I focused on **runtime validation** using Zod schemas and **integration testing** through the health check API."

---

## 4. Key Software Engineering Principles Applied

### 4.1 **SOLID Principles**

| Principle | Application |
|-----------|-------------|
| **S** - Single Responsibility | Each action file handles one domain (appointments.js, credits.js) |
| **O** - Open/Closed | Cache functions can be extended without modification |
| **L** - Liskov Substitution | UI components are interchangeable (Button, Card) |
| **I** - Interface Segregation | Separate API routes for different features |
| **D** - Dependency Inversion | Components depend on abstractions (hooks), not concrete implementations |

### 4.2 **DRY (Don't Repeat Yourself)**
- Shared UI components in `components/ui/`
- Custom hooks like `useFetch` for reusable data fetching
- Cached functions in `lib/cache.js`

### 4.3 **Separation of Concerns**
- `lib/` - Utilities and configurations
- `actions/` - Server-side business logic
- `components/` - Reusable UI
- `app/api/` - REST API endpoints

---

## 5. Quick Reference Table

| Question | Pattern/Concept | File Location |
|----------|-----------------|---------------|
| Database connection pattern? | **Singleton** | `lib/prisma.js` |
| Data access pattern? | **Repository** | `actions/*.js` |
| Token generation? | **Factory** | `actions/appointments.js` |
| Intent detection? | **Strategy** | `lib/gemini.js` |
| State management? | **Observer** | `hooks/use-fetch.js` |
| Authentication? | **Decorator/Middleware** | `middleware.js` |
| Caching? | **Facade** | `lib/cache.js` |
| Theme/Auth context? | **Provider** | `app/layout.js` |
| Form validation? | **Zod Schemas** | `lib/schema.js` |
| API health check? | **Health Check Pattern** | `app/api/health/route.js` |
| Component architecture? | **Composition** | `components/ui/*` |

---

## 6. Technologies Used (Quick List)

- **Frontend:** React 19, Next.js 15 (App Router)
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Next.js Server Actions, API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **AI Integration:** Google Gemini API
- **Video Calls:** Vonage Video API (OpenTok)
- **Validation:** Zod
- **State Management:** React Hooks (useState, useEffect, useCallback)

