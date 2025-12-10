import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Credit allocations per plan
const PLAN_CREDITS = {
  free_user: 2,
  standard: 10,
  premium: 24,
};

export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  // Handle both user.created and user.updated events to ensure all login methods work
  if (eventType === "user.created" || eventType === "user.updated") {
    try {
      const { id, email_addresses, image_url, first_name, last_name } =
        evt.data;

      // Use upsert to handle both new users and updates to existing users
      const user = await db.user.upsert({
        where: { clerkUserId: id },
        update: {
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          imageUrl: image_url,
          email: email_addresses[0]?.email_address,
        },
        create: {
          clerkUserId: id,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          imageUrl: image_url,
          email: email_addresses[0]?.email_address,
        },
      });

      console.log(`User ${eventType === "user.created" ? "created" : "updated"} in database:`, user);
    } catch (error) {
      console.error(`Error ${eventType === "user.created" ? "creating" : "updating"} user in database:`, error);
      return new Response(`Error ${eventType === "user.created" ? "creating" : "updating"} user`, {
        status: 400,
      });
    }
  }

  // Handle subscription created/updated events (Clerk billing)
  if (eventType === "user.subscription.created" || eventType === "user.subscription.updated") {
    try {
      const { user_id, plan_id, status } = evt.data;
      
      console.log(`[Webhook] Subscription event for user ${user_id}, plan: ${plan_id}, status: ${status}`);

      // Only process active subscriptions
      if (status !== "active") {
        console.log(`[Webhook] Skipping non-active subscription status: ${status}`);
        return new Response("", { status: 200 });
      }

      // Find the user in our database
      const user = await db.user.findUnique({
        where: { clerkUserId: user_id },
      });

      if (!user) {
        console.error(`[Webhook] User not found for clerkUserId: ${user_id}`);
        return new Response("User not found", { status: 404 });
      }

      // Determine credits to allocate based on plan
      const creditsToAdd = PLAN_CREDITS[plan_id] || 0;

      if (creditsToAdd > 0) {
        // Create transaction and update credits
        await db.$transaction(async (tx) => {
          // Create credit transaction record
          await tx.creditTransaction.create({
            data: {
              userId: user.id,
              amount: creditsToAdd,
              type: "CREDIT_PURCHASE",
              packageId: plan_id,
            },
          });

          // Update user's credit balance
          await tx.user.update({
            where: { id: user.id },
            data: {
              credits: { increment: creditsToAdd },
            },
          });
        });

        console.log(`[Webhook] Added ${creditsToAdd} credits to user ${user.id} for plan ${plan_id}`);
      }
    } catch (error) {
      console.error("[Webhook] Error processing subscription:", error);
      return new Response("Error processing subscription", { status: 500 });
    }
  }

  // Handle checkout session completed (for one-time purchases)
  if (eventType === "checkout.session.completed") {
    try {
      const { user_id, line_items, amount_total } = evt.data;
      
      console.log(`[Webhook] Checkout completed for user ${user_id}, amount: ${amount_total}`);

      const user = await db.user.findUnique({
        where: { clerkUserId: user_id },
      });

      if (!user) {
        console.error(`[Webhook] User not found for clerkUserId: ${user_id}`);
        return new Response("User not found", { status: 404 });
      }

      // Calculate credits based on amount (if using direct checkout)
      // Assuming $1 = 1 credit for simplicity, adjust as needed
      const creditsToAdd = Math.floor((amount_total || 0) / 100);

      if (creditsToAdd > 0) {
        await db.$transaction(async (tx) => {
          await tx.creditTransaction.create({
            data: {
              userId: user.id,
              amount: creditsToAdd,
              type: "CREDIT_PURCHASE",
              packageId: "checkout",
            },
          });

          await tx.user.update({
            where: { id: user.id },
            data: {
              credits: { increment: creditsToAdd },
            },
          });
        });

        console.log(`[Webhook] Added ${creditsToAdd} credits to user ${user.id} from checkout`);
      }
    } catch (error) {
      console.error("[Webhook] Error processing checkout:", error);
      return new Response("Error processing checkout", { status: 500 });
    }
  }

  return new Response("", { status: 200 });
}
