"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  ArrowRight,
  Stethoscope,
  User,
  Star,
  Video,
  Calendar,
  Shield,
  Award,
  Activity,
  Sparkles,
} from "lucide-react";

// Animated paw print positions
const pawPositions = [
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
  { left: "75%", top: "45%" },
];

// Floating medical icons
const floatingIcons = [
  { Icon: Heart, color: "text-red-400/20", delay: 0, position: "top-20 left-1/4" },
  { Icon: Stethoscope, color: "text-emerald-400/20", delay: 2, position: "top-40 right-1/4" },
  { Icon: Shield, color: "text-blue-400/20", delay: 4, position: "bottom-40 left-1/3" },
  { Icon: Sparkles, color: "text-amber-400/20", delay: 1, position: "top-1/2 right-1/4" },
  { Icon: Activity, color: "text-purple-400/20", delay: 3, position: "bottom-20 right-1/3" },
];

// Service cards for hero visual
const serviceCards = [
  { icon: Video, title: "Video Calls", desc: "HD Quality", position: "top-8 left-8", color: "blue", delay: 0 },
  { icon: Calendar, title: "24/7 Booking", desc: "Instant Access", position: "top-8 right-8", color: "purple", delay: 0.2 },
  { icon: Shield, title: "Pet Insurance", desc: "Full Coverage", position: "bottom-8 left-8", color: "green", delay: 0.4 },
  { icon: Award, title: "Expert Vets", desc: "Certified Pros", position: "bottom-8 right-8", color: "amber", delay: 0.6 },
];

// Floating pet emojis
const floatingPets = [
  { emoji: "🐶", left: "20%", top: "30%", x: [0, 5, 0] },
  { emoji: "🐱", left: "35%", top: "60%", x: [0, -8, 0] },
  { emoji: "🐰", left: "50%", top: "30%", x: [0, 6, 0] },
  { emoji: "🐦", left: "65%", top: "60%", x: [0, -5, 0] },
  { emoji: "🐹", left: "80%", top: "30%", x: [0, 7, 0] },
];

// Trust indicators
const trustIndicators = [
  { icon: User, label: "50K+ Pet Parents", color: "emerald" },
  { icon: Stethoscope, label: "500+ Vets", color: "blue" },
  { icon: Star, label: "4.9★ Rating", color: "amber" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden flex items-center py-8 md:py-12 lg:min-h-[calc(100vh-5rem)]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />

        {/* Animated Paw Prints */}
        {pawPositions.map((position, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.15, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{ left: position.left, top: position.top }}
          >
            <div className="text-4xl text-emerald-400/30">🐾</div>
          </motion.div>
        ))}

        {/* Floating Medical Icons */}
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
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
              Your Pet&apos;s Health,{" "}
              <span className="relative inline-block">
                <span className="gradient-title bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Our Mission
                </span>
                <motion.div
                  animate={{ scaleX: [0, 1] }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-emerald-500/20 -z-10"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-description text-muted-foreground text-xl md:text-2xl max-w-xl leading-relaxed"
            >
              Connect with certified veterinarians 24/7. Book appointments, get instant consultations, and ensure your furry friends receive the best care possible.
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
                className="bg-linear-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-2xl shadow-emerald-500/30 relative overflow-hidden group px-8 py-6 text-lg"
              >
                <Link href="/onboarding">
                  <span className="relative z-10 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Start Your Journey
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              {trustIndicators.map((item, i) => (
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
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden backdrop-blur-xl bg-linear-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
              {/* Animated Grid Background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              >
                <motion.div
                  animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full"
                />
              </div>

              {/* Floating Service Cards */}
              <div className="absolute inset-0 p-8">
                {serviceCards.map((service, i) => (
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
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative">
                    <div className="w-32 h-32 bg-linear-to-br from-emerald-500/30 to-teal-500/30 rounded-full flex items-center justify-center backdrop-blur-xl border-4 border-emerald-500/40 shadow-2xl">
                      <Heart className="h-16 w-16 text-emerald-400 animate-pulse" />
                    </div>
                    {/* Pulsing Rings */}
                    <motion.div
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-4 border-emerald-400/40 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="absolute inset-0 border-4 border-teal-400/40 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Floating Pet Icons */}
                {floatingPets.map((pet, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360],
                      x: pet.x,
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                    className="absolute text-4xl"
                    style={{ left: pet.left, top: pet.top }}
                  >
                    {pet.emoji}
                  </motion.div>
                ))}
              </div>

              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: [-1000, 1000] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 w-1/3 h-full bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </div>

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/20 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
