"use client";

import { memo, useMemo } from "react";
import { User, Star, Calendar, MapPin, Award, Clock, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Static stats data - moved outside component to prevent recreation
const STATS_DATA = [
  { label: "Consultations", value: "250+", icon: "calendar" },
  { label: "Rating", value: "4.9", icon: "star" },
  { label: "Response", value: "< 1hr", icon: "clock" }
];

// Icon map to avoid conditional rendering in JSX
const StatIcon = memo(function StatIcon({ type }) {
  switch (type) {
    case "calendar": return <Calendar className="h-3 w-3" />;
    case "star": return <Star className="h-3 w-3" />;
    case "clock": return <Clock className="h-3 w-3" />;
    default: return null;
  }
});

// Stats item component - memoized
const StatItem = memo(function StatItem({ stat }) {
  return (
    <div className="text-center p-2 bg-card/50 rounded-lg border border-emerald-900/20">
      <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
        <StatIcon type={stat.icon} />
        <span className="text-xs font-bold">{stat.value}</span>
      </div>
      <div className="text-[10px] text-muted-foreground">{stat.label}</div>
    </div>
  );
});

// Doctor avatar component - memoized
const DoctorAvatar = memo(function DoctorAvatar({ imageUrl, name }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-md group-hover:blur-lg transition-all" />
      <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-emerald-900/40 to-teal-900/40 flex items-center justify-center ring-2 ring-emerald-500/30 group-hover:ring-emerald-400/50 transition-all">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <User className="h-10 w-10 text-emerald-400" />
        )}
        {/* Online indicator - CSS animation instead of framer-motion */}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-card shadow-lg animate-pulse" />
      </div>
    </div>
  );
});

// Main DoctorCard component - memoized with custom comparison
export const DoctorCard = memo(function DoctorCard({ doctor, index = 0 }) {
  // Memoize computed values
  const doctorDescription = useMemo(() =>
    doctor.description || "Experienced veterinarian dedicated to providing exceptional care for your beloved pets with compassion and expertise.",
    [doctor.description]
  );

  const profileLink = useMemo(() =>
    `/doctors/${encodeURIComponent(doctor.specialty)}/${doctor.id}`,
    [doctor.specialty, doctor.id]
  );

  // CSS animation delay based on index
  const animationStyle = useMemo(() => ({
    animationDelay: `${index * 100}ms`,
  }), [index]);

  return (
    <div
      className="animate-fade-in-up hover:-translate-y-2 transition-transform duration-300"
      style={animationStyle}
    >
      <Card className="border-emerald-900/20 hover:border-emerald-600/50 transition-all duration-300 overflow-hidden group relative bg-linear-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20">
        {/* Gradient overlay - CSS only */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500" />

        {/* Shimmer effect - CSS only */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start gap-4 mb-4">
            {/* Doctor Avatar - CSS hover scale */}
            <div className="group-hover:scale-110 transition-transform duration-300">
              <DoctorAvatar imageUrl={doctor.imageUrl} name={doctor.name} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors line-clamp-1">
                  Dr. {doctor.name}
                </h3>

                <Badge
                  variant="outline"
                  className="bg-emerald-900/30 border-emerald-600/40 text-emerald-400 shrink-0 shadow-lg group-hover:rotate-3 transition-transform"
                >
                  <Star className="h-3 w-3 mr-1 fill-emerald-400" />
                  Verified
                </Badge>
              </div>

              {/* Specialty Badge */}
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="bg-linear-to-r from-emerald-950/40 to-teal-950/40 border-emerald-700/30 text-emerald-300 text-xs"
                >
                  <Stethoscope className="h-3 w-3 mr-1" />
                  {doctor.specialty}
                </Badge>
              </div>

              {/* Experience */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">{doctor.experience}</span> years
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 p-3 bg-emerald-950/20 rounded-lg border border-emerald-900/20 group-hover:border-emerald-800/40 transition-all">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {doctorDescription}
            </p>
          </div>

          {/* Stats Row - Using memoized components */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {STATS_DATA.map((stat, idx) => (
              <StatItem key={idx} stat={stat} />
            ))}
          </div>

          {/* Location */}
          {doctor.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 px-3 py-2 bg-card/30 rounded-lg">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span className="line-clamp-1">{doctor.location}</span>
            </div>
          )}

          {/* Action Button */}
          <Button
            asChild
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:shadow-emerald-500/40 transition-all relative overflow-hidden"
          >
            <Link href={profileLink}>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                <Calendar className="h-4 w-4" />
                View Profile & Book Appointment
              </span>
              {/* Button shimmer - CSS animation */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
            </Link>
          </Button>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 text-xs py-2 px-3 rounded-lg bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50 transition-all border border-emerald-900/20 hover:border-emerald-700/40">
              Quick Chat
            </button>
            <button className="flex-1 text-xs py-2 px-3 rounded-lg bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50 transition-all border border-emerald-900/20 hover:border-emerald-700/40">
              View Schedule
            </button>
          </div>
        </CardContent>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if doctor data changed
  return (
    prevProps.doctor.id === nextProps.doctor.id &&
    prevProps.doctor.name === nextProps.doctor.name &&
    prevProps.doctor.specialty === nextProps.doctor.specialty &&
    prevProps.doctor.experience === nextProps.doctor.experience &&
    prevProps.doctor.imageUrl === nextProps.doctor.imageUrl &&
    prevProps.doctor.location === nextProps.doctor.location &&
    prevProps.doctor.description === nextProps.doctor.description &&
    prevProps.index === nextProps.index
  );
});