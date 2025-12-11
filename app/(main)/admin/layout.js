import { verifyAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const metadata = {
  title: "Admin Dashboard - PawCare",
  description: "Manage doctors, patients, and platform settings",
};

export default async function AdminLayout({ children }) {
  // Try to get userId directly first
  let userId = null;
  try {
    const authResult = await auth();
    userId = authResult?.userId;
  } catch (error) {
    console.log("[Admin Layout] Auth error:", error.message);
  }

  // Verify the user has admin access (passing userId as fallback)
  const isAdmin = await verifyAdmin(userId);

  // Redirect if not an admin - send to home, not onboarding
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
      {children}
    </div>
  );
}