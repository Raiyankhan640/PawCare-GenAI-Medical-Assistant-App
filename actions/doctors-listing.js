"use server";

import { db } from "@/lib/prisma";
import { getCachedDoctorsBySpecialty } from "@/lib/cache";

/**
 * Get doctors by specialty
 * Optimized: Uses caching for better performance
 */
export async function getDoctorsBySpecialty(specialty) {
  try {
    // Use cached query - revalidates every 5 minutes
    const doctors = await getCachedDoctorsBySpecialty(specialty);
    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    return { error: "Failed to fetch doctors" };
  }
}