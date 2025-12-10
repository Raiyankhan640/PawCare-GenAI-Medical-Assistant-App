import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Get all users for admin management
export async function GET(req) {
  try {
    // Try to get userId from auth, fall back to query param
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.log("[Admin Users API] Auth error:", authError.message);
    }

    // Fallback to query param if auth fails
    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("clerkUserId");
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get search params
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const whereClause = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(roleFilter !== "all" && { role: roleFilter }),
    };

    // Get total count
    const totalCount = await db.user.count({ where: whereClause });

    // Get users with pagination
    const users = await db.user.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        clerkUserId: true,
        name: true,
        email: true,
        imageUrl: true,
        role: true,
        credits: true,
        verificationStatus: true,
        specialty: true,
        experience: true,
        createdAt: true,
        _count: {
          select: {
            appointments: true,
            doctorAppointments: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[Admin Users API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// Update user credits/membership
export async function PATCH(req) {
  try {
    // Try to get userId from auth, fall back to body
    let adminUserId;
    try {
      const authResult = await auth();
      adminUserId = authResult.userId;
    } catch (authError) {
      console.log("[Admin Users API] Auth error:", authError.message);
    }

    const body = await req.json();

    // Fallback to body param if auth fails
    if (!adminUserId && body.clerkUserId) {
      adminUserId = body.clerkUserId;
    }

    if (!adminUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const adminUser = await db.user.findUnique({
      where: { clerkUserId: adminUserId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId, action, value, reason } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the target user
    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let updatedUser;
    let transactionRecord = null;

    switch (action) {
      case "set_credits":
        // Set credits to exact value
        const newCredits = parseInt(value);
        if (isNaN(newCredits) || newCredits < 0) {
          return NextResponse.json({ error: "Invalid credit value" }, { status: 400 });
        }

        const creditDifference = newCredits - targetUser.credits;

        updatedUser = await db.$transaction(async (tx) => {
          // Update user credits
          const user = await tx.user.update({
            where: { id: userId },
            data: { credits: newCredits },
          });

          // Create transaction record
          if (creditDifference !== 0) {
            await tx.creditTransaction.create({
              data: {
                userId: userId,
                amount: creditDifference,
                type: creditDifference > 0 ? "ADMIN_CREDIT" : "ADMIN_DEBIT",
                packageId: `admin_adjustment_${Date.now()}`,
              },
            });
          }

          return user;
        });

        console.log(`[Admin] Updated credits for user ${userId}: ${targetUser.credits} -> ${newCredits}`);
        break;

      case "add_credits":
        // Add credits to current balance
        const addAmount = parseInt(value);
        if (isNaN(addAmount) || addAmount <= 0) {
          return NextResponse.json({ error: "Invalid credit amount" }, { status: 400 });
        }

        updatedUser = await db.$transaction(async (tx) => {
          const user = await tx.user.update({
            where: { id: userId },
            data: { credits: { increment: addAmount } },
          });

          await tx.creditTransaction.create({
            data: {
              userId: userId,
              amount: addAmount,
              type: "ADMIN_CREDIT",
              packageId: `admin_add_${Date.now()}`,
            },
          });

          return user;
        });

        console.log(`[Admin] Added ${addAmount} credits to user ${userId}`);
        break;

      case "change_role":
        // Change user role
        if (!["PATIENT", "DOCTOR", "ADMIN"].includes(value)) {
          return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        updatedUser = await db.user.update({
          where: { id: userId },
          data: { 
            role: value,
            ...(value === "DOCTOR" && { verificationStatus: "PENDING" }),
          },
        });

        console.log(`[Admin] Changed role for user ${userId} to ${value}`);
        break;

      case "verify_doctor":
        // Verify a doctor
        if (targetUser.role !== "DOCTOR") {
          return NextResponse.json({ error: "User is not a doctor" }, { status: 400 });
        }

        updatedUser = await db.user.update({
          where: { id: userId },
          data: { verificationStatus: "VERIFIED" },
        });

        console.log(`[Admin] Verified doctor ${userId}`);
        break;

      case "reject_doctor":
        // Reject a doctor
        if (targetUser.role !== "DOCTOR") {
          return NextResponse.json({ error: "User is not a doctor" }, { status: 400 });
        }

        updatedUser = await db.user.update({
          where: { id: userId },
          data: { verificationStatus: "REJECTED" },
        });

        console.log(`[Admin] Rejected doctor ${userId}`);
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Successfully performed ${action} on user`,
    });
  } catch (error) {
    console.error("[Admin Users API] Update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
