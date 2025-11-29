"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { preloadRoutes } from "@/lib/performance";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Lazy load section components
const HeroSection = dynamic(() => import("./(home)/components/hero-section").then(mod => ({ default: mod.HeroSection })), {
  ssr: true,
});
const FeaturesSection = dynamic(() => import("./(home)/components/features-section").then(mod => ({ default: mod.FeaturesSection })), {
  ssr: true,
});
const PricingSection = dynamic(() => import("./(home)/components/pricing-section").then(mod => ({ default: mod.PricingSection })), {
  ssr: true,
});
const TestimonialsSection = dynamic(() => import("./(home)/components/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })), {
  ssr: true,
});
const StatsSection = dynamic(() => import("./(home)/components/stats-section").then(mod => ({ default: mod.StatsSection })), {
  ssr: true,
});
const EmergencySection = dynamic(() => import("./(home)/components/emergency-section").then(mod => ({ default: mod.EmergencySection })), {
  ssr: true,
});
const ComparisonSection = dynamic(() => import("./(home)/components/comparison-section").then(mod => ({ default: mod.ComparisonSection })), {
  ssr: true,
});
const HealthTipsSection = dynamic(() => import("./(home)/components/health-tips-section").then(mod => ({ default: mod.HealthTipsSection })), {
  ssr: true,
});
const CTASection = dynamic(() => import("./(home)/components/cta-section").then(mod => ({ default: mod.CTASection })), {
  ssr: true,
});

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const pageRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  // Preload routes on mount
  useEffect(() => {
    preloadRoutes();
  }, []);
  
  // GSAP scroll animations
  useEffect(() => {
    // Set initial visibility to prevent blank content
    gsap.set(".hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-image", { opacity: 1 });
    gsap.set(".feature-card, .testimonial-card", { opacity: 1 });
    
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-badge", {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power3.out"
      });
      
      gsap.from(".hero-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
      });
      
      gsap.from(".hero-description", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out"
      });
      
      gsap.from(".hero-buttons", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out"
      });
      
      gsap.from(".hero-image", {
        opacity: 0,
        x: 50,
        duration: 1,
        delay: 0.8,
        ease: "power3.out"
      });
      
      // Features cards animation
      if (featuresRef.current) {
        gsap.from(".feature-card", {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all"
        });
      }
      
      // Testimonials animation
      if (testimonialsRef.current) {
        gsap.from(".testimonial-card", {
          scrollTrigger: {
            trigger: testimonialsRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          opacity: 0,
          scale: 0.9,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "all"
        });
      }
    }, pageRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-background" ref={pageRef}>
      <HeroSection />
      <FeaturesSection ref={featuresRef} />
      <PricingSection />
      <TestimonialsSection ref={testimonialsRef} />
      <StatsSection />
      <EmergencySection />
      <ComparisonSection />
      <HealthTipsSection />
      <CTASection />
    </div>
  );
}