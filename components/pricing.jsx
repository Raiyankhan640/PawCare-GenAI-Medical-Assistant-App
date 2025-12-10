"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PricingTable } from "@clerk/nextjs";
import { Badge } from "./ui/badge";
import { Sparkles, Shield, Zap, Check, HelpCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
  const pricingRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      gsap.set(".pricing-container", { opacity: 1 });

      gsap.from(".pricing-container", {
        scrollTrigger: {
          trigger: pricingRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
      });
    }, pricingRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div ref={pricingRef} className="w-full">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-400 text-sm font-medium mb-4 animate-fade-in">
          <Sparkles className="w-4 h-4 mr-1.5" />
          Affordable Pet Care Plans
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text mb-4 animate-gradient">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
          Get instant access to professional veterinary care for your beloved pets.
          Credits never expire, and you can cancel anytime.
        </p>
      </div>

      {/* Features Banner Above Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 pricing-container px-4" style={{ opacity: 1, visibility: 'visible' }}>
        <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Credits Never Expire</h3>
            <p className="text-sm text-muted-foreground">Use your credits whenever you need them, no time limits</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Secure Payments</h3>
            <p className="text-sm text-muted-foreground">Bank-grade encryption for all transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-900/30 backdrop-blur-sm hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Instant Access</h3>
            <p className="text-sm text-muted-foreground">Start booking immediately after purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Clerk Pricing Table with Enhanced Design */}
      <Card className="pricing-container border-emerald-900/20 shadow-2xl shadow-emerald-500/10 bg-gradient-to-b from-emerald-950/40 to-emerald-900/20 backdrop-blur-sm relative overflow-hidden" style={{ opacity: 1, visibility: 'visible' }}>
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -mr-48 -mb-48"></div>

        <CardHeader className="relative z-10 border-b border-emerald-900/30 pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 shadow-sm">
              💎 Best Value
            </Badge>
            <Badge variant="outline" className="bg-emerald-900/30 border-emerald-700/30 text-emerald-400 shadow-sm">
              🎉 Special Offer
            </Badge>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-center text-white">
            Choose Your Perfect Plan
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Flexible packages for every need • Cancel anytime
          </p>
        </CardHeader>

        <CardContent className="p-8 md:p-12 relative z-10">
          {/* Clerk Pricing Table with enhanced styling */}
          <div className="clerk-pricing-wrapper [&_button]:!bg-gradient-to-r [&_button]:!from-emerald-600 [&_button]:!to-emerald-500 [&_button]:!shadow-lg [&_button]:!shadow-emerald-500/25 [&_button:hover]:!from-emerald-700 [&_button:hover]:!to-emerald-600 [&_button]:!transition-all [&_button]:!duration-300 [&_button:hover]:!scale-105 [&_[role='radiogroup']>div]:!border-emerald-900/30 [&_[role='radiogroup']>div:hover]:!border-emerald-700/50 [&_[role='radiogroup']>div]:!bg-card/50 [&_[role='radiogroup']>div]:!backdrop-blur-sm [&_[role='radiogroup']>div]:!transition-all [&_[role='radiogroup']>div]:!duration-300 [&_[role='radiogroup']>div:hover]:!shadow-lg [&_[role='radiogroup']>div:hover]:!shadow-emerald-500/20">
            <PricingTable
              checkoutProps={{
                appearance: {
                  elements: {
                    drawerRoot: {
                      zIndex: 2000,
                    },
                    // Enhanced button styling
                    formButtonPrimary: {
                      background: 'linear-gradient(to right, #10b981, #14b8a6)',
                      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.25)',
                      transition: 'all 0.3s ease',
                    },
                    // Card styling
                    card: {
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>

        {/* Trust Banner at Bottom */}
        <div className="relative z-10 border-t border-emerald-900/30 bg-emerald-950/30 backdrop-blur-sm">
          <div className="p-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </Card>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Frequently Asked Questions</h3>
          <p className="text-muted-foreground">Everything you need to know about our pricing</p>
        </div>

        <div className="space-y-4">
          <Card className="bg-card/80 border-emerald-900/20 backdrop-blur-sm hover:border-emerald-700/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Do credits expire?</h4>
                  <p className="text-sm text-muted-foreground">No! Your credits never expire. Use them whenever you need veterinary consultations.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-emerald-900/20 backdrop-blur-sm hover:border-emerald-700/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Can I get a refund?</h4>
                  <p className="text-sm text-muted-foreground">Yes! We offer a 7-day money-back guarantee if you're not satisfied with our service.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-emerald-900/20 backdrop-blur-sm hover:border-emerald-700/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">How do I book appointments?</h4>
                  <p className="text-sm text-muted-foreground">Simply browse our verified veterinarians, select your preferred one, choose a time slot, and use your credits to book instantly.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-emerald-900/20 backdrop-blur-sm hover:border-emerald-700/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Can I cancel my subscription?</h4>
                  <p className="text-sm text-muted-foreground">Absolutely! You can cancel anytime with no hidden fees. Your remaining credits stay active.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-16 max-w-4xl mx-auto px-4 pb-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">What Our Users Say</h3>
          <p className="text-muted-foreground">Join thousands of happy pet owners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-900/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400">S</div>
                <div>
                  <p className="font-semibold text-white">Saima Akhter</p>
                  <p className="text-xs text-muted-foreground">Dhaka</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"PawCare saved my cat's life! The instant booking and professional vets are amazing. Highly recommended!"</p>
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, i) => (<span key={i} className="text-yellow-400">⭐</span>))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-900/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400">F</div>
                <div>
                  <p className="font-semibold text-white">Farhan Karim</p>
                  <p className="text-xs text-muted-foreground">Chittagong</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"Best pet healthcare platform in Bangladesh! Credits system is very convenient. No more waiting!"</p>
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, i) => (<span key={i} className="text-yellow-400">⭐</span>))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;