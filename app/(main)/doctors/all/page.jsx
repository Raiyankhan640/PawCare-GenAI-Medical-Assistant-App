import { db } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "All Veterinarians - PawCare",
  description: "Browse all verified veterinarians",
};

export default async function AllDoctorsPage() {
  const doctors = await db.user.findMany({
    where: {
      role: "DOCTOR",
      verificationStatus: "VERIFIED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <Card className="bg-card border-emerald-900/20 p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              No veterinarians available yet
            </p>
            <p className="text-muted-foreground text-sm">
              Run <code className="bg-muted px-2 py-1 rounded">npm run seed:doctors</code> to add sample doctors
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-emerald-400">
                        {doctor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-white mb-1">
                        {doctor.name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 text-xs"
                      >
                        {doctor.specialty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {doctor.description || "Experienced veterinary professional"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.experience || 0} years</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>4.9</span>
                      </div>
                    </div>

                    <Link href={`/doctors/${encodeURIComponent(doctor.specialty)}/${doctor.id}`}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        View Profile & Book
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}