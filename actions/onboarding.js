"use server";

import { db } from "@/lib/prisma.js";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Helper to get userId with fallback
 */
async function getAuthUserId() {
  try {
    const authResult = await auth();
    return authResult.userId;
  } catch (error) {
    console.log("[Onboarding] Auth error:", error.message);
    return null;
  }
}

/**
 * Sets the user's role and related information
 */
export async function setUserRole(formData, clerkUserId = null) {
  let userId = await getAuthUserId();
  
  // Fallback to provided clerkUserId
  if (!userId && clerkUserId) {
    userId = clerkUserId;
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user data from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Ensure user exists in database (upsert to handle both new and existing users)
    await db.user.upsert({
      where: { clerkUserId: userId },
      update: {
        // Update basic info in case it changed in Clerk
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        imageUrl: clerkUser.imageUrl || "",
      },
      create: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        imageUrl: clerkUser.imageUrl || "",
      },
    });

    const role = formData.get("role");

    if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
      throw new Error("Invalid role selection");
    }

    // For patient role - simple update
    if (role === "PATIENT") {
      const updatedUser = await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "PATIENT",
        },
      });

      console.log("[Onboarding] Patient created:", updatedUser.id);
      revalidatePath("/");
      return { success: true, redirect: "/doctors", role: "PATIENT" };
    }

    // For doctor role - need additional information
    if (role === "DOCTOR") {
      const specialty = formData.get("specialty");
      const experience = parseInt(formData.get("experience"), 10);
      const credentialUrl = formData.get("credentialUrl");
      const description = formData.get("description") || "";

      console.log("[Onboarding] Doctor data:", { specialty, experience, credentialUrl, description });

      // Validate required inputs (description is optional)
      if (!specialty || isNaN(experience) || !credentialUrl) {
        console.error("[Onboarding] Validation failed:", { specialty, experience, credentialUrl });
        throw new Error("Specialty, experience, and credential URL are required for doctor registration");
      }

      const updatedUser = await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: "PENDING",
        },
      });

      console.log("[Onboarding] Doctor created:", updatedUser.id, "Status:", updatedUser.verificationStatus);
      revalidatePath("/");
      return { success: true, redirect: "/doctor/verification", role: "DOCTOR" };
    }
  } catch (error) {
    console.error("[Onboarding] Database operation failed:", error);

    // More specific error messages
    if (error.message.includes("Can't reach database server") ||
      error.message.includes("connection") ||
      error.code === "P1001") {
      throw new Error("Database connection failed. Please try again later.");
    }

    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Gets the current user's complete profile information
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to get user information:", error);

    // Handle database connection errors gracefully
    if (error.message.includes("Can't reach database server") ||
      error.message.includes("connection") ||
      error.code === "P1001") {
      console.error("Database connection error - returning null");
      return null;
    }

    return null;
  }
}