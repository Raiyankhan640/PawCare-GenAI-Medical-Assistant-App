"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Stethoscope,
  Calendar,
  Video,
  CreditCard,
  User,
  FileText,
  ShieldCheck,
  Heart,
  Sparkles,
  Shield,
  Clock,
  Star,
  Activity,
  Zap,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Pricing from "@/components/pricing";
import { creditBenefits } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

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
      {/* Enhanced Hero Section with Pet Care Theme */}
      <section className="relative overflow-hidden flex items-center py-8 md:py-12 lg:min-h-[calc(100vh-5rem)]">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          ></motion.div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
              x: [0, -50, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl"
          ></motion.div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, -40, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
          ></motion.div>

          {/* Animated Paw Prints */}
          {[
            { left: "10%", top: "15%" },
            { left: "25%", top: "8%" },
            { left: "45%", top: "12%" },
            { left: "65%", top: "18%" },
            { left: "82%", top: "10%" },
            { left: "15%", top: "85%" },
            { left: "30%", top: "75%" },
            { left: "50%", top: "88%" },
            { left: "70%", top: "80%" },
            { left: "88%", top: "90%" },
            { left: "20%", top: "50%" },
            { left: "75%", top: "45%" }
          ].map((position, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.15, 0],
                scale: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeInOut"
              }}
              className="absolute"
              style={{
                left: position.left,
                top: position.top,
              }}
            >
              <div className="text-4xl text-emerald-400/30">🐾</div>
            </motion.div>
          ))}

          {/* Floating Medical Icons */}
          {[
            { Icon: Heart, color: "text-red-400/20", delay: 0, position: "top-20 left-1/4" },
            { Icon: Stethoscope, color: "text-emerald-400/20", delay: 2, position: "top-40 right-1/4" },
            { Icon: Shield, color: "text-blue-400/20", delay: 4, position: "bottom-40 left-1/3" },
            { Icon: Sparkles, color: "text-amber-400/20", delay: 1, position: "top-1/2 right-1/4" },
            { Icon: Activity, color: "text-purple-400/20", delay: 3, position: "bottom-20 right-1/3" }
          ].map((item, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut"
              }}
              className={`absolute ${item.position} hidden lg:block`}
            >
              <item.Icon className={`h-12 w-12 ${item.color}`} />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  variant="outline"
                  className="hero-badge bg-emerald-900/30 border-emerald-700/30 px-5 py-2.5 text-emerald-400 text-sm font-medium backdrop-blur-sm shadow-lg inline-flex items-center gap-2"
                >
                  <Heart className="h-4 w-4 animate-pulse" />
                  🐾 Trusted Pet Healthcare Platform
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Your Pet's Health,{" "}
                <span className="relative inline-block">
                  <span className="gradient-title bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                    Our Mission
                  </span>
                  <motion.div
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="absolute bottom-2 left-0 right-0 h-3 bg-emerald-500/20 -z-10"
                  ></motion.div>
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hero-description text-muted-foreground text-xl md:text-2xl max-w-xl leading-relaxed"
              >
                Connect with certified veterinarians 24/7. Book appointments, get instant consultations, 
                and ensure your furry friends receive the best care possible.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="hero-buttons flex flex-col sm:flex-row gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-2xl shadow-emerald-500/30 relative overflow-hidden group px-8 py-6 text-lg"
                >
                  <Link href="/onboarding">
                    <span className="relative z-10 flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Start Your Journey
                    </span>
                    <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-emerald-700/50 hover:bg-emerald-900/30 backdrop-blur-sm px-8 py-6 text-lg group"
                >
                  <Link href="/doctors" className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Find Veterinarians
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-wrap items-center gap-6 pt-4"
              >
                {[
                  { icon: User, label: "50K+ Pet Parents", color: "emerald" },
                  { icon: Stethoscope, label: "500+ Vets", color: "blue" },
                  { icon: Star, label: "4.9★ Rating", color: "amber" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-900/20"
                  >
                    <div className={`p-2 bg-${item.color}-900/30 rounded-full`}>
                      <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                    </div>
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Side - Animated Pet Care Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              {/* Main Card with Glassmorphism */}
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
                {/* Animated Grid Background */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}>
                  <motion.div
                    animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full"
                  ></motion.div>
                </div>

                {/* Floating Service Cards */}
                <div className="absolute inset-0 p-8">
                  {[
                    { icon: Video, title: "Video Calls", desc: "HD Quality", position: "top-8 left-8", color: "blue", delay: 0 },
                    { icon: Calendar, title: "24/7 Booking", desc: "Instant Access", position: "top-8 right-8", color: "purple", delay: 0.2 },
                    { icon: Shield, title: "Pet Insurance", desc: "Full Coverage", position: "bottom-8 left-8", color: "green", delay: 0.4 },
                    { icon: Award, title: "Expert Vets", desc: "Certified Pros", position: "bottom-8 right-8", color: "amber", delay: 0.6 }
                  ].map((service, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1 + service.delay }}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={`absolute ${service.position} bg-card/80 backdrop-blur-xl p-4 rounded-2xl border border-${service.color}-500/30 shadow-xl hover:shadow-${service.color}-500/30 transition-all cursor-pointer`}
                    >
                      <div className={`p-3 bg-${service.color}-500/20 rounded-xl mb-3 w-fit`}>
                        <service.icon className={`h-6 w-6 text-${service.color}-400`} />
                      </div>
                      <h3 className="font-bold text-white text-sm mb-1">{service.title}</h3>
                      <p className="text-xs text-muted-foreground">{service.desc}</p>
                    </motion.div>
                  ))}

                  {/* Center Animated Element */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full flex items-center justify-center backdrop-blur-xl border-4 border-emerald-500/40 shadow-2xl">
                        <Heart className="h-16 w-16 text-emerald-400 animate-pulse" />
                      </div>
                      {/* Pulsing Rings */}
                      <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-4 border-emerald-400/40 rounded-full"
                      ></motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 border-4 border-teal-400/40 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>

                  {/* Floating Pet Icons */}
                  {[
                    { emoji: '🐶', left: '20%', top: '30%', x: [0, 5, 0] },
                    { emoji: '🐱', left: '35%', top: '60%', x: [0, -8, 0] },
                    { emoji: '🐰', left: '50%', top: '30%', x: [0, 6, 0] },
                    { emoji: '🐦', left: '65%', top: '60%', x: [0, -5, 0] },
                    { emoji: '🐹', left: '80%', top: '30%', x: [0, 7, 0] }
                  ].map((pet, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                        x: pet.x
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                      className="absolute text-4xl"
                      style={{
                        left: pet.left,
                        top: pet.top
                      }}
                    >
                      {pet.emoji}
                    </motion.div>
                  ))}
                </div>

                {/* Shimmer Effect */}
                <motion.div
                  animate={{ x: [-1000, 1000] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                ></motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"
              ></motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/20 rounded-full blur-xl"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/30" ref={featuresRef}>
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
      <section id="pricing" className="py-12 md:py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10"
            >
              💎 Affordable Healthcare Plans
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text">
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
            <Card className="mt-16 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-900/30 backdrop-blur-sm shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
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
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-card/30 border border-emerald-900/20 hover:border-emerald-800/40 transition-all duration-300 hover:scale-[1.02] group">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                            ></path>
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

      {/* Testimonials with green medical accents */}
      <section className="py-12 md:py-16 bg-muted/30" ref={testimonialsRef}>
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
      <section className="py-12 md:py-16">
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