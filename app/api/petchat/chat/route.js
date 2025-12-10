import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGeminiResponse, detectIntent } from "@/lib/gemini";
import { saveMessage, getConversation, updateConversationTitle } from "@/actions/petchat";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(5000),
  imageUrl: z.string().nullish(),  // File path for DB storage
  imageData: z.string().nullish(), // Base64 data for Gemini analysis
  conversationId: z.string().uuid(),
});

export async function POST(req) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const validation = chatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { message, imageUrl, imageData, conversationId } = validation.data;

    // Save user message
    await saveMessage(conversationId, "USER", message, imageUrl);

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

    // Save AI response
    await saveMessage(conversationId, "ASSISTANT", aiResponse);

    // Auto-name conversation if it's still "New Chat"
    try {
      const conversationResult = await getConversation(conversationId);
      if (conversationResult.success && conversationResult.conversation.title === "New Chat") {
        await updateConversationTitle(conversationId, message);
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
