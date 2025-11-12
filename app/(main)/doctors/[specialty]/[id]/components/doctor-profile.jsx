// /app/doctors/[id]/_components/doctor-profile.jsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  HeartPulse,
  MapPin,
  Medal,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SlotPicker } from "./slot-picker";
import { AppointmentForm } from "./appointment-form";

const specialtyFocus = {
  "Small Animal Medicine": [
    "Preventive wellness & routine screenings",
    "Nutrition counselling tailored to each pet",
    "Chronic condition management plans",
  ],
  "Veterinary Surgery": [
    "Advanced soft tissue & orthopedic procedures",
    "Comprehensive pre & post-operative care",
    "Minimally invasive surgical options",
  ],
  "Veterinary Cardiology": [
    "Echocardiography & cardiac imaging diagnostics",
    "Heart disease medication optimization",
    "Lifestyle guidance for cardiac support",
  ],
  "Exotic Pet Medicine": [
    "Species-specific wellness & habitat planning",
    "Emergency stabilization for exotic pets",
    "Nutritional protocols for exotic species",
  ],
  "Veterinary Dermatology": [
    "Allergy testing & immunotherapy",
    "Chronic skin condition maintenance",
    "Laser-assisted dermatologic procedures",
  ],
  "Emergency & Critical Care": [
    "Rapid triage & ICU-level monitoring",
    "24/7 trauma & surgical readiness",
    "Critical stabilization & pain management",
  ],
  "Veterinary Dentistry": [
    "Advanced dental imaging & diagnostics",
    "Oral surgery & periodontal therapy",
    "Home dental care education for pet parents",
  ],
  "Veterinary Neurology": [
    "Neurologic exams & electrodiagnostics",
    "Seizure control & long-term monitoring",
    "Spinal surgery & rehabilitation roadmaps",
  ],
};

export function DoctorProfile({ doctor, availableDays }) {
  const router = useRouter();
  const bookingCardRef = useRef(null);
  const [showBooking, setShowBooking] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const totalSlots = availableDays?.reduce(
    (total, day) => total + (day.slots?.length || 0),
    0
  );

  const nextAvailableDay = availableDays?.find((day) => day.slots?.length);
  const nextAvailableSlot = nextAvailableDay?.slots?.[0];
  const nextAvailabilityLabel = nextAvailableSlot
    ? `${nextAvailableDay.displayDate} • ${nextAvailableSlot.formatted}`
    : "Will update soon";

  const focusAreas =
    specialtyFocus[doctor.specialty] ?? [
      `Advanced ${doctor.specialty?.toLowerCase() || "pet"} care protocols`,
      "Preventive wellness planning",
      "Personalized pet parent coaching",
    ];

  const careerStartYear = new Date().getFullYear() - (doctor.experience || 0);

  const toggleBooking = () => {
    setShowBooking((previous) => {
      const nextState = !previous;
      if (!previous) {
        requestAnimationFrame(() =>
          bookingCardRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        );
      }
      return nextState;
    });
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingComplete = () => {
    router.push("/appointments");
  };

  return (
    <div className="relative space-y-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[160px]" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-3xl border border-emerald-900/30 bg-linear-to-br from-emerald-950/60 via-card/60 to-teal-950/40 shadow-2xl shadow-emerald-900/20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.12),transparent_55%)]" />
          <div className="relative grid gap-8 p-8 lg:grid-cols-[360px,1fr] lg:p-12">
            <div className="space-y-6">
              <div className="relative flex flex-col items-center text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
                  <div className="relative h-36 w-36 overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-900/40 shadow-xl shadow-emerald-500/30">
                    {doctor.imageUrl ? (
                      <Image
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-14 w-14 text-emerald-300" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    <Sparkles className="h-3 w-3" /> PawCare Specialist
                  </div>
                  <h1 className="text-3xl font-bold text-white md:text-4xl">
                    Dr. {doctor.name}
                  </h1>
                  <p className="text-sm text-emerald-200/80">
                    {doctor.specialty}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-900/30 px-3 py-1 text-emerald-300"
                  >
                    <Medal className="mr-2 h-3.5 w-3.5" />
                    {doctor.experience}+ yrs experience
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-900/30 px-3 py-1 text-emerald-300"
                  >
                    <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                    Verified Specialist
                  </Badge>
                </div>

                <div className="mt-6 grid w-full grid-cols-2 gap-4 rounded-2xl border border-emerald-500/10 bg-emerald-950/40 p-4 text-left shadow-lg">
                  {[
                    {
                      label: "Average rating",
                      value: String(doctor.rating ?? "4.9"),
                      icon: <Star className="h-4 w-4 text-amber-300" />,
                    },
                    {
                      label: "Response time",
                      value: String(doctor.responseTime ?? "< 1 hr"),
                      icon: <MessageCircle className="h-4 w-4 text-emerald-300" />,
                    },
                    {
                      label: "Total slots (4 days)",
                      value: String(totalSlots ?? 0),
                      icon: <Calendar className="h-4 w-4 text-emerald-300" />,
                    },
                    {
                      label: "Next availability",
                      value: nextAvailabilityLabel,
                      icon: <Clock className="h-4 w-4 text-emerald-300" />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="space-y-1 rounded-xl border border-emerald-500/5 bg-emerald-950/50 p-3"
                    >
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-emerald-300/80">
                        {item.icon}
                        {item.label}
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex w-full flex-col gap-3 pt-4">
                  <Button
                    className="w-full bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    onClick={toggleBooking}
                  >
                    Book an appointment
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="gap-2 border-emerald-500/30 bg-emerald-950/40 text-emerald-200">
                      <Phone className="h-4 w-4" /> Call clinic
                    </Button>
                    <Button variant="outline" className="gap-2 border-emerald-500/30 bg-emerald-950/40 text-emerald-200">
                      <MessageCircle className="h-4 w-4" /> Send note
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6 rounded-2xl border border-emerald-500/10 bg-emerald-950/40 p-6 shadow-lg">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-900/30 px-3 py-1 text-sm text-emerald-200">
                    <HeartPulse className="h-4 w-4" /> Dedicated to compassionate pet healthcare
                  </div>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground">
                  {doctor.description ||
                    "Committed to proactive wellness care, accurate diagnosis, and supportive guidance for every pet family."}
                </p>

                <Separator className="bg-emerald-900/30" />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">
                    Core focus areas
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {focusAreas.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-950/50 p-3 text-sm text-muted-foreground"
                      >
                        <ShieldCheck className="mt-1 h-4 w-4 text-emerald-300" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                      Practice location
                    </p>
                    <div className="mt-2 flex items-start gap-3 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>{doctor.location || "PawCare Medical Center, Downtown"}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                      Consultation style
                    </p>
                    <div className="mt-2 flex items-start gap-3 text-sm text-muted-foreground">
                      <Stethoscope className="mt-0.5 h-4 w-4 text-emerald-300" />
                      <span>Thorough evaluations with collaborative treatment planning for pet parents.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="grid gap-6 xl:grid-cols-[1.4fr,1fr]"
      >
        <Card className="border-emerald-900/30 bg-emerald-950/50 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-300" />
              <CardTitle className="text-2xl text-white">
                Professional journey & pet parent resources
              </CardTitle>
            </div>
            <CardDescription>
              Explore the way Dr. {doctor.name.split(" ")[0]} supports every consultation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="approach" className="space-y-6">
              <TabsList className="bg-emerald-950/60">
                <TabsTrigger value="approach">Care approach</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="pet-parents">Pet parent tips</TabsTrigger>
              </TabsList>
              <TabsContent value="approach" className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      title: "Initial consultation",
                      description:
                        "In-depth review of lifestyle, history, and current concerns to map a personalized care plan.",
                    },
                    {
                      title: "Treatment roadmap",
                      description:
                        "Collaborative planning with clear milestones, recommended diagnostics, and comfort-first approach.",
                    },
                    {
                      title: "Ongoing support",
                      description:
                        "Follow-up touchpoints, home care checklists, and readily available support for pet parents.",
                    },
                  ].map((step, index) => (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-emerald-500/10 bg-emerald-950/60 p-5 shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-900/40 text-sm font-semibold text-emerald-200">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-white">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="credentials" className="space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-emerald-950/60 p-4">
                    <Medal className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">Board certified specialist</p>
                      <p className="text-xs text-muted-foreground">
                        Verified credentials and continuous professional development through PawCare Academy.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                      Career timeline
                    </p>
                    <div className="mt-4 space-y-4">
                      {[
                        {
                          year: careerStartYear,
                          label: "Graduated & began clinical residency",
                        },
                        {
                          year: careerStartYear + 2,
                          label: "Completed advanced specialization in " +
                            (doctor.specialty || "veterinary medicine").toLowerCase(),
                        },
                        {
                          year: careerStartYear + Math.max(doctor.experience - 2, 3),
                          label: "Joined PawCare network, mentoring junior vets",
                        },
                      ].map((event) => (
                        <div
                          key={event.year}
                          className="flex items-start gap-4 rounded-xl border border-emerald-500/10 bg-emerald-950/40 p-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900/40 text-sm font-semibold text-emerald-200">
                            {event.year}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pet-parents" className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    "Personalized home-care checklists after every visit",
                    "Video summaries of complex procedures for easy review",
                    "Direct messaging portal for post-consult questions",
                    "Quarterly wellness webinars for PawCare members",
                  ].map((tip) => (
                    <div
                      key={tip}
                      className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-950/50 p-3 text-sm text-muted-foreground"
                    >
                      <Star className="mt-1 h-4 w-4 text-emerald-300" />
                      {tip}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <motion.div
          ref={bookingCardRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Card className="border-emerald-900/30 bg-emerald-950/60 shadow-2xl">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/70">
                      Next available appointment
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {nextAvailableSlot
                        ? `${nextAvailableDay.day} • ${nextAvailableSlot}`
                        : "We will release new slots shortly"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Secure your spot with a simple two-step booking flow.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/30 bg-emerald-950/40 text-emerald-200"
                    onClick={toggleBooking}
                  >
                    {showBooking ? "Hide" : "Schedule"}
                  </Button>
                </div>

                <Separator className="bg-emerald-900/30" />

                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                      !selectedSlot
                        ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-200"
                        : "border-emerald-500/20 bg-emerald-950/50"
                    }`}
                  >
                    1
                  </div>
                  Choose time slot
                  <span className="h-px flex-1 bg-emerald-900/40" />
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                      selectedSlot
                        ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-200"
                        : "border-emerald-500/20 bg-emerald-950/50"
                    }`}
                  >
                    2
                  </div>
                  Share pet details
                </div>
              </div>
            </CardHeader>

            {showBooking && (
              <CardContent className="space-y-6">
                {totalSlots > 0 ? (
                  <>
                    {!selectedSlot && (
                      <SlotPicker
                        days={availableDays}
                        onSelectSlot={handleSlotSelect}
                      />
                    )}

                    {selectedSlot && (
                      <AppointmentForm
                        doctorId={doctor.id}
                        slot={selectedSlot}
                        onBack={() => setSelectedSlot(null)}
                        onComplete={handleBookingComplete}
                      />
                    )}
                  </>
                ) : (
                  <Alert className="border-emerald-500/20 bg-emerald-950/60">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Dr. {doctor.name.split(" ")[0]} is fully booked for the
                      next few days. We&apos;ll notify you as soon as new slots open.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
}