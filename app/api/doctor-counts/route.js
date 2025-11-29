import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Revalidate every 5 minutes (300 seconds)
// This data doesn't change frequently, so caching is beneficial
export const revalidate = 300;

export async function GET() {
  try {
    const doctorCounts = await db.user.groupBy({
      by: ["specialty"],
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
      _count: {
        specialty: true,
      },
    });

    const countMap = doctorCounts.reduce((acc, item) => {
      acc[item.specialty] = item._count.specialty;
      return acc;
    }, {});

    // Add cache headers for CDN and browser caching
    const response = NextResponse.json(countMap);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    
    return response;
  } catch (error) {
    console.error("Error fetching doctor counts:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
