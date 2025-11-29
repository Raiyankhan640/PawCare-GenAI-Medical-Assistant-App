"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Phone,
  HeartPulse,
  BriefcaseMedical,
  Heart,
  CheckCircle2,
} from "lucide-react";

const emergencyFeatures = [
  { icon: <Phone className="h-5 w-5" />, text: "Instant vet consultation via call or video" },
  { icon: <HeartPulse className="h-5 w-5" />, text: "Real-time health monitoring and alerts" },
  { icon: <BriefcaseMedical className="h-5 w-5" />, text: "Emergency clinic locator near you" },
];

const emergencyServices = [
  "Emergency Triage Assessment",
  "Video Consultation Available",
  "Prescription Services",
  "Follow-up Care Included",
];

export function EmergencySection() {
  return (
    <section className="py-12 md:py-16 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="bg-red-900/30 border-red-700/30 px-4 py-1 text-red-400 text-sm font-medium mb-4 backdrop-blur-sm"
            >
              <AlertCircle className="h-3 w-3 mr-2 inline" />
              Emergency Care
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              24/7 Emergency Veterinary Support
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Pet emergencies don&apos;t wait for business hours. Our platform connects you with emergency veterinary care anytime, anywhere. Get instant help when your furry friend needs it most.
            </p>

            <div className="space-y-4 mb-8">
              {emergencyFeatures.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-emerald-900/20 hover:border-emerald-700/40 transition-all duration-300 group"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <p className="text-white pt-2">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 group"
            >
              <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Emergency Hotline
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="p-8 bg-linear-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-900/30 backdrop-blur-sm relative overflow-hidden">
              {/* Animated pulse effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
              />

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-red-500/30 to-red-600/30 flex items-center justify-center text-red-400 shadow-2xl shadow-red-500/20"
                  >
                    <Heart className="h-12 w-12" fill="currentColor" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">Always Here For You</h3>
                  <p className="text-emerald-400 font-semibold">Response Time: &lt; 2 Minutes</p>
                </div>

                <div className="space-y-4">
                  {emergencyServices.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-3 text-white"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
