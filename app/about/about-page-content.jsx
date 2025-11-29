"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Clock, Award, Users, Stethoscope, Sparkles, PawPrint } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Animated Counter Component
const AnimatedCounter = ({ number, label }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
        {inView ? number : "0"}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
};

// Floating Grid Background Component
const FloatingGridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-emerald-400 rounded-full"
          style={{
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Animated Value Card Component
const AnimatedValueCard = ({ icon, title, description, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-card border-emerald-900/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 group h-full">
        <CardHeader>
          <motion.div
            className="bg-emerald-900/20 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-400/20 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {icon}
          </motion.div>
          <CardTitle className="text-xl font-semibold text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function AboutPageContent() {
  const values = [
    {
      icon: <Heart className="h-6 w-6 text-emerald-400" />,
      title: "Compassionate Care",
      description: "We prioritize the wellbeing of every pet with empathy and understanding.",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-400" />,
      title: "Trusted Professionals",
      description: "All our veterinarians are verified and highly qualified experts.",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-400" />,
      title: "24/7 Availability",
      description: "Access veterinary care whenever your pet needs it, day or night.",
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-400" />,
      title: "Quality Service",
      description: "We maintain the highest standards in veterinary telemedicine.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Pet Owners" },
    { number: "500+", label: "Verified Veterinarians" },
    { number: "50,000+", label: "Consultations" },
    { number: "4.9/5", label: "Average Rating" },
  ];

  const features = [
    { icon: "🚀", text: "Instant Consultations" },
    { icon: "💊", text: "Digital Prescriptions" },
    { icon: "📱", text: "Mobile First" },
    { icon: "🔒", text: "Secure & Private" },
    { icon: "🌟", text: "5-Star Rated" },
    { icon: "⚡", text: "Quick Responses" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <FloatingGridBackground />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block mb-6"
            >
              <Badge
                variant="outline"
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                About PawCare
              </Badge>
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Making Pet Healthcare{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Accessible to All
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground text-lg md:text-xl leading-relaxed"
            >
              PawCare is revolutionizing veterinary care by connecting pet owners with 
              qualified veterinarians through our secure telemedicine platform. We believe 
              every pet deserves quality healthcare, anytime, anywhere.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={index}
                number={stat.number}
                label={stat.label}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge
                variant="outline"
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Transforming Veterinary Care Through Technology
              </h2>
              <p className="text-muted-foreground mb-4 text-lg">
                Founded with a passion for animal welfare, PawCare bridges the gap between 
                pet owners and veterinary professionals. We understand that pets are family, 
                and accessing quality care shouldn't be complicated or time-consuming.
              </p>
              <p className="text-muted-foreground mb-4 text-lg">
                Our platform provides instant access to licensed veterinarians who can 
                diagnose, prescribe, and guide you through your pet's health journey—all 
                from the comfort of your home.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Animated Feature Grid */}
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-emerald-900/20 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-800/30 hover:border-emerald-400/50 transition-all duration-300"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="text-white font-medium text-sm">{feature.text}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 bg-emerald-400/20 p-3 rounded-full backdrop-blur-sm"
              >
                <PawPrint className="h-6 w-6 text-emerald-400" />
              </motion.div>
              
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 bg-cyan-400/20 p-3 rounded-full backdrop-blur-sm"
              >
                <Stethoscope className="h-6 w-6 text-cyan-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at PawCare
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <AnimatedValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
            >
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built by Pet Lovers, For Pet Lovers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our diverse team combines veterinary expertise, technology innovation, 
              and a shared love for animals to create the best pet healthcare platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-emerald-900/20 to-emerald-950/10 border-emerald-800/20 backdrop-blur-sm hover:border-emerald-700/40 transition-all duration-300">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-1">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <Users className="h-12 w-12 text-emerald-400" />
                      </div>
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Join Our Growing Community
                    </h3>
                    <p className="text-muted-foreground mb-4 text-lg">
                      We're constantly growing our network of veterinary professionals 
                      and pet care experts. If you're passionate about animal welfare 
                      and want to be part of the future of veterinary care, we'd love 
                      to hear from you.
                    </p>
                    <motion.a
                      href="/contact"
                      className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-2"
                      whileHover={{ x: 5 }}
                    >
                      Get in touch <span>→</span>
                    </motion.a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/20 border-emerald-800/20 backdrop-blur-sm relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-emerald-400/10 rounded-full"
                    style={{
                      width: Math.random() * 100 + 50,
                      height: Math.random() * 100 + 50,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              <CardContent className="p-8 md:p-12 text-center relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Stethoscope className="h-12 w-12 text-emerald-400 mx-auto" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Experience Better Pet Care?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of pet owners who trust PawCare for their veterinary needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/sign-up"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700 px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Today
                  </motion.a>
                  <motion.a
                    href="/doctors"
                    className="inline-flex items-center justify-center border border-emerald-700/30 hover:bg-white/5 px-8 py-4 rounded-lg font-medium transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Find a Vet
                  </motion.a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}