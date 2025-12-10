"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deductCreditsForAppointment } from "@/actions/credits";
import { addDays, addMinutes, format, isBefore, endOfDay } from "date-fns";
import crypto from "crypto";

const API_KEY = process.env.VONAGE_API_KEY;
const API_SECRET = process.env.VONAGE_API_SECRET;

/**
 * Base64 URL encode (replace +/= with -_)
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Generate JWT token for OpenTok API authentication
 */
function generateOpenTokAuthToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: API_KEY,
    ist: "project",
    iat: now,
    exp: now + 300,
  };

  const header = { typ: "JWT", alg: "HS256" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Generate token for OpenTok client
 */
function generateClientToken(sessionId, options = {}) {
  const now = Math.floor(Date.now() / 1000);
  const nonce = Math.random().toString(36).substring(7);
  
  const payload = {
    iss: API_KEY,
    ist: "project",
    iat: now,
    exp: options.expireTime || now + 86400, // 24 hours default
    jti: `${now}_${nonce}`,
    acl: {
      paths: {
        [`/session/${sessionId}`]: {},
      },
    },
  };

  const header = { typ: "JWT", alg: "HS256" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Ensure the signed-in Clerk user has a patient row
 */
async function getOrCreatePatientByClerkId(clerkId) {
  // Try to find any user row for this Clerk user
  let user = await db.user.findFirst({
    where: { clerkUserId: clerkId },
  });

  if (!user) {
    // Pull basic info from Clerk to hydrate the record
    const cu = await currentUser().catch(() => null);
    const email = cu?.emailAddresses?.[0]?.emailAddress ?? null;

    // If we have an email, check if a user with this email already exists
    if (email) {
      user = await db.user.findFirst({
        where: { email: email },
      });
    }

    // If no user found by email, create a new one
    if (!user) {
      user = await db.user.create({
        data: {
          clerkUserId: clerkId,
          email: email,
          name: cu?.fullName ?? cu?.firstName ?? "Pet Owner",
          role: "PATIENT",
          credits: 5, // enough to book at least once
        },
      });
    } else {
      // User exists by email but not by clerkUserId - update with clerkUserId
      user = await db.user.update({
        where: { id: user.id },
        data: {
          clerkUserId: clerkId,
          // Also update role if it's UNASSIGNED
          role: user.role === "UNASSIGNED" ? "PATIENT" : user.role
        },
      });
    }
    return user;
  }

  // If the row exists but role is UNASSIGNED, promote to PATIENT
  if (user.role === "UNASSIGNED") {
    user = await db.user.update({
      where: { id: user.id },
      data: { role: "PATIENT" },
    });
  }

  return user;
}

/**
 * Book a new appointment with a doctor
 */
export async function bookAppointment(formData) {
  try {
    let userId = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId;
    } catch (authError) {
      console.error("Auth error in bookAppointment:", authError.message);
    }
    
    if (!userId) {
      return { success: false, error: "Please sign in to book an appointment" };
    }

    // Ensure we have a patient row for this user
    const patient = await getOrCreatePatientByClerkId(userId);

    if (patient.role !== "PATIENT") {
      return { success: false, error: "Please use a pet owner account to book" };
    }

    // Parse form data
    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription = formData.get("description") || null;

    // Validate input
    if (!doctorId || !startTime || !endTime) {
      throw new Error("Doctor, start time, and end time are required");
    }

    // Doctor lookup should not use findUnique with extra filters
    const doctor = await db.user.findFirst({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });
    if (!doctor) throw new Error("Doctor not found or not verified");

    // Check if the patient has enough credits (2 credits per appointment)
    if (patient.credits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    // Check if the requested time slot is available
    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          {
            // New appointment starts during an existing appointment
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },
          {
            // New appointment ends during an existing appointment
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
          {
            // New appointment completely overlaps an existing appointment
            startTime: {
              gte: startTime,
            },
            endTime: {
              lte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is already booked");
    }

    // Create a new OpenTok Video API session
    console.log("Creating video session with API_KEY:", API_KEY);
    console.log("API_SECRET length:", API_SECRET?.length);
    
    let sessionId;
    try {
      sessionId = await createVideoSession();
      console.log("Video session created successfully:", sessionId);
    } catch (error) {
      console.error("Failed to create video session:", error.message);
      // Set to null so appointment can still be created
      sessionId = null;
    }

    // Deduct credits from patient and add to doctor
    const { success, error } = await deductCreditsForAppointment(
      patient.id,
      doctor.id
    );

    if (!success) {
      throw new Error(error || "Failed to deduct credits");
    }

    // Create the appointment with the video session ID
    const appointment = await db.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime,
        endTime,
        patientDescription,
        status: "SCHEDULED",
        videoSessionId: sessionId, // Store the Vonage session ID (null for now)
      },
    });

    revalidatePath("/appointments");
    return { success: true, appointment: appointment };
  } catch (error) {
    console.error("Failed to book appointment:", error);
    return { success: false, error: error.message || "Failed to book appointment" };
  }
}

/**
 * Generate a Vonage Video API session using REST API
 */
async function createVideoSession() {
  try {
    const authToken = generateOpenTokAuthToken();
    const https = await import("https");
    const querystring = await import("querystring");

    const postData = querystring.stringify({
      "p2p.preference": "disabled",
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: "api.opentok.com",
        path: "/session/create",
        method: "POST",
        headers: {
          "X-OPENTOK-AUTH": authToken,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            const sessionIdMatch = data.match(/<session_id>(.*?)<\/session_id>/);
            if (sessionIdMatch && sessionIdMatch[1]) {
              resolve(sessionIdMatch[1]);
            } else {
              reject(new Error("Could not extract session ID from response"));
            }
          } else {
            reject(new Error(`OpenTok API error: ${res.statusCode} - ${data}`));
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error("Failed to create video session:", error);
    throw new Error("Failed to create video session: " + error.message);
  }
}

/**
 * Generate a token for a video session
 * This will be called when either doctor or patient is about to join the call
 */
export async function generateVideoToken(formData) {
  let userId = null;
  try {
    const authResult = await auth();
    userId = authResult?.userId;
  } catch (authError) {
    console.error("Auth error in generateVideoToken:", authError.message);
  }

  if (!userId) {
    return { success: false, error: "Please sign in to join the video call" };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment and verify the user is part of it
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify the user is either the doctor or the patient for this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("You are not authorized to join this call");
    }

    // Verify the appointment is scheduled
    if (appointment.status !== "SCHEDULED") {
      throw new Error("This appointment is not currently scheduled");
    }

    // Check if video calling is properly configured
    if (!appointment.videoSessionId) {
      return {
        success: false,
        error: "Video calling is temporarily disabled. The appointment is confirmed but video features are being configured. Please check back later or contact support.",
      };
    }

    // Allow joining the call anytime for testing purposes
    // In production, you can add time restrictions if needed
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const appointmentEndTime = new Date(appointment.endTime);
    
    // Optional: Uncomment to restrict access to specific time window
    // const timeDifference = (appointmentTime - now) / (1000 * 60);
    // if (timeDifference > 30) {
    //   throw new Error("The call will be available 30 minutes before the scheduled time");
    // }

    // Generate a token for the video session
    // Token expires 1 hour after the appointment end time
    const expirationTime =
      Math.floor(appointmentEndTime.getTime() / 1000) + 60 * 60; // 1 hour after end time

    // Use user's name and role as connection data
    const connectionData = JSON.stringify({
      name: user.name,
      role: user.role,
      userId: user.id,
    });

    // Generate the token using custom implementation
    let token;
    try {
      token = generateClientToken(appointment.videoSessionId, {
        expireTime: expirationTime,
      });
    } catch (videoError) {
      console.error("Video token generation failed:", videoError);
      return {
        success: false,
        error: "Video calling service is currently unavailable. Please try again later or contact support.",
      };
    }

    // Update the appointment with the token
    await db.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        videoSessionToken: token,
      },
    });

    return {
      success: true,
      videoSessionId: appointment.videoSessionId,
      token: token,
    };
  } catch (error) {
    console.error("Failed to generate video token:", error);
    return {
      success: false,
      error: error.message || "Failed to generate video token. Please try again.",
    };
  }
}

/**
 * Get doctor by ID
 * Optimized: Uses caching for better performance
 */
export async function getDoctorById(doctorId) {
  try {
    // Import cached function dynamically to avoid circular deps
    const { getCachedDoctorById } = await import("@/lib/cache");
    const doctor = await getCachedDoctorById(doctorId);
    if (!doctor) {
      return { doctor: null, error: "Doctor not found" };
    }
    return { doctor };
  } catch (error) {
    console.error("Failed to fetch doctor details:", error);
    return { doctor: null, error: "Failed to fetch doctor details" };
  }
}

/**
 * Get available time slots for booking for the next 4 days
 */
export async function getAvailableTimeSlots(doctorId) {
  try {
    // Validate doctor existence and verification
    const doctor = await db.user.findFirst({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      return { days: [], error: "Doctor not found or not verified" };
    }

    // Fetch a single availability record
    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
      orderBy: { startTime: "asc" }, // was: updatedAt: "desc" (invalid)
    });

    // Default office hours if none set
    const DEFAULT_START_HOUR = 9;  // 9:00
    const DEFAULT_END_HOUR = 17;   // 17:00

    // Get the next 4 days
    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    // Fetch existing appointments for the doctor over the next 4 days
    const lastDay = endOfDay(days[3]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: { lte: lastDay },
      },
    });

    const availableSlotsByDay = {};

    // Pre-calc template hours/minutes from availability if present
    const startTemplate = availability ? new Date(availability.startTime) : null;
    const endTemplate = availability ? new Date(availability.endTime) : null;

    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      // Build start/end for this specific day
      const availabilityStart = new Date(day);
      const availabilityEnd = new Date(day);

      if (availability) {
        availabilityStart.setHours(
          startTemplate.getHours(),
          startTemplate.getMinutes(),
          0,
          0
        );
        availabilityEnd.setHours(
          endTemplate.getHours(),
          endTemplate.getMinutes(),
          0,
          0
        );
      } else {
        // Fallback 9:00–17:00
        availabilityStart.setHours(DEFAULT_START_HOUR, 0, 0, 0);
        availabilityEnd.setHours(DEFAULT_END_HOUR, 0, 0, 0);
      }

      let current = new Date(availabilityStart);
      const end = new Date(availabilityEnd);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);

        // Skip past slots
        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);
          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          availableSlotsByDay[dayString].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(next, "h:mm a")}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }

        current = next;
      }
    }

    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result, usedDefaultHours: !availability };
  } catch (error) {
    console.error("Failed to fetch available slots:", error);
    return { days: [], error: "Failed to fetch available time slots" };
  }
}

/**
 * Delete a cancelled appointment (only CANCELLED status)
 */
export async function deleteAppointment(formData) {
  let userId = null;
  try {
    const authResult = await auth();
    userId = authResult?.userId;
  } catch (authError) {
    console.error("Auth error in deleteAppointment:", authError.message);
  }

  if (!userId) {
    return { success: false, error: "Please sign in to delete appointment" };
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    if (!appointmentId) {
      throw new Error("Appointment ID is required");
    }

    // Find the appointment
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    // Verify user is part of this appointment
    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("Unauthorized to delete this appointment");
    }

    // Only allow deleting CANCELLED appointments
    if (appointment.status !== "CANCELLED") {
      throw new Error("Only cancelled appointments can be deleted");
    }

    // Delete the appointment
    await db.appointment.delete({
      where: { id: appointmentId },
    });

    revalidatePath("/appointments");
    revalidatePath("/doctor");
    return { success: true, message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    throw new Error("Failed to delete appointment: " + error.message);
  }
}