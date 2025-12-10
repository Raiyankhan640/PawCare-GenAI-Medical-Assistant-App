import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGeminiResponse, detectIntent } from "@/lib/gemini";
import { db } from "@/lib/prisma";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(5000),
  imageUrl: z.string().nullish(),  // File path for DB storage
  imageData: z.string().nullish(), // Base64 data for Gemini analysis
  conversationId: z.string().uuid(),
  clerkUserId: z.string().optional(), // Fallback for auth
});

export async function POST(req) {
  // Try to get userId from auth, fall back to body param
  let userId;
  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (authError) {
    console.log("[PetChat] Auth error:", authError.message);
  }

  try {
    const body = await req.json();
    
    // Fallback to body param if auth fails
    if (!userId && body.clerkUserId) {
      userId = body.clerkUserId;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const validation = chatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { message, imageUrl, imageData, conversationId } = validation.data;

    // Save user message directly
    await db.chatMessage.create({
      data: {
        conversationId,
        role: "USER",
        content: message,
        imageUrl,
        hasImage: !!imageUrl,
      },
    });

    // Detect intent (skip if image is present - always use GENERAL for images)
    let intent = "GENERAL";
    if (!imageData) {
      intent = await detectIntent(message);
    }

    let aiResponse;

    if (intent === "CLINIC_SEARCH") {
      // Return special marker for client to trigger clinic search
      aiResponse = "Let me help you find nearby veterinary clinics. Searching for clinics in your area...";
    } else {
      // Get normal AI response (use imageData for analysis, not imageUrl)
      const messages = [{ role: "user", content: message }];
      aiResponse = await getGeminiResponse(messages, imageData);
    }

    // Save AI response directly
    await db.chatMessage.create({
      data: {
        conversationId,
        role: "ASSISTANT",
        content: aiResponse,
      },
    });

    // Update conversation timestamp
    await db.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Auto-name conversation if it's still "New Chat"
    try {
      const conversation = await db.chatConversation.findUnique({
        where: { id: conversationId }
      });
      if (conversation && conversation.title === "New Chat") {
        // Generate a short title from the first message
        const title = message.substring(0, 50) + (message.length > 50 ? "..." : "");
        await db.chatConversation.update({
          where: { id: conversationId },
          data: { title },
        });
      }
    } catch (error) {
      console.error("Error auto-naming conversation:", error);
      // Non-critical error, continue
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      intent, // Send intent to client
    });
  } catch (error) {
    console.error("PetChat API error:", error);

    // Better error messages for common issues
    let errorMessage = "Failed to process message. Please try again.";

    if (error.message?.includes("GEMINI_API_KEY not configured")) {
      errorMessage = "AI service is not configured. Please contact support.";
    } else if (error.message?.includes("Gemini API error")) {
      errorMessage = "AI service temporarily unavailable. Please try again in a moment.";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
