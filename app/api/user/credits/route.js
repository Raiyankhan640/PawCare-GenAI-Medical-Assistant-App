import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get clerkUserId from query params
    const url = new URL(request.url);
    const userId = url.searchParams.get("clerkUserId");
    
    console.log("[API /user/credits] userId:", userId);
    
    if (!userId) {
      // Return default credits for demo
      return NextResponse.json({ credits: 10, role: "PATIENT" });
    }

    const user = await db.user.findFirst({
      where: { clerkUserId: userId },
      select: { credits: true, role: true },
    });

    if (!user) {
      console.log("[API /user/credits] No user found, returning defaults");
      return NextResponse.json({ credits: 10, role: "PATIENT" });
    }

    console.log("[API /user/credits] Found user:", user);
    return NextResponse.json({
      credits: user.credits ?? 10,
      role: user.role ?? "PATIENT"
    });
  } catch (error) {
    console.error("[API /user/credits] Error:", error.message);
    // Always return valid credits for demo
    return NextResponse.json({ credits: 10, role: "PATIENT" });
  }
}
