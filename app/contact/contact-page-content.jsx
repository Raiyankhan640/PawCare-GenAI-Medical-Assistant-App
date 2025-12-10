"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  Headset,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const FloatingGridBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setMounted(true);
    setItems(
      [...Array(18)].map(() => ({
        width: Math.random() * 60 + 20,
        height: Math.random() * 60 + 20,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden opacity-10" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="absolute bg-emerald-400 rounded-full"
          style={{
            width: item.width,
            height: item.height,
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
          }}
        />
      ))}
    </div>
  );
};

const ContactInfoCard = ({ icon, title, details, description }) => (
  <motion.div variants={fadeInUp}>
    <Card className="bg-card/80 border border-emerald-900/30 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300">
      <CardHeader>
        <div className="bg-emerald-900/30 p-3 rounded-lg w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="text-lg font-semibold text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white font-medium mb-1">{details}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const FAQCard = ({ question, answer }) => (
  <motion.div variants={fadeInUp}>
    <Card className="bg-card/80 border border-emerald-900/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground ml-8">{answer}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const MotionCard = motion(Card);

export default function ContactPageContent() {
  const [ctaMounted, setCtaMounted] = useState(false);
  const [ctaParticles, setCtaParticles] = useState([]);

  useEffect(() => {
    setCtaMounted(true);
    setCtaParticles(
      [...Array(3)].map(() => ({
        width: Math.random() * 100 + 60,
        height: Math.random() * 100 + 60,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-emerald-400" />,
      title: "Email Us",
      details: "support@pawcare.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: <Phone className="h-6 w-6 text-emerald-400" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri: 9:00 AM - 8:00 PM EST",
    },
    {
      icon: <MapPin className="h-6 w-6 text-emerald-400" />,
      title: "Visit Us",
      details: "123 Pet Care Lane, Suite 100",
      description: "New York, NY 10001",
    },
    {
      icon: <Clock className="h-6 w-6 text-emerald-400" />,
      title: "Business Hours",
      details: "Monday - Saturday",
      description: "9:00 AM - 8:00 PM EST",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I get a consultation?",
      answer:
        "Most consultations are available within 15-30 minutes during business hours. Emergency consultations are prioritized.",
    },
    {
      question: "Are your veterinarians licensed?",
      answer:
        "Yes, all veterinarians on PawCare are fully licensed and verified professionals with years of experience.",
    },
    {
      question: "What types of pets do you support?",
      answer:
        "We support all common pets including dogs, cats, birds, and small exotic animals. Our veterinarians specialize in various animal types.",
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-950 via-emerald-950/80 to-gray-900 text-white">
      <div className="absolute inset-0">
        <FloatingGridBackground />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="inline-block mb-6">
                <Badge
                  variant="outline"
                  className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get In Touch
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-5"
              >
                We're Here to
                <span className="ml-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Help You
                </span>
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-muted-foreground text-lg"
              >
                Have questions about PawCare? Need technical support? Want to join our veterinary network? We'd love to
                hear from you!
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {contactInfo.map((info) => (
                <ContactInfoCard key={info.title} {...info} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form & FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="mb-8">
                  <Badge
                    variant="outline"
                    className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
                  >
                    Send us a message
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Drop Us a Line</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <MotionCard className="bg-card/80 border border-emerald-900/30 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">First Name *</label>
                          <Input placeholder="John" className="bg-background/80 border-emerald-900/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">Last Name *</label>
                          <Input placeholder="Doe" className="bg-background/80 border-emerald-900/30" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Email *</label>
                        <Input type="email" placeholder="john.doe@example.com" className="bg-background/80 border-emerald-900/30" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Phone Number</label>
                        <Input type="tel" placeholder="+1 (555) 000-0000" className="bg-background/80 border-emerald-900/30" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Subject *</label>
                        <Input placeholder="How can we help?" className="bg-background/80 border-emerald-900/30" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Message *</label>
                        <Textarea
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          className="bg-background/80 border-emerald-900/30 resize-none"
                        />
                      </div>

                      <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By submitting this form, you agree to our {""}
                        <a href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                          Privacy Policy
                        </a>
                      </p>
                    </form>
                  </CardContent>
                </MotionCard>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-4"
              >
                <motion.div variants={fadeInUp} className="mb-8">
                  <Badge
                    variant="outline"
                    className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 text-emerald-400 text-sm font-medium mb-4"
                  >
                    FAQs
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">
                    Quick answers to common questions about PawCare.
                  </p>
                </motion.div>

                {faqs.map((faq) => (
                  <FAQCard key={faq.question} {...faq} />
                ))}

                <motion.div variants={fadeInUp}>
                  <Card className="mt-6 bg-gradient-to-r from-emerald-900/25 to-emerald-950/10 border-emerald-800/30 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
                      <p className="text-muted-foreground mb-4">
                        Check out our comprehensive help center or chat with our support team.
                      </p>
                      <Button variant="outline" className="border-emerald-700/40 hover:bg-white/5">
                        Visit Help Center
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Support CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/20 border-emerald-800/30 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0">
                  {ctaMounted && ctaParticles.map((item, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-emerald-400/15 rounded-full"
                      style={{
                        width: item.width,
                        height: item.height,
                        left: item.left,
                        top: item.top,
                      }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.25, 0.55, 0.25],
                      }}
                      transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        delay: item.delay,
                      }}
                    />
                  ))}
                </div>

                <CardContent className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-0.5">
                      <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center">
                        <Headset className="h-10 w-10 text-emerald-100" />
                      </div>
                    </div>
                  </motion.div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3">Need dedicated support?</h3>
                    <p className="text-muted-foreground mb-4 max-w-2xl">
                      Our customer success team is ready to help with onboarding, technical issues, or partnership inquiries.
                      Reach out and we will tailor the support you need.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <a href="mailto:support@pawcare.com">Email Support</a>
                      </Button>
                      <Button asChild variant="outline" className="border-emerald-700/40 hover:bg-white/5">
                        <a href="tel:+15551234567">Call the team</a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="bg-gradient-to-r from-red-900/20 to-red-950/10 border-red-800/30 backdrop-blur-sm">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center">
                        <Phone className="h-10 w-10 text-red-400" />
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-white mb-2">Pet Emergency?</h3>
                      <p className="text-muted-foreground mb-4">
                        For urgent veterinary emergencies, please call our emergency hotline or visit your nearest emergency animal hospital.
                      </p>
                      <a href="tel:+15551234567" className="text-red-400 hover:text-red-300 font-bold text-xl">
                        Emergency Hotline: +1 (555) 911-PETS
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
