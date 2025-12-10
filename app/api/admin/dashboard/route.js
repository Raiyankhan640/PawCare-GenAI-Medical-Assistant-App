import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Verify admin and get all dashboard data
export async function GET(req) {
  try {
    // Try to get userId from auth, fall back to query param
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.log("[Admin API] Auth error:", authError.message);
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
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Fetch all dashboard data in parallel
    const [
      totalUsers,
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingAppointments,
      totalCreditsData,
      recentAppointments,
      pendingDoctorsList,
      verifiedDoctorsList,
      pendingPayouts,
      chatConversations,
      chatMessages,
      todayAppointments,
      weekAppointments,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "DOCTOR" } }),
      db.user.count({ where: { role: "DOCTOR", verificationStatus: "VERIFIED" } }),
      db.user.count({ where: { role: "DOCTOR", verificationStatus: "PENDING" } }),
      db.user.count({ where: { role: "PATIENT" } }),
      db.appointment.count(),
      db.appointment.count({ where: { status: "COMPLETED" } }),
      db.appointment.count({ where: { status: "CANCELLED" } }),
      db.appointment.count({ where: { status: "SCHEDULED" } }),
      db.creditTransaction.aggregate({
        _sum: { amount: true },
        where: { type: "CREDIT_PURCHASE" },
      }),
      db.appointment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          patient: { select: { name: true, email: true, imageUrl: true } },
          doctor: { select: { name: true, specialty: true, imageUrl: true } },
        },
      }),
      db.user.findMany({
        where: { role: "DOCTOR", verificationStatus: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
      db.user.findMany({
        where: { role: "DOCTOR", verificationStatus: "VERIFIED" },
        orderBy: { name: "asc" },
      }),
      db.payout.findMany({
        where: { status: "PROCESSING" },
        include: {
          doctor: { select: { id: true, name: true, email: true, specialty: true, credits: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.chatConversation.count(),
      db.chatMessage.count(),
      db.appointment.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      db.appointment.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    // Get monthly stats for charts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [monthlyAppointments, monthlyTransactions, monthlyUsers] = await Promise.all([
      db.appointment.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, status: true },
      }),
      db.creditTransaction.findMany({
        where: { createdAt: { gte: sixMonthsAgo }, type: "CREDIT_PURCHASE" },
        select: { createdAt: true, amount: true },
      }),
      db.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, role: true },
      }),
    ]);

    // Process monthly data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const monthAppointments = monthlyAppointments.filter(
        (a) => a.createdAt.getMonth() === monthIndex && a.createdAt.getFullYear() === year
      );
      const monthRevenue = monthlyTransactions
        .filter((t) => t.createdAt.getMonth() === monthIndex && t.createdAt.getFullYear() === year)
        .reduce((sum, t) => sum + t.amount * 10, 0);
      const monthUsers = monthlyUsers.filter(
        (u) => u.createdAt.getMonth() === monthIndex && u.createdAt.getFullYear() === year
      );

      monthlyData.push({
        month: months[monthIndex],
        appointments: monthAppointments.length,
        completed: monthAppointments.filter((a) => a.status === "COMPLETED").length,
        revenue: monthRevenue,
        newUsers: monthUsers.length,
        newDoctors: monthUsers.filter((u) => u.role === "DOCTOR").length,
        newPatients: monthUsers.filter((u) => u.role === "PATIENT").length,
      });
    }

    // Calculate specialty distribution
    const specialtyStats = await db.user.groupBy({
      by: ["specialty"],
      where: { role: "DOCTOR", verificationStatus: "VERIFIED", specialty: { not: null } },
      _count: true,
    });

    // Calculate appointment status distribution
    const appointmentStatusData = [
      { name: "Completed", value: completedAppointments, color: "#10B981" },
      { name: "Scheduled", value: pendingAppointments, color: "#3B82F6" },
      { name: "Cancelled", value: cancelledAppointments, color: "#EF4444" },
    ];

    const totalRevenue = (totalCreditsData._sum.amount || 0) * 10;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        verifiedDoctors,
        pendingDoctors,
        totalPatients,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        pendingAppointments,
        totalRevenue,
        chatConversations,
        chatMessages,
        todayAppointments,
        weekAppointments,
        avgAppointmentsPerDoctor: verifiedDoctors > 0 ? Math.round(totalAppointments / verifiedDoctors) : 0,
        completionRate: totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0,
      },
      monthlyData,
      specialtyStats: specialtyStats.map((s) => ({
        specialty: s.specialty || "Unknown",
        count: s._count,
      })),
      appointmentStatusData,
      recentAppointments,
      pendingDoctors: pendingDoctorsList,
      verifiedDoctors: verifiedDoctorsList,
      pendingPayouts,
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Failed to load admin data" },
      { status: 500 }
    );
  }
}
