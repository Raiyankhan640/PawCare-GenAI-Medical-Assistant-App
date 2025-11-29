"use client";

import { forwardRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  Video,
  CreditCard,
  ShieldCheck,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: <User className="h-6 w-6 text-emerald-400" />,
    title: "Create Your Profile",
    description:
      "Sign up and complete your profile to get personalized healthcare recommendations and services.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-emerald-400" />,
    title: "Book Appointments",
    description:
      "Browse doctor profiles, check availability, and book appointments that fit your schedule.",
  },
  {
    icon: <Video className="h-6 w-6 text-emerald-400" />,
    title: "Video Consultation",
    description:
      "Connect with doctors through secure, high-quality video consultations from the comfort of your home.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-emerald-400" />,
    title: "Consultation Credits",
    description:
      "Purchase credit packages that fit your healthcare needs with our simple subscription model.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-emerald-400" />,
    title: "Verified Doctors",
    description:
      "All healthcare providers are carefully vetted and verified to ensure quality care.",
  },
  {
    icon: <FileText className="h-6 w-6 text-emerald-400" />,
    title: "Medical Documentation",
    description:
      "Access and manage your appointment history, doctor's notes, and medical recommendations.",
  },
];

export const FeaturesSection = forwardRef(function FeaturesSection(props, ref) {
  return (
    <section className="py-12 md:py-16 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform makes healthcare accessible with just a few clicks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              style={{ opacity: 1, visibility: "visible" }}
              className="feature-card bg-card/50 backdrop-blur-sm border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2 relative z-10">
                <div className="bg-linear-to-br from-emerald-900/30 to-emerald-800/20 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});