"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { checkAndAllocateCredits } from "./credits";

/**
 * Get current user's credits from database
 */
export async function getUserCredits() {
  try {
    const { userId } = await auth();
    if (!userId) return { credits: 0, role: null };

    const user = await db.user.findFirst({
      where: { clerkUserId: userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) return { credits: 0, role: null };

    // Check and allocate credits based on plan
    const finalUser = await checkAndAllocateCredits(user) || user;

    return {
      credits: finalUser?.credits || 0,
      role: finalUser?.role || null
    };
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return { credits: 0, role: null };
  }
}
