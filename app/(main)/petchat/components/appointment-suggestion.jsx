"use client";

import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AppointmentSuggestion({ aiResponse }) {
  // Check if AI suggested booking an appointment
  const needsAppointment = aiResponse && aiResponse.includes("[APPOINTMENT_NEEDED]");

  if (!needsAppointment) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-2"
    >
      <Alert className="bg-amber-500/10 border-amber-500/30">
        <Calendar className="h-4 w-4 text-amber-400" />
        <AlertTitle className="text-amber-400 font-semibold">
          Appointment Recommended
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-sm text-amber-400/90 mb-3">
            Based on the symptoms described, the AI recommends scheduling a veterinary
            appointment as soon as possible.
          </p>
          <Link href="/doctors/all">
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              Find Available Doctors
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
