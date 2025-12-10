import { verifyAdmin } from "@/actions/admin";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard - PawCare",
  description: "Manage doctors, patients, and platform settings",
};

export default async function AdminLayout({ children }) {
  // Verify the user has admin access
  const isAdmin = await verifyAdmin();

  // Redirect if not an admin
  if (!isAdmin) {
    redirect("/onboarding");
  }

  return (
    <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
      {children}
    </div>
  );
}