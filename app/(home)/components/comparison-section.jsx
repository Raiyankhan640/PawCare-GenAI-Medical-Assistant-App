"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X } from "lucide-react";

const comparisonData = [
  { feature: "Appointment Wait Time", traditional: "1-2 Weeks", pawcare: "Same Day" },
  { feature: "Consultation Fee", traditional: "$100-200", pawcare: "From $25" },
  { feature: "24/7 Support", traditional: "Limited", pawcare: "Always Available" },
  { feature: "Medical Records", traditional: "Paper Based", pawcare: "Digital & Secure" },
  { feature: "Follow-up Care", traditional: "Extra Visit Required", pawcare: "Included Free" },
  { feature: "Second Opinion", traditional: "Not Available", pawcare: "Instant Access" },
];

export function ComparisonSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm"
          >
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Traditional vs PawCare Platform
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how we&apos;re revolutionizing pet healthcare
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Header Row */}
            <div className="hidden md:block" />
            <div className="text-center p-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <X className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">Traditional Care</h3>
              </div>
            </div>
            <div className="text-center p-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white">PawCare Platform</h3>
              </div>
            </div>

            {/* Comparison Rows */}
            {comparisonData.map((row, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="contents"
              >
                <div className="p-4 bg-card/30 backdrop-blur-sm border border-emerald-900/20 rounded-lg flex items-center md:rounded-r-none">
                  <span className="font-medium text-white">{row.feature}</span>
                </div>
                <div className="p-4 bg-card/20 backdrop-blur-sm border border-red-900/20 rounded-lg flex items-center justify-center md:rounded-none">
                  <span className="text-red-400 text-sm md:text-base">{row.traditional}</span>
                </div>
                <div className="p-4 bg-card/20 backdrop-blur-sm border border-emerald-900/20 rounded-lg flex items-center justify-center md:rounded-l-none">
                  <span className="text-emerald-400 font-semibold text-sm md:text-base">{row.pawcare}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
