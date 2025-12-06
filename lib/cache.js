import { unstable_cache } from "next/cache";
import { db } from "@/lib/prisma";

/**
 * Cache tags for invalidation
 */
export const CACHE_TAGS = {
  DOCTORS: "doctors",
  DOCTORS_BY_SPECIALTY: "doctors-by-specialty",
  DOCTOR_PROFILE: "doctor-profile",
  AVAILABILITY: "availability",
};

/**
 * Get all verified doctors - Cached for 5 minutes
 * Used on: /doctors/all page
 */
export const getCachedAllDoctors = unstable_cache(
  async () => {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
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
        createdAt: "desc",
      },
    });
    return doctors;
  },
  ["all-doctors"],
  {
    revalidate: 300, // 5 minutes
    tags: [CACHE_TAGS.DOCTORS],
  }
);

/**
 * Get doctors by specialty - Cached for 5 minutes
 * Used on: /doctors/[specialty] page
 */
export const getCachedDoctorsBySpecialty = unstable_cache(
  async (specialty) => {
    const normalizedSpecialty = specialty.split("%20").join(" ");
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: normalizedSpecialty,
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
    return doctors;
  },
  ["doctors-by-specialty"],
  {
    revalidate: 300, // 5 minutes
    tags: [CACHE_TAGS.DOCTORS_BY_SPECIALTY],
  }
);

/**
 * Get doctor by ID - Cached for 2 minutes
 * Used on: /doctors/[specialty]/[id] page
 */
export const getCachedDoctorById = unstable_cache(
  async (doctorId) => {
    const doctor = await db.user.findFirst({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
      select: {
        id: true,
        name: true,
        email: true,
        specialty: true,
        imageUrl: true,
        experience: true,
        description: true,
        credentialUrl: true,
      },
    });
    return doctor;
  },
  ["doctor-profile"],
  {
    revalidate: 120, // 2 minutes
    tags: [CACHE_TAGS.DOCTOR_PROFILE],
  }
);

/**
 * Get doctor count by specialty - Cached for 10 minutes
 * Used on: /doctors page (specialty cards)
 */
export const getCachedSpecialtyCounts = unstable_cache(
  async () => {
    const counts = await db.user.groupBy({
      by: ["specialty"],
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: { not: null },
      },
      _count: {
        specialty: true,
      },
    });
    
    // Convert to a map for easy lookup
    const countMap = {};
    counts.forEach((item) => {
      if (item.specialty) {
        countMap[item.specialty] = item._count.specialty;
      }
    });
    return countMap;
  },
  ["specialty-counts"],
  {
    revalidate: 600, // 10 minutes
    tags: [CACHE_TAGS.DOCTORS],
  }
);
