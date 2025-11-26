import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SPECIALTIES } from "@/lib/specialities";
import { Calendar, Shield, Star, Users, CheckCircle } from "lucide-react";

export default async function DoctorsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      {/* Enhanced Header Section */}
      <div className="flex flex-col items-center justify-center mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4 animate-fade-in">
          <Star className="w-4 h-4 fill-emerald-400" />
          <span>Top-Rated Veterinary Specialists</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text animate-gradient pb-2">
          Find The Perfect Vet
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Connect with experienced veterinarians for your pet's health needs.
          From general checkups to specialized care, we're here to help.
        </p>

        {/* Stats/Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 backdrop-blur-sm hover:bg-emerald-900/30 transition-colors duration-300">
            <div className="p-3 rounded-full bg-emerald-900/40 mb-3">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Verified Experts</h3>
            <p className="text-sm text-muted-foreground">100% Board Certified</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 backdrop-blur-sm hover:bg-emerald-900/30 transition-colors duration-300">
            <div className="p-3 rounded-full bg-emerald-900/40 mb-3">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Community Trusted</h3>
            <p className="text-sm text-muted-foreground">5000+ Happy Pets</p>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 backdrop-blur-sm hover:bg-emerald-900/30 transition-colors duration-300">
            <div className="p-3 rounded-full bg-emerald-900/40 mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Instant Booking</h3>
            <p className="text-sm text-muted-foreground">No Waiting Times</p>
          </div>
        </div>
      </div>

      {/* Specialties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
        {SPECIALTIES.map((specialty) => (
          <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
            <Card className="group relative overflow-hidden border-emerald-900/20 hover:border-emerald-700/40 transition-all cursor-pointer h-full shadow-xl hover:shadow-emerald-500/20 backdrop-blur-xl bg-gradient-to-br from-emerald-950/60 via-card/60 to-teal-950/40">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-teal-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              {/* Glowing border effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl"></div>
              </div>
              <CardContent className="relative z-10 p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-emerald-700/30 group-hover:border-emerald-500/50 backdrop-blur-sm">
                  <span className="text-emerald-400 text-3xl scale-125">{specialty.icon}</span>
                </div>
                <h3 className="font-semibold text-lg md:text-xl text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {specialty.name}
                </h3>
                <div className="mt-2 text-xs text-muted-foreground bg-emerald-900/20 px-3 py-1 rounded-lg border border-muted/20">
                  Click to view specialists
                </div>
              </CardContent>
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-br-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-3xl"></div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="flex flex-col items-center justify-center mt-12 animate-fade-in-up pb-12">
        <div className="p-[1px] rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300">
          <Link href="/appointments">
            <Button
              size="lg"
              className="rounded-full bg-background hover:bg-emerald-950/30 text-white border-none px-8 py-6 h-auto text-lg font-semibold group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  Check Your Appointments
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          View your upcoming schedule and past consultations
        </p>
      </div>
    </div>
  );
}