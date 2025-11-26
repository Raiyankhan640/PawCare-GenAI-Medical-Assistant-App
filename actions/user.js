"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get current user's credits from database
 */
export async function getUserCredits() {
  try {
    const { userId } = await auth();
    if (!userId) return { credits: 0, role: null };

    const user = await db.user.findFirst({
      where: { clerkUserId: userId },
      select: { credits: true, role: true },
    });

    if (!user) return { credits: 0, role: null };

    return {
      credits: user.credits || 0,
      role: user.role || null
    };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { credits: 0, role: null };
  }
}
