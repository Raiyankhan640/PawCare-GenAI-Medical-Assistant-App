# PawCare - Test Cases Document
## Software Testing Documentation

**Project:** PawCare - GenAI Medical Assistant for Pets  
**Version:** 1.0.0  
**Date:** December 11, 2025  
**Prepared By:** QA Team  

---

## Table of Contents
1. [Authentication Module](#1-authentication-module)
2. [User Onboarding Module](#2-user-onboarding-module)
3. [Doctor Listing Module](#3-doctor-listing-module)
4. [Appointment Booking Module](#4-appointment-booking-module)
5. [Video Call Module](#5-video-call-module)
6. [PetChat AI Module](#6-petchat-ai-module)
7. [Credits & Payment Module](#7-credits--payment-module)
8. [Admin Dashboard Module](#8-admin-dashboard-module)
9. [API Testing](#9-api-testing)
10. [Database Testing](#10-database-testing)

---

## 1. Authentication Module

### TC-AUTH-001: User Sign Up
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-AUTH-001 |
| **Module** | Authentication |
| **Test Title** | Verify user can sign up with valid credentials |
| **Pre-conditions** | User is on the sign-up page (/sign-up) |
| **Test Steps** | 1. Navigate to /sign-up<br>2. Enter valid email address<br>3. Enter valid password (min 8 chars)<br>4. Click "Sign Up" button<br>5. Verify email if required |
| **Test Data** | Email: test@example.com, Password: Test@1234 |
| **Expected Result** | User is registered and redirected to /onboarding |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-AUTH-002: User Sign In
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-AUTH-002 |
| **Module** | Authentication |
| **Test Title** | Verify user can sign in with valid credentials |
| **Pre-conditions** | User has an existing account |
| **Test Steps** | 1. Navigate to /sign-in<br>2. Enter registered email<br>3. Enter correct password<br>4. Click "Sign In" button |
| **Test Data** | Email: test@example.com, Password: Test@1234 |
| **Expected Result** | User is logged in and redirected to /onboarding or dashboard |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-AUTH-003: Invalid Login Attempt
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-AUTH-003 |
| **Module** | Authentication |
| **Test Title** | Verify error message for invalid credentials |
| **Pre-conditions** | User is on the sign-in page |
| **Test Steps** | 1. Navigate to /sign-in<br>2. Enter invalid email/password<br>3. Click "Sign In" button |
| **Test Data** | Email: wrong@example.com, Password: wrongpass |
| **Expected Result** | Error message displayed: "Invalid credentials" |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-AUTH-004: User Logout
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-AUTH-004 |
| **Module** | Authentication |
| **Test Title** | Verify user can logout successfully |
| **Pre-conditions** | User is logged in |
| **Test Steps** | 1. Click on user profile icon<br>2. Click "Sign Out" button |
| **Expected Result** | User is logged out and redirected to home page |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-AUTH-005: Protected Route Access
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-AUTH-005 |
| **Module** | Authentication |
| **Test Title** | Verify unauthenticated user cannot access protected routes |
| **Pre-conditions** | User is not logged in |
| **Test Steps** | 1. Try to access /appointments<br>2. Try to access /petchat<br>3. Try to access /doctor/dashboard |
| **Expected Result** | User is redirected to /sign-in page |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

---

## 2. User Onboarding Module

### TC-ONB-001: Patient Role Selection
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ONB-001 |
| **Module** | Onboarding |
| **Test Title** | Verify user can select Patient role |
| **Pre-conditions** | User is logged in with UNASSIGNED role |
| **Test Steps** | 1. Navigate to /onboarding<br>2. Click "I'm a Pet Owner" card<br>3. Click "Continue as Pet Owner" button |
| **Expected Result** | User role updated to PATIENT, redirected to home page with 2 free credits |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-ONB-002: Doctor Role Selection
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ONB-002 |
| **Module** | Onboarding |
| **Test Title** | Verify user can select Doctor role with valid details |
| **Pre-conditions** | User is logged in with UNASSIGNED role |
| **Test Steps** | 1. Navigate to /onboarding<br>2. Click "I'm a Veterinarian" card<br>3. Select specialty from dropdown<br>4. Enter years of experience<br>5. Enter credential URL<br>6. Enter description (optional)<br>7. Click "Submit for Verification" |
| **Test Data** | Specialty: Small Animal Medicine, Experience: 5, URL: https://example.com/cert.pdf |
| **Expected Result** | User role updated to DOCTOR with PENDING verification status |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-ONB-003: Doctor Form Validation
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ONB-003 |
| **Module** | Onboarding |
| **Test Title** | Verify validation errors for invalid doctor form |
| **Pre-conditions** | User is on doctor onboarding form |
| **Test Steps** | 1. Leave specialty empty<br>2. Enter experience as 0<br>3. Enter invalid URL<br>4. Click Submit |
| **Expected Result** | Validation errors displayed for each invalid field |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

---

## 3. Doctor Listing Module

### TC-DOC-001: View All Doctors
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DOC-001 |
| **Module** | Doctor Listing |
| **Test Title** | Verify all verified doctors are displayed |
| **Pre-conditions** | At least one verified doctor exists in database |
| **Test Steps** | 1. Navigate to /doctors/all<br>2. Verify doctor cards are displayed |
| **Expected Result** | All verified doctors displayed with name, specialty, experience |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-DOC-002: Filter Doctors by Specialty
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DOC-002 |
| **Module** | Doctor Listing |
| **Test Title** | Verify doctors can be filtered by specialty |
| **Pre-conditions** | Doctors exist for multiple specialties |
| **Test Steps** | 1. Navigate to /doctors<br>2. Click on "Small Animal Medicine" specialty card |
| **Expected Result** | Only doctors with selected specialty are displayed |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-DOC-003: View Doctor Profile
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DOC-003 |
| **Module** | Doctor Listing |
| **Test Title** | Verify doctor profile page displays correctly |
| **Pre-conditions** | Verified doctor exists |
| **Test Steps** | 1. Navigate to /doctors/all<br>2. Click "View Profile" on any doctor card |
| **Expected Result** | Doctor profile page loads with full details, available slots |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-DOC-004: Doctor Search
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DOC-004 |
| **Module** | Doctor Listing |
| **Test Title** | Verify doctor search functionality |
| **Pre-conditions** | Multiple doctors exist |
| **Test Steps** | 1. Navigate to /doctors/all<br>2. Enter doctor name in search box<br>3. Verify filtered results |
| **Expected Result** | Only matching doctors are displayed |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

---

## 4. Appointment Booking Module

### TC-APT-001: Book Appointment with Credits
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-APT-001 |
| **Module** | Appointment Booking |
| **Test Title** | Verify patient can book appointment using credits |
| **Pre-conditions** | Patient is logged in with at least 1 credit |
| **Test Steps** | 1. Navigate to doctor profile<br>2. Select available time slot<br>3. Enter pet description<br>4. Click "Book Appointment" |
| **Test Data** | Description: "My dog has been vomiting" |
| **Expected Result** | Appointment created, 1 credit deducted, confirmation shown |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-APT-002: Book Appointment without Credits
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-APT-002 |
| **Module** | Appointment Booking |
| **Test Title** | Verify error when booking without sufficient credits |
| **Pre-conditions** | Patient is logged in with 0 credits |
| **Test Steps** | 1. Navigate to doctor profile<br>2. Select available time slot<br>3. Click "Book Appointment" |
| **Expected Result** | Error message: "Insufficient credits" with link to pricing page |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-APT-003: View Patient Appointments
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-APT-003 |
| **Module** | Appointment Booking |
| **Test Title** | Verify patient can view their appointments |
| **Pre-conditions** | Patient has booked appointments |
| **Test Steps** | 1. Navigate to /appointments |
| **Expected Result** | All appointments displayed with status, date, doctor info |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-APT-004: Cancel Appointment
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-APT-004 |
| **Module** | Appointment Booking |
| **Test Title** | Verify patient can cancel scheduled appointment |
| **Pre-conditions** | Patient has a SCHEDULED appointment |
| **Test Steps** | 1. Navigate to /appointments<br>2. Click "Cancel" on appointment card<br>3. Confirm cancellation |
| **Expected Result** | Appointment status changed to CANCELLED |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-APT-005: Doctor View Appointments
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-APT-005 |
| **Module** | Appointment Booking |
| **Test Title** | Verify doctor can view their scheduled appointments |
| **Pre-conditions** | Doctor is logged in with scheduled appointments |
| **Test Steps** | 1. Navigate to /doctor/dashboard |
| **Expected Result** | All appointments displayed with patient info, time slots |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

---

## 5. Video Call Module

### TC-VID-001: Join Video Call (Patient)
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-VID-001 |
| **Module** | Video Call |
| **Test Title** | Verify patient can join video call |
| **Pre-conditions** | Patient has a scheduled appointment |
| **Test Steps** | 1. Navigate to /appointments<br>2. Click "Join Call" on scheduled appointment |
| **Expected Result** | Video call interface opens with camera/mic access prompt |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-VID-002: Join Video Call (Doctor)
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-VID-002 |
| **Module** | Video Call |
| **Test Title** | Verify doctor can join video call |
| **Pre-conditions** | Doctor has a scheduled appointment |
| **Test Steps** | 1. Navigate to /doctor/dashboard<br>2. Click "Join Call" on appointment |
| **Expected Result** | Video call interface opens, can see patient when connected |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-VID-003: End Video Call
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-VID-003 |
| **Module** | Video Call |
| **Test Title** | Verify video call can be ended |
| **Pre-conditions** | User is in an active video call |
| **Test Steps** | 1. Click "End Call" button |
| **Expected Result** | Call ends, user redirected to appointments page |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-VID-004: Toggle Camera/Microphone
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-VID-004 |
| **Module** | Video Call |
| **Test Title** | Verify camera and microphone can be toggled |
| **Pre-conditions** | User is in an active video call |
| **Test Steps** | 1. Click camera toggle button<br>2. Click microphone toggle button |
| **Expected Result** | Camera/mic turns off/on as expected |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

---

## 6. PetChat AI Module

### TC-CHAT-001: Send Text Message
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CHAT-001 |
| **Module** | PetChat AI |
| **Test Title** | Verify user can send text message to AI |
| **Pre-conditions** | User is logged in, on /petchat page |
| **Test Steps** | 1. Navigate to /petchat<br>2. Type message in input box<br>3. Click Send or press Enter |
| **Test Data** | Message: "What should I feed my puppy?" |
| **Expected Result** | User message appears, AI response generated within 10 seconds |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-CHAT-002: Send Image with Message
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CHAT-002 |
| **Module** | PetChat AI |
| **Test Title** | Verify user can send image for AI analysis |
| **Pre-conditions** | User is logged in, on /petchat page |
| **Test Steps** | 1. Click image upload button<br>2. Select image file<br>3. Add text description<br>4. Click Send |
| **Test Data** | Image: pet_rash.jpg, Message: "Is this rash serious?" |
| **Expected Result** | Image uploaded, AI analyzes and responds about the image |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-CHAT-003: Find Nearby Clinics
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CHAT-003 |
| **Module** | PetChat AI |
| **Test Title** | Verify "find vet near me" triggers clinic search |
| **Pre-conditions** | User is logged in, location access allowed |
| **Test Steps** | 1. Navigate to /petchat<br>2. Type "find vet near me"<br>3. Send message |
| **Expected Result** | Map displayed with nearby veterinary clinics |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-CHAT-004: Create New Conversation
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CHAT-004 |
| **Module** | PetChat AI |
| **Test Title** | Verify user can create new chat conversation |
| **Pre-conditions** | User is logged in with existing conversations |
| **Test Steps** | 1. Navigate to /petchat<br>2. Click "New Chat" button |
| **Expected Result** | New empty conversation created |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

### TC-CHAT-005: View Conversation History
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CHAT-005 |
| **Module** | PetChat AI |
| **Test Title** | Verify user can view previous conversations |
| **Pre-conditions** | User has previous chat conversations |
| **Test Steps** | 1. Navigate to /petchat<br>2. Click on conversation in sidebar |
| **Expected Result** | Previous messages loaded and displayed |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

### TC-CHAT-006: Bookmark Clinic Location
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CHAT-006 |
| **Module** | PetChat AI |
| **Test Title** | Verify user can bookmark a clinic |
| **Pre-conditions** | Clinic search results displayed |
| **Test Steps** | 1. After clinic search, click bookmark icon on a clinic |
| **Expected Result** | Clinic saved to user's bookmarks |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Low |

---

## 7. Credits & Payment Module

### TC-CRD-001: View Credit Balance
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CRD-001 |
| **Module** | Credits |
| **Test Title** | Verify user can view credit balance |
| **Pre-conditions** | User is logged in as patient |
| **Test Steps** | 1. Check header for credit display<br>2. Navigate to /pricing |
| **Expected Result** | Current credit balance displayed correctly |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-CRD-002: Purchase Credits
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CRD-002 |
| **Module** | Credits |
| **Test Title** | Verify user can purchase credit package |
| **Pre-conditions** | User is logged in as patient |
| **Test Steps** | 1. Navigate to /pricing<br>2. Select a credit package<br>3. Complete payment flow |
| **Expected Result** | Credits added to account, transaction recorded |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-CRD-003: Credit Deduction on Booking
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-CRD-003 |
| **Module** | Credits |
| **Test Title** | Verify credit is deducted after booking |
| **Pre-conditions** | User has 2 credits, books an appointment |
| **Test Steps** | 1. Note current credit balance (2)<br>2. Book an appointment<br>3. Check credit balance |
| **Expected Result** | Credit balance reduced by 1 (now 1) |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

---

## 8. Admin Dashboard Module

### TC-ADM-001: View All Users
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ADM-001 |
| **Module** | Admin |
| **Test Title** | Verify admin can view all users |
| **Pre-conditions** | User is logged in as ADMIN |
| **Test Steps** | 1. Navigate to /admin<br>2. Click "User Management" tab |
| **Expected Result** | List of all users displayed with roles |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-ADM-002: Verify Doctor
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ADM-002 |
| **Module** | Admin |
| **Test Title** | Verify admin can verify a doctor |
| **Pre-conditions** | Doctor exists with PENDING status |
| **Test Steps** | 1. Navigate to /admin<br>2. Find pending doctor<br>3. Click "Verify" button |
| **Expected Result** | Doctor status changed to VERIFIED |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-ADM-003: Reject Doctor
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ADM-003 |
| **Module** | Admin |
| **Test Title** | Verify admin can reject a doctor |
| **Pre-conditions** | Doctor exists with PENDING status |
| **Test Steps** | 1. Navigate to /admin<br>2. Find pending doctor<br>3. Click "Reject" button |
| **Expected Result** | Doctor status changed to REJECTED |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-ADM-004: Process Doctor Payout
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ADM-004 |
| **Module** | Admin |
| **Test Title** | Verify admin can process doctor payout |
| **Pre-conditions** | Doctor has pending payout request |
| **Test Steps** | 1. Navigate to /admin<br>2. Go to Payouts section<br>3. Click "Process" on pending payout |
| **Expected Result** | Payout marked as PROCESSED |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-ADM-005: View Analytics
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-ADM-005 |
| **Module** | Admin |
| **Test Title** | Verify admin dashboard shows analytics |
| **Pre-conditions** | User is logged in as ADMIN |
| **Test Steps** | 1. Navigate to /admin |
| **Expected Result** | Dashboard shows user count, appointment stats, revenue |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

---

## 9. API Testing

### TC-API-001: Health Check Endpoint
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-API-001 |
| **Module** | API |
| **Test Title** | Verify /api/health returns correct status |
| **Pre-conditions** | Server is running |
| **Test Steps** | 1. Send GET request to /api/health |
| **Expected Result** | Status 200, JSON with database status, memory usage |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-API-002: Unauthorized API Access
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-API-002 |
| **Module** | API |
| **Test Title** | Verify protected endpoints return 401 |
| **Pre-conditions** | No auth token provided |
| **Test Steps** | 1. Send GET request to /api/petchat/conversations |
| **Expected Result** | Status 401 Unauthorized |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-API-003: PetChat Chat Endpoint
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-API-003 |
| **Module** | API |
| **Test Title** | Verify /api/petchat/chat processes messages |
| **Pre-conditions** | User is authenticated |
| **Test Steps** | 1. Send POST to /api/petchat/chat with message and conversationId |
| **Expected Result** | Status 200, AI response returned |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

---

## 10. Database Testing

### TC-DB-001: Database Connection
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DB-001 |
| **Module** | Database |
| **Test Title** | Verify PostgreSQL connection |
| **Pre-conditions** | PostgreSQL server running |
| **Test Steps** | 1. Run application<br>2. Check /api/health endpoint |
| **Expected Result** | Database status: "healthy" |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-DB-002: Data Integrity - User Creation
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DB-002 |
| **Module** | Database |
| **Test Title** | Verify user data integrity |
| **Pre-conditions** | Database is connected |
| **Test Steps** | 1. Create new user<br>2. Query database directly<br>3. Verify all fields |
| **Expected Result** | All required fields populated, UUID generated |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | High |

### TC-DB-003: Cascade Delete
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-DB-003 |
| **Module** | Database |
| **Test Title** | Verify cascade delete on user removal |
| **Pre-conditions** | User has related records (conversations, appointments) |
| **Test Steps** | 1. Delete user from database<br>2. Check related tables |
| **Expected Result** | All related records deleted (conversations, messages, etc.) |
| **Actual Result** | |
| **Status** | Pass/Fail |
| **Priority** | Medium |

---

## Test Summary Report Template

| Module | Total Tests | Passed | Failed | Blocked | Not Executed |
|--------|-------------|--------|--------|---------|--------------|
| Authentication | 5 | | | | |
| Onboarding | 3 | | | | |
| Doctor Listing | 4 | | | | |
| Appointment Booking | 5 | | | | |
| Video Call | 4 | | | | |
| PetChat AI | 6 | | | | |
| Credits & Payment | 3 | | | | |
| Admin Dashboard | 5 | | | | |
| API Testing | 3 | | | | |
| Database Testing | 3 | | | | |
| **TOTAL** | **41** | | | | |

---

## Defect Report Template

| Field | Details |
|-------|---------|
| **Defect ID** | DEF-XXX |
| **Test Case ID** | TC-XXX-XXX |
| **Title** | Brief description |
| **Module** | Module name |
| **Severity** | Critical/High/Medium/Low |
| **Priority** | P1/P2/P3/P4 |
| **Status** | Open/In Progress/Fixed/Closed |
| **Steps to Reproduce** | 1. Step 1<br>2. Step 2 |
| **Expected Result** | What should happen |
| **Actual Result** | What actually happened |
| **Environment** | Browser, OS, Version |
| **Assigned To** | Developer name |
| **Reported By** | Tester name |
| **Date Reported** | YYYY-MM-DD |

---

## Test Environment

| Component | Details |
|-----------|---------|
| **Frontend** | Next.js 15, React 19 |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL (Local) |
| **Authentication** | Clerk |
| **AI Service** | Google Gemini API |
| **Video API** | Vonage Video API (OpenTok) |
| **Browser** | Chrome 120+, Firefox 120+, Safari 17+ |
| **OS** | Windows 11, macOS Sonoma |

---

*Document Version: 1.0*  
*Last Updated: December 11, 2025*
