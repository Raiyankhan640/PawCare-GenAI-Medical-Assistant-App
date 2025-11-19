"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get current user's credits from database
 */
export async function getUserCredits() {
  try {
    const { userId } = await auth();
    if (!userId) return { credits: 0 };

    const user = await db.user.findFirst({
      where: { clerkUserId: userId },
      select: { credits: true },
    });

    return { credits: user?.credits || 0 };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { credits: 0 };
  }
}
