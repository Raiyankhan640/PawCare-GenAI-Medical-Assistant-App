import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get clerkUserId from query params
    const url = new URL(request.url);
    const userId = url.searchParams.get("clerkUserId");
    
    console.log("[API /user/credits] userId:", userId);
    
    if (!userId) {
      // Return null role so header doesn't assume role
      return NextResponse.json({ credits: 0, role: null });
    }

    const user = await db.user.findFirst({
      where: { clerkUserId: userId },
      select: { credits: true, role: true },
    });

    if (!user) {
      console.log("[API /user/credits] No user found, returning null role");
      // Return null role - user needs to complete onboarding first
      return NextResponse.json({ credits: 0, role: null });
    }

    console.log("[API /user/credits] Found user:", user);
    return NextResponse.json({
      credits: user.credits ?? 0,
      role: user.role ?? null
    });
  } catch (error) {
    console.error("[API /user/credits] Error:", error.message);
    // Return null role on error
    return NextResponse.json({ credits: 0, role: null });
  }
}
