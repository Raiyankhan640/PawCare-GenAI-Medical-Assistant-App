"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

/**
 * Helper to get userId with fallback
 */
async function getAuthUserId() {
  try {
    const authResult = await auth();
    return authResult.userId;
  } catch (error) {
    console.log("[Admin] Auth error:", error.message);
    return null;
  }
}

/**
 * Verifies if current user has admin role
 */
export async function verifyAdmin(clerkUserId = null) {
  let userId = await getAuthUserId();
  
  // Fallback to provided clerkUserId
  if (!userId && clerkUserId) {
    userId = clerkUserId;
  }

  if (!userId) {
    return false;
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Failed to verify admin:", error);
    return false;
  }
}

/**
 * Gets all doctors with pending verification
 */
export async function getPendingDoctors() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    const pendingDoctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { doctors: pendingDoctors };
  } catch (error) {
    throw new Error("Failed to fetch pending doctors");
  }
}

/**
 * Gets all verified doctors
 */
export async function getVerifiedDoctors() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    const verifiedDoctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
      orderBy: {
        name: "asc",
      },
    });

    return { doctors: verifiedDoctors };
  } catch (error) {
    console.error("Failed to get verified doctors:", error);
    return { error: "Failed to fetch verified doctors" };
  }
}

/**
 * Updates a doctor's verification status
 */
export async function updateDoctorStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const status = formData.get("status");

  if (!doctorId || !["VERIFIED", "REJECTED"].includes(status)) {
    throw new Error("Invalid input");
  }

  try {
    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    // Invalidate doctor caches when status changes
    revalidateTag(CACHE_TAGS.DOCTORS);
    revalidateTag(CACHE_TAGS.DOCTORS_BY_SPECIALTY);
    revalidateTag(CACHE_TAGS.DOCTOR_PROFILE);
    revalidatePath("/admin");
    revalidatePath("/doctors");
    return { success: true };
  } catch (error) {
    console.error("Failed to update doctor status:", error);
    throw new Error(`Failed to update doctor status: ${error.message}`);
  }
}

/**
 * Suspends or reinstates a doctor
 */
export async function updateDoctorActiveStatus(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const doctorId = formData.get("doctorId");
  const suspend = formData.get("suspend") === "true";

  if (!doctorId) {
    throw new Error("Doctor ID is required");
  }

  try {
    const status = suspend ? "PENDING" : "VERIFIED";

    await db.user.update({
      where: {
        id: doctorId,
      },
      data: {
        verificationStatus: status,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update doctor active status:", error);
    throw new Error(`Failed to update doctor status: ${error.message}`);
  }
}

/**
 * Gets all pending payouts that need admin approval
 */
export async function getPendingPayouts() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    const pendingPayouts = await db.payout.findMany({
      where: {
        status: "PROCESSING",
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialty: true,
            credits: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { payouts: pendingPayouts };
  } catch (error) {
    console.error("Failed to fetch pending payouts:", error);
    throw new Error("Failed to fetch pending payouts");
  }
}

/**
 * Approves a payout request and deducts credits from doctor's account
 */
export async function approvePayout(formData) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  const payoutId = formData.get("payoutId");

  if (!payoutId) {
    throw new Error("Payout ID is required");
  }

  try {
    // Get admin user info
    const { userId } = await auth();
    const admin = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    // Find the payout request
    const payout = await db.payout.findUnique({
      where: {
        id: payoutId,
        status: "PROCESSING",
      },
      include: {
        doctor: true,
      },
    });

    if (!payout) {
      throw new Error("Payout request not found or already processed");
    }

    // Check if doctor has enough credits
    if (payout.doctor.credits < payout.credits) {
      throw new Error("Doctor doesn't have enough credits for this payout");
    }

    // Process the payout in a transaction
    await db.$transaction(async (tx) => {
      // Update payout status to PROCESSED
      await tx.payout.update({
        where: {
          id: payoutId,
        },
        data: {
          status: "PROCESSED",
          processedAt: new Date(),
          processedBy: admin?.id || "unknown",
        },
      });

      // Deduct credits from doctor's account
      await tx.user.update({
        where: {
          id: payout.doctorId,
        },
        data: {
          credits: {
            decrement: payout.credits,
          },
        },
      });

      // Create a transaction record for the deduction
      await tx.creditTransaction.create({
        data: {
          userId: payout.doctorId,
          amount: -payout.credits,
          type: "ADMIN_ADJUSTMENT",
        },
      });
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve payout:", error);
    throw new Error(`Failed to approve payout: ${error.message}`);
  }
}

/**
 * Gets admin dashboard statistics
 */
export async function getAdminStats() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingDoctors,
      totalCreditsData,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "DOCTOR" } }),
      db.user.count({ where: { role: "PATIENT" } }),
      db.appointment.count(),
      db.appointment.count({ where: { status: "COMPLETED" } }),
      db.user.count({ where: { role: "DOCTOR", verificationStatus: "PENDING" } }),
      db.creditTransaction.aggregate({
        _sum: { amount: true },
        where: { type: "CREDIT_PURCHASE" },
      }),
    ]);

    const totalRevenue = (totalCreditsData._sum.amount || 0) * 10; // $10 per credit

    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingDoctors,
      totalRevenue,
    };
  } catch (error) {
    console.error("Failed to get admin stats:", error);
    throw new Error("Failed to fetch admin statistics");
  }
}

/**
 * Gets monthly statistics for charts
 */
export async function getMonthlyStats() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const appointments = await db.appointment.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    const transactions = await db.creditTransaction.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        type: "CREDIT_PURCHASE",
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    // Group by month
    const monthlyData = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthKey] = { month: months[date.getMonth()], appointments: 0, revenue: 0 };
    }

    appointments.forEach((apt) => {
      const monthKey = `${months[apt.createdAt.getMonth()]} ${apt.createdAt.getFullYear()}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].appointments++;
      }
    });

    transactions.forEach((tx) => {
      const monthKey = `${months[tx.createdAt.getMonth()]} ${tx.createdAt.getFullYear()}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += tx.amount * 10;
      }
    });

    return { data: Object.values(monthlyData) };
  } catch (error) {
    console.error("Failed to get monthly stats:", error);
    throw new Error("Failed to fetch monthly statistics");
  }
}

/**
 * Gets recent appointments for dashboard
 */
export async function getRecentAppointments() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) throw new Error("Unauthorized");

  try {
    const recentAppointments = await db.appointment.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: { name: true, email: true, imageUrl: true },
        },
        doctor: {
          select: { name: true, specialty: true },
        },
      },
    });

    return { appointments: recentAppointments };
  } catch (error) {
    console.error("Failed to get recent appointments:", error);
    throw new Error("Failed to fetch recent appointments");
  }
}