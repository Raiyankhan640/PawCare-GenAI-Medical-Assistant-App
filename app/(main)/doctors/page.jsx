"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { SPECIALTIES } from "@/lib/specialities";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  TrendingUp,
  Heart,
  Star,
  CheckCircle2,
  Loader2
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DoctorsPage() {
  const [doctorCounts, setDoctorCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Fetch doctor counts from API
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/doctor-counts');
        const data = await response.json();
        setDoctorCounts(data);
      } catch (error) {
        console.error('Error fetching doctor counts:', error);
        setDoctorCounts({});
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCounts();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".header-content", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out"
      });

      // Specialty cards staggered animation
      gsap.from(".specialty-card", {
        scrollTrigger: {
          trigger: ".specialty-grid",
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out"
      });

      // CTA animation
      gsap.from(".cta-section", {
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading]);

  // Calculate total doctors
  const totalDoctors = Object.values(doctorCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-background min-h-screen relative overflow-hidden" ref={containerRef}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
        />
        
        {/* Floating medical icons */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute text-4xl"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + (i % 3) * 30}%`
            }}
          >
            {['💊', '🩺', '💉', '❤️', '⚕️'][i]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 header-content" ref={headerRef}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
          >
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-600/40 px-6 py-2 text-emerald-400 text-sm font-medium mb-6 shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="h-4 w-4 mr-2 inline animate-pulse" />
              Find Expert Care
            </Badge>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Browse{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Veterinarians
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Connect with certified veterinary professionals specialized in various fields of pet healthcare
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {[
              { icon: <Users className="h-5 w-5" />, label: "Verified Vets", value: isLoading ? "..." : `${totalDoctors}+` },
              { icon: <Star className="h-5 w-5" />, label: "Avg Rating", value: "4.9" },
              { icon: <Heart className="h-5 w-5" />, label: "Happy Pets", value: "50K+" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-3 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm px-6 py-3 rounded-xl border border-emerald-900/30 shadow-lg"
              >
                <div className="text-emerald-400">{stat.icon}</div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/doctors/all">
              <button className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2">
                  View All Veterinarians
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-xl"></div>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading specialties...</p>
            </div>
          </div>
        )}

        {/* Enhanced Specialties Grid */}
        {!isLoading && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Browse by <span className="text-emerald-400">Specialty</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Select a specialty to find qualified veterinarians
              </p>
            </div>

            <div className="specialty-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
              {SPECIALTIES.map((specialty, index) => {
                const count = doctorCounts[specialty.name] || 0;
                
                return (
                  <Link
                    key={specialty.name}
                    href={`/doctors/${encodeURIComponent(specialty.name)}`}
                    className="specialty-card"
                  >
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="bg-gradient-to-br from-emerald-950/50 via-card/60 to-teal-950/50 backdrop-blur-xl border-2 border-emerald-900/30 hover:border-emerald-500/60 transition-all cursor-pointer group h-full relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30">
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-teal-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>

                        {/* Glowing border effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl"></div>
                        </div>

                        <CardHeader className="relative z-10 pb-3">
                          <motion.div 
                            className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl border border-emerald-700/30 group-hover:border-emerald-500/50 backdrop-blur-sm"
                            whileHover={{ rotate: 12 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div className="text-emerald-400 scale-125">
                              {specialty.icon}
                            </div>
                          </motion.div>
                          
                          <CardTitle className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {specialty.name}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="relative z-10 pt-0">
                          <div className="flex items-center justify-between mb-4">
                            {count > 0 ? (
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-emerald-500/30 blur-lg rounded-full"></div>
                                  <div className="relative bg-gradient-to-br from-emerald-600/30 to-teal-600/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-500/40 shadow-lg">
                                    <span className="text-3xl font-bold text-emerald-400">
                                      {count}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <span className="text-sm text-emerald-300 font-medium block">
                                    {count === 1 ? "vet" : "vets"}
                                  </span>
                                  <span className="text-xs text-muted-foreground">available</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/60 text-sm italic bg-card/30 px-3 py-1 rounded-lg border border-muted/20">
                                Coming soon
                              </span>
                            )}
                            
                            {count > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-emerald-500/30 p-2 rounded-full backdrop-blur-sm border border-emerald-500/50 shadow-lg"
                              >
                                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                              </motion.div>
                            )}
                          </div>

                          {/* Progress bar */}
                          {count > 0 && (
                            <div className="mt-4 h-2 bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-900/30 shadow-inner">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 shadow-lg shadow-emerald-500/50"
                              />
                            </div>
                          )}

                          {/* Hover info */}
                          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs text-emerald-300 flex items-center gap-2">
                              <ArrowRight className="h-3 w-3" />
                              Click to view specialists
                            </p>
                          </div>
                        </CardContent>

                        {/* Corner decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-br-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-3xl"></div>
                      </Card>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cta-section"
        >
          <Card className="bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-emerald-950/30 border-2 border-emerald-700/30 max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 animate-pulse"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>

            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block mb-6"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-emerald-500/30">
                    <TrendingUp className="h-10 w-10 text-emerald-400" />
                  </div>
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Are you a veterinarian?
                </h3>
                
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join our network of verified professionals and help pet owners provide the best care for their beloved animals.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/onboarding">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Join as a Veterinarian
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.button>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Free to join • Verified professionals</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}