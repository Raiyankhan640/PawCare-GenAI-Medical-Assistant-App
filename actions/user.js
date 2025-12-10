"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Get current user's credits from database
 */
export async function getUserCredits() {
  try {
    const { userId } = await auth();
    console.log("[getUserCredits] Clerk userId:", userId);
    
    if (!userId) {
      console.log("[getUserCredits] No userId found - user not authenticated");
      return { credits: 0, role: null };
    }

    const user = await db.user.findFirst({
      where: { clerkUserId: userId },
      select: { credits: true, role: true },
    });

    console.log("[getUserCredits] Database user:", user);

    if (!user) {
      console.log("[getUserCredits] No user found in database for clerkUserId:", userId);
      return { credits: 0, role: null };
    }

    console.log("[getUserCredits] Returning credits:", user.credits, "role:", user.role);
    return {
      credits: user.credits || 0,
      role: user.role || null
    };
  } catch (error) {
    console.error("[getUserCredits] Error:", error);
    return { credits: 0, role: null };
  }
}
