"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Users, Stethoscope, Award } from "lucide-react";

const stats = [
  { icon: <PawPrint className="h-8 w-8" />, number: "50K+", label: "Happy Pets", color: "emerald" },
  { icon: <Users className="h-8 w-8" />, number: "25K+", label: "Pet Parents", color: "teal" },
  { icon: <Stethoscope className="h-8 w-8" />, number: "500+", label: "Verified Vets", color: "cyan" },
  { icon: <Award className="h-8 w-8" />, number: "98%", label: "Satisfaction Rate", color: "emerald" },
];

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm"
          >
            Platform Statistics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Pet Parents Everywhere
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join our growing community of pet lovers and veterinary professionals in Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="text-center p-6 bg-card/50 backdrop-blur-sm border-emerald-900/20 hover:border-emerald-700/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10 group">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {stat.number}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
