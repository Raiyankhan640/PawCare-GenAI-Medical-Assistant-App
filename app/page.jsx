"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  TrendingUp,
  Phone,
  AlertCircle,
  Pill,
  Syringe,
  HeartPulse,
  PawPrint,
  BriefcaseMedical,
  ClipboardCheck,
  Users,
  DollarSign,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { creditBenefits } from "@/lib/data";
import { preloadRoutes, getAnimationConfig } from "@/lib/performance";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

// Lazy load heavy components
const Pricing = dynamic(() => import("@/components/pricing"), {
  loading: () => <div className="h-96 flex items-center justify-center text-muted-foreground">Loading pricing...</div>,
  ssr: false
});

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
    
    // Preload critical routes for faster navigation
    preloadRoutes();
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

      {/* Pet Health Statistics - Interactive Counter Section */}
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
              Join our growing community of pet lovers and veterinary professionals
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <PawPrint className="h-8 w-8" />, number: "50K+", label: "Happy Pets", color: "emerald" },
              { icon: <Users className="h-8 w-8" />, number: "25K+", label: "Pet Parents", color: "teal" },
              { icon: <Stethoscope className="h-8 w-8" />, number: "500+", label: "Verified Vets", color: "cyan" },
              { icon: <Award className="h-8 w-8" />, number: "98%", label: "Satisfaction Rate", color: "emerald" }
            ].map((stat, index) => (
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
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform`}
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

      {/* Emergency Care - 24/7 Support Section */}
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
                {[
                  { icon: <Phone className="h-5 w-5" />, text: "Instant vet consultation via call or video" },
                  { icon: <HeartPulse className="h-5 w-5" />, text: "Real-time health monitoring and alerts" },
                  { icon: <BriefcaseMedical className="h-5 w-5" />, text: "Emergency clinic locator near you" }
                ].map((item, idx) => (
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
              <Card className="p-8 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-900/30 backdrop-blur-sm relative overflow-hidden">
                {/* Animated pulse effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
                />
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 flex items-center justify-center text-red-400 shadow-2xl shadow-red-500/20"
                    >
                      <Heart className="h-12 w-12" fill="currentColor" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Always Here For You</h3>
                    <p className="text-emerald-400 font-semibold">Response Time: &lt; 2 Minutes</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Emergency Triage Assessment",
                      "Video Consultation Available",
                      "Prescription Services",
                      "Follow-up Care Included"
                    ].map((feature, idx) => (
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

      {/* Pet Care Services Comparison */}
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
              <div className="hidden md:block"></div>
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
              {[
                { feature: "Appointment Wait Time", traditional: "1-2 Weeks", pawcare: "Same Day" },
                { feature: "Consultation Fee", traditional: "$100-200", pawcare: "From $25" },
                { feature: "24/7 Support", traditional: "Limited", pawcare: "Always Available" },
                { feature: "Medical Records", traditional: "Paper Based", pawcare: "Digital & Secure" },
                { feature: "Follow-up Care", traditional: "Extra Visit Required", pawcare: "Included Free" },
                { feature: "Second Opinion", traditional: "Not Available", pawcare: "Instant Access" }
              ].map((row, idx) => (
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

      {/* Pet Health Tips Section */}
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
            {[
              {
                icon: <Pill className="h-8 w-8" />,
                title: "Vaccination Schedule",
                description: "Keep your pet's vaccinations up to date. Core vaccines protect against serious diseases.",
                tips: ["Puppy/Kitten: 6-8 weeks", "Booster shots: Annual", "Rabies: Every 1-3 years"]
              },
              {
                icon: <Syringe className="h-8 w-8" />,
                title: "Preventive Care",
                description: "Regular check-ups can detect health issues early. Prevention is better than cure.",
                tips: ["Dental check: 6 months", "Blood work: Annually", "Parasite control: Monthly"]
              },
              {
                icon: <Activity className="h-8 w-8" />,
                title: "Exercise & Nutrition",
                description: "Balanced diet and regular exercise are key to your pet's wellbeing and longevity.",
                tips: ["Daily walks: 30-60 min", "Quality food: Age-appropriate", "Fresh water: Always available"]
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Mental Health",
                description: "Pets need mental stimulation and social interaction to stay happy and healthy.",
                tips: ["Interactive toys", "Social playtime", "Training sessions"]
              },
              {
                icon: <ClipboardCheck className="h-8 w-8" />,
                title: "Warning Signs",
                description: "Know the signs that indicate your pet needs immediate veterinary attention.",
                tips: ["Loss of appetite", "Lethargy", "Vomiting/Diarrhea"]
              },
              {
                icon: <ShieldCheck className="h-8 w-8" />,
                title: "Pet Safety",
                description: "Create a safe environment for your pet at home and during outdoor activities.",
                tips: ["Pet-proof home", "ID tags & microchip", "Supervised outdoor time"]
              }
            ].map((tip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-emerald-900/20 hover:border-emerald-700/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 group">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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