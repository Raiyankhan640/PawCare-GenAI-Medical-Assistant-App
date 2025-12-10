import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Get all conversations for user
export async function GET(req) {
  try {
    // Try to get userId from auth, fall back to query param
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.log("[Conversations API] Auth error:", authError.message);
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

    const conversations = await db.chatConversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error("Conversations API error:", error);
    return NextResponse.json(
      { error: "Failed to load conversations" },
      { status: 500 }
    );
  }
}

// Create new conversation
export async function POST(req) {
  try {
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.log("[Conversations API] Auth error:", authError.message);
    }

    // Fallback to body param if auth fails
    if (!userId) {
      try {
        const body = await req.json();
        userId = body.clerkUserId;
      } catch (e) {
        // Ignore parse errors
      }
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

    const conversation = await db.chatConversation.create({
      data: {
        userId: user.id,
        title: "New Chat",
      },
      include: { messages: true },
    });

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

// Delete conversation
export async function DELETE(req) {
  try {
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (authError) {
      console.log("[Conversations API] Auth error:", authError.message);
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("id");
    
    // Fallback to query param if auth fails
    if (!userId) {
      userId = searchParams.get("clerkUserId");
    }

    if (!userId || !conversationId) {
      return NextResponse.json(
        { error: "Unauthorized or missing conversation ID" },
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

    // Verify ownership
    const conversation = await db.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    await db.chatConversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
