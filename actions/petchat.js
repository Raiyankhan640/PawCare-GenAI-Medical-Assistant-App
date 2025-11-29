"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Get or create the most recent conversation for the current user
 */
export async function getOrCreateConversation() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

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

    return { success: true, conversation };
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    throw new Error("Failed to get or create conversation");
  }
}

/**
 * Save a message to the database
 */
export async function saveMessage(conversationId, role, content, imageUrl = null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const message = await db.chatMessage.create({
      data: {
        conversationId,
        role,
        content,
        imageUrl,
        hasImage: !!imageUrl,
      },
    });

    // Update conversation timestamp
    await db.chatConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/petchat");
    return { success: true, message };
  } catch (error) {
    console.error("Error in saveMessage:", error);
    throw new Error("Failed to save message");
  }
}

/**
 * Get all conversations for the current user
 */
export async function getUserConversations() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const conversations = await db.chatConversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1, // Just get first message for preview
        },
      },
    });

    return { success: true, conversations };
  } catch (error) {
    console.error("Error in getUserConversations:", error);
    throw new Error("Failed to get conversations");
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Verify ownership
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const conversation = await db.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or unauthorized");
    }

    await db.chatConversation.delete({
      where: { id: conversationId },
    });

    revalidatePath("/petchat");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteConversation:", error);
    throw new Error("Failed to delete conversation");
  }
}

/**
 * Bookmark a veterinary clinic location
 */
export async function bookmarkLocation(locationData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const location = await db.bookmarkedLocation.create({
      data: {
        userId: user.id,
        name: locationData.name,
        address: locationData.address,
        phone: locationData.phone || null,
        website: locationData.website || null,
        notes: locationData.notes || null,
        latitude: locationData.latitude || null,
        longitude: locationData.longitude || null,
      },
    });

    revalidatePath("/petchat");
    return { success: true, location };
  } catch (error) {
    console.error("Error in bookmarkLocation:", error);
    throw new Error("Failed to bookmark location");
  }
}

/**
 * Get all bookmarked locations for the current user
 */
export async function getBookmarkedLocations() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const locations = await db.bookmarkedLocation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, locations };
  } catch (error) {
    console.error("Error in getBookmarkedLocations:", error);
    throw new Error("Failed to get bookmarked locations");
  }
}

/**
 * Delete a bookmarked location
 */
export async function deleteBookmarkedLocation(locationId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Verify ownership
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const location = await db.bookmarkedLocation.findFirst({
      where: {
        id: locationId,
        userId: user.id,
      },
    });

    if (!location) {
      throw new Error("Location not found or unauthorized");
    }

    await db.bookmarkedLocation.delete({
      where: { id: locationId },
    });

    revalidatePath("/petchat");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteBookmarkedLocation:", error);
    throw new Error("Failed to delete location");
  }
}

/**
 * Create a new conversation
 */
export async function createNewConversation() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const conversation = await db.chatConversation.create({
      data: {
        userId: user.id,
        title: "New Chat",
      },
      include: { messages: true },
    });

    revalidatePath("/petchat");
    return { success: true, conversation };
  } catch (error) {
    console.error("Error in createNewConversation:", error);
    throw new Error("Failed to create conversation");
  }
}

/**
 * Update conversation title (auto-naming from first message)
 */
export async function updateConversationTitle(conversationId, title) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    // Verify ownership
    const conversation = await db.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or unauthorized");
    }

    // Generate title from first message (max 30 chars)
    const autoTitle = title.slice(0, 30) + (title.length > 30 ? "..." : "");

    await db.chatConversation.update({
      where: { id: conversationId },
      data: { title: autoTitle },
    });

    revalidatePath("/petchat");
    return { success: true };
  } catch (error) {
    console.error("Error in updateConversationTitle:", error);
    throw new Error("Failed to update conversation title");
  }
}

/**
 * Get a specific conversation by ID
 */
export async function getConversation(conversationId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findFirst({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    const conversation = await db.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId: user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return { success: true, conversation };
  } catch (error) {
    console.error("Error in getConversation:", error);
    throw new Error("Failed to get conversation");
  }
}
