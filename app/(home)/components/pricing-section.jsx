"use client";

import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope } from "lucide-react";
import { creditBenefits } from "@/lib/data";

// Lazy load the heavy Pricing component
const Pricing = dynamic(() => import("@/components/pricing"), {
  loading: () => (
    <div className="h-96 flex items-center justify-center text-muted-foreground">
      Loading pricing...
    </div>
  ),
  ssr: false,
});

export function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10"
          >
            💎 Affordable Healthcare Plans
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-linear-to-r from-white via-emerald-100 to-white bg-clip-text">
            Consultation Packages
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Choose the perfect consultation package that fits your healthcare needs.
            <span className="block mt-2 text-emerald-400 font-semibold">
              All plans include credits that never expire! 🎉
            </span>
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Custom Pricing Cards */}
          <Pricing />

          {/* Benefits Section */}
          <Card className="mt-16 bg-linear-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-900/30 backdrop-blur-sm shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-emerald-400" />
                </div>
                How Our Credit System Works
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Simple, flexible, and designed for your convenience
              </p>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creditBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-card/30 border border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 bg-linear-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="h-5 w-5 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: benefit }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
