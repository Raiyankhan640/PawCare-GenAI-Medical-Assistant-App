"use client";

import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    initials: "SK",
    name: "Sadia Khan",
    role: "Pet Parent",
    quote:
      "The video consultation feature saved me so much time. I was able to get medical advice for my cat without traveling through Dhaka traffic.",
  },
  {
    initials: "RI",
    name: "Dr. Rafiqul Islam",
    role: "Veterinarian",
    quote:
      "This platform has allowed me to reach more pet owners across Bangladesh and provide timely care even from a distance.",
  },
  {
    initials: "JH",
    name: "Jamal Hossain",
    role: "Pet Parent",
    quote:
      "The credit system is very convenient. I purchased a package for my family's pets, and the service has been excellent.",
  },
];

export const TestimonialsSection = forwardRef(function TestimonialsSection(props, ref) {
  return (
    <section className="py-12 md:py-16 bg-muted/30" ref={ref} suppressHydrationWarning>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm"
          >
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear from patients and doctors who use our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              style={{ opacity: 1, visibility: "visible" }}
              className="testimonial-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer bg-card/50 backdrop-blur-sm relative overflow-hidden group"
              suppressHydrationWarning
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-emerald-900/30 to-emerald-800/20 flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 shadow-lg">
                    <span className="text-emerald-400 font-bold text-lg">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});