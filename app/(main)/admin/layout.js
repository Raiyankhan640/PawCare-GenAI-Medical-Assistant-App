import { auth } from "@clerk/nextjs/server";

export const metadata = {
  title: "Admin Dashboard - PawCare",
  description: "Manage doctors, patients, and platform settings",
};

export default async function AdminLayout({ children }) {
  // Skip verification for now - just render the dashboard
  return (
    <div className="container mx-auto px-4 py-8" suppressHydrationWarning>
      {children}
    </div>
  );
}