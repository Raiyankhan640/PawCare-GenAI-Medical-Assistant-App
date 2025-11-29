"use server";

import { db } from "@/lib/prisma";

/**
 * Get doctors by specialty
 * Optimized: Only fetches fields needed for listing cards
 */
export async function getDoctorsBySpecialty(specialty) {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      select: {
        id: true,
        name: true,
        specialty: true,
        imageUrl: true,
        experience: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { doctors };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    return { error: "Failed to fetch doctors" };
  }
}