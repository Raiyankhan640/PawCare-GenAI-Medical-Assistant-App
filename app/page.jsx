"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Stethoscope,
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pricing from "@/components/pricing";
import { creditBenefits } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  
  // Define features with icons inline
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

  // Define testimonials inline
  const testimonials = [
    {
      initials: "SP",
      name: "Sarah P.",
      role: "Patient",
      quote:
        "The video consultation feature saved me so much time. I was able to get medical advice without taking time off work or traveling to a clinic.",
    },
    {
      initials: "DR",
      name: "Dr. Robert M.",
      role: "Cardiologist",
      quote:
        "This platform has revolutionized my practice. I can now reach more patients and provide timely care without the constraints of a physical office.",
    },
    {
      initials: "JT",
      name: "James T.",
      role: "Patient",
      quote:
        "The credit system is so convenient. I purchased a package for my family, and we've been able to consult with specialists whenever needed.",
    },
  ];
  
  // Debug: Log to ensure data is loaded
  useEffect(() => {
    console.log("Features loaded:", features.length);
    console.log("Testimonials loaded:", testimonials.length);
    console.log("First feature:", features[0]);
    console.log("First testimonial:", testimonials[0]);
  }, [features, testimonials]);
  
  useEffect(() => {
    // Set initial visibility to prevent blank content
    gsap.set(".hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-image", { opacity: 1 });
    gsap.set(".feature-card, .testimonial-card", { opacity: 1 });
    
    // Hero section animations
    const ctx = gsap.context(() => {
      // Animate from transparent
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
      
      // Features cards animation with better trigger
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
      
      // Testimonials animation with better trigger
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
          ease: "back.out(1.2)",
          clearProps: "all"
        });
      }
    }, heroRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-background" ref={heroRef}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant="outline"
                className="hero-badge bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium backdrop-blur-sm"
              >
                Healthcare made simple
              </Badge>
              <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Connect with doctors <br />
                <span className="gradient-title bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  anytime, anywhere
                </span>
              </h1>
              <p className="hero-description text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointments, consult via video, and manage your healthcare
                journey all in one secure platform.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/25 relative overflow-hidden group"
                >
                  <Link href="/onboarding">
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-emerald-700/30 hover:bg-emerald-900/20 backdrop-blur-sm"
                >
                  <Link href="/doctors">Find Doctors</Link>
                </Button>
              </div>
            </div>

            <div className="hero-image relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent rounded-xl z-10"></div>
              <Image
                src="/banner2.png"
                alt="Doctor consultation"
                fill
                priority
                className="object-cover md:pt-14 rounded-xl hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
                style={{ opacity: 1, visibility: 'visible' }}
                className="feature-card bg-card/50 backdrop-blur-sm border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="pb-2 relative z-10">
                  <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with green medical styling */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
            >
              Affordable Healthcare
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Consultation Packages
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect consultation package that fits your healthcare
              needs
            </p>
          </div>

          <div className="mx-auto">
            {/* Clerk Pricing Table */}
            <Pricing />

            {/* Description */}
            <Card className="mt-12 bg-muted/20 border-emerald-900/30">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-emerald-400" />
                  How Our Credit System Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {creditBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full">
                        <svg
                          className="h-4 w-4 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: benefit }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials with green medical accents */}
      <section className="py-20 bg-muted/30" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
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
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                style={{ opacity: 1, visibility: 'visible' }}
                className="testimonial-card border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer bg-card/50 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110 shadow-lg">
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

      {/* CTA Section with green medical styling */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20">
            <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to take control of your healthcare?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of users who have simplified their healthcare
                  journey with our platform. Get started today and experience
                  healthcare the way it should be.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Link href="/sign-up">Sign Up Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-emerald-700/30 hover:bg-muted/80"
                  >
                    <Link href="#pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>

              {/* Decorative healthcare elements */}
              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-800/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-700/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}