import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    return NextResponse.json(countMap);
  } catch (error) {
    console.error("Error fetching doctor counts:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
