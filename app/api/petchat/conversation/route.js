import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function GET(req) {
  try {
    // Try to get userId from auth, fall back to query param
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.log("[PetChat Conversation] Auth error:", authError.message);
    }

    // Fallback to query param if auth fails
    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("clerkUserId");
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get most recent conversation or create new one
    let conversation = await db.chatConversation.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      },
    });

    if (!conversation) {
      conversation = await db.chatConversation.create({
        data: { userId: user.id },
        include: { messages: true },
      });
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error("Conversation API error:", error);

    return NextResponse.json(
      { error: "Failed to load conversation" },
      { status: 500 }
    );
  }
}
