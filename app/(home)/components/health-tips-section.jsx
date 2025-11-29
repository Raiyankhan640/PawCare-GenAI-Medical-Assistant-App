"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  Syringe,
  Activity,
  Heart,
  ClipboardCheck,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

const healthTips = [
  {
    icon: <Pill className="h-8 w-8" />,
    title: "Vaccination Schedule",
    description: "Keep your pet's vaccinations up to date. Core vaccines protect against serious diseases.",
    tips: ["Puppy/Kitten: 6-8 weeks", "Booster shots: Annual", "Rabies: Every 1-3 years"],
  },
  {
    icon: <Syringe className="h-8 w-8" />,
    title: "Preventive Care",
    description: "Regular check-ups can detect health issues early. Prevention is better than cure.",
    tips: ["Dental check: 6 months", "Blood work: Annually", "Parasite control: Monthly"],
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "Exercise & Nutrition",
    description: "Balanced diet and regular exercise are key to your pet's wellbeing and longevity.",
    tips: ["Daily walks: 30-60 min", "Quality food: Age-appropriate", "Fresh water: Always available"],
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Mental Health",
    description: "Pets need mental stimulation and social interaction to stay happy and healthy.",
    tips: ["Interactive toys", "Social playtime", "Training sessions"],
  },
  {
    icon: <ClipboardCheck className="h-8 w-8" />,
    title: "Warning Signs",
    description: "Know the signs that indicate your pet needs immediate veterinary attention.",
    tips: ["Loss of appetite", "Lethargy", "Vomiting/Diarrhea"],
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Pet Safety",
    description: "Create a safe environment for your pet at home and during outdoor activities.",
    tips: ["Pet-proof home", "ID tags & microchip", "Supervised outdoor time"],
  },
];

export function HealthTipsSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm"
          >
            Health Tips
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Essential Pet Care Tips
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert advice to keep your pets healthy and happy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthTips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-emerald-900/20 hover:border-emerald-700/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group">
                <div className="w-16 h-16 mb-4 rounded-full bg-linear-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {tip.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {tip.description}
                </p>
                <ul className="space-y-2">
                  {tip.tips.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30"
          >
            <Link href="/doctors">
              <Stethoscope className="mr-2 h-5 w-5" />
              Consult a Vet Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
