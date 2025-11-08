import { db } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";

export const metadata = {
  title: "Find Veterinarians - PawCare",
  description: "Browse veterinarians by specialty",
};

export default async function DoctorsPage() {
  // Get count of doctors per specialty
  const doctorCounts = await db.user.groupBy({
    by: ["specialty"],
    where: {
      role: "DOCTOR",
      verificationStatus: "VERIFIED",
    },
    _count: {
      specialty: true,
    },
  });

  const countMap = doctorCounts.reduce((acc, item) => {
    acc[item.specialty] = item._count.specialty;
    return acc;
  }, {});

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-4"
          >
            Find Expert Care
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Veterinarians
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Select a specialty to find qualified veterinarians for your pet's needs
          </p>
          <Link href="/doctors/all">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
              View All Veterinarians
            </button>
          </Link>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALTIES.map((specialty) => {
            const count = countMap[specialty.name] || 0;
            
            return (
              <Link
                key={specialty.name}
                href={`/doctors/${encodeURIComponent(specialty.name)}`}
              >
                <Card className="bg-card border-emerald-900/20 hover:border-emerald-800/40 transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-900/30 transition-colors">
                      {specialty.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-white">
                      {specialty.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {count > 0 ? (
                        <>
                          <span className="text-emerald-400 font-semibold">
                            {count}
                          </span>{" "}
                          {count === 1 ? "veterinarian" : "veterinarians"} available
                        </>
                      ) : (
                        <span className="text-muted-foreground/60">
                          No veterinarians yet
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-emerald-900/20 to-emerald-950/10 border-emerald-800/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Are you a veterinarian?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join our network of verified professionals and help pet owners
                provide the best care for their animals.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Join as a Veterinarian
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}