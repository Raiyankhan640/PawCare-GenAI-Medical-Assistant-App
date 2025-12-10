import { getCachedAllDoctors } from "@/lib/cache";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import DoctorsListClient from "./components/doctors-list-client";

export const metadata = {
  title: "All Veterinarians - PawCare",
  description: "Browse all verified veterinarians",
};

export default async function AllDoctorsPage() {
  // Use cached query - revalidates every 5 minutes
  const doctors = await getCachedAllDoctors();

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/doctors"
            className="text-emerald-400 hover:text-emerald-300 mb-4 inline-block"
          >
            ← Back to Specialties
          </Link>
          <div className="text-center">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-4"
            >
              All Veterinarians
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Expert Team
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {doctors.length} verified veterinarians ready to help
            </p>
          </div>
        </div>

        {/* Doctors List with Search and Filter */}
        <DoctorsListClient doctors={doctors} />
      </div>
    </div>
  );
}
