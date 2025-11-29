import { NextResponse } from "next/server";
import { getOrCreateConversation } from "@/actions/petchat";

export async function GET() {
  try {
    const result = await getOrCreateConversation();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Conversation API error:", error);

    return NextResponse.json(
      { error: "Failed to load conversation" },
      { status: 500 }
    );
  }
}
