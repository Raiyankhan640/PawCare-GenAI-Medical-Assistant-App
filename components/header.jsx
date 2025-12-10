"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";
import {
  Stethoscope,
  Calendar,
  User,
  CreditCard,
  Home,
  Phone,
  Info,
  MessageCircle,
  Crown,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { user: clerkUser, isLoaded } = useUser();
  const [userCredits, setUserCredits] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (clerkUser && isLoaded) {
      console.log("[Header] Fetching credits for user:", clerkUser.id);
      
      const fetchCredits = async (retryCount = 0) => {
        try {
          // Pass clerkUserId as query param as fallback for clock skew issues
          const res = await fetch(`/api/user/credits?clerkUserId=${clerkUser.id}`, {
            cache: "no-store",
          });
          const data = await res.json();
          console.log("[Header] Got credits data:", data);
          
          if (data.error && data.error !== "not_authenticated" && data.error !== "user_not_found") {
            console.error("[Header] API error:", data.error);
          }
          
          setUserCredits(data.credits || 0);
          setUserRole(data.role);
        } catch (err) {
          console.error("[Header] Error fetching credits:", err);
          if (retryCount < 2) {
            setTimeout(() => fetchCredits(retryCount + 1), 300);
          }
        }
      };
      
      fetchCredits();
    }
  }, [clerkUser, isLoaded, pathname]);

  const isActive = (path) => {
    if (!mounted) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const getNavLinkClass = (path) => {
    const base = "group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2";
    const active = "text-emerald-400 bg-emerald-950/30 border border-emerald-500/30";
    const inactive = "text-muted-foreground hover:text-emerald-400";
    return `${base} ${isActive(path) ? active : inactive}`;
  };

  // Use both Clerk metadata and database role for admin detection
  const isAdmin = clerkUser?.publicMetadata?.role === "ADMIN" || userRole === "ADMIN";

  return (
    <header className="border-b border-emerald-900/20 sticky top-0 z-50 bg-linear-to-r from-background via-emerald-950/5 to-background backdrop-blur-xl supports-backdrop-filter:bg-background/80 shadow-lg shadow-emerald-500/5" suppressHydrationWarning>
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-300"></div>
            <Image src="/logo-single.png" alt="PawCare Logo" width={200} height={60} className="h-12 w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-bold text-2xl group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-300">PawCare</span>
            <span className="text-[10px] text-muted-foreground -mt-1">Pet Healthcare Platform</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className={getNavLinkClass("/")}>
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <Link href="/doctors" className={getNavLinkClass("/doctors")}>
            <Stethoscope className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Find Vets</span>
          </Link>
          <Link href="/about" className={getNavLinkClass("/about")}>
            <Info className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>About</span>
          </Link>
          <Link href="/contact" className={getNavLinkClass("/contact")}>
            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Contact</span>
          </Link>
          <Link href="/petchat" className={getNavLinkClass("/petchat")}>
            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>PetChat</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Action Buttons */}
          <SignedIn>
            {/* Doctor Dashboard - check both Clerk metadata and database role */}
            {(clerkUser?.publicMetadata?.role === "DOCTOR" || userRole === "DOCTOR") && (
              <Link
                href="/doctor"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  `hidden lg:inline-flex items-center gap-2 transition-all ${isActive("/doctor") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`
                )}
              >
                <Stethoscope className="h-4 w-4" />
                Dashboard
              </Link>
            )}

            {/* Patient Appointments - check both Clerk metadata and database role */}
            {(clerkUser?.publicMetadata?.role === "PATIENT" || userRole === "PATIENT") && (
              <Link
                href="/appointments"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  `hidden lg:inline-flex items-center gap-2 transition-all ${isActive("/appointments") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`
                )}
              >
                <Calendar className="h-4 w-4" />
                Appointments
              </Link>
            )}

            {/* Unassigned Onboarding - only if no role set in both places */}
            {(!clerkUser?.publicMetadata?.role || clerkUser?.publicMetadata?.role === "UNASSIGNED") && (!userRole || userRole === "UNASSIGNED") && (
              <Link
                href="/onboarding"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  `hidden lg:inline-flex items-center gap-2 transition-all ${isActive("/onboarding") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`
                )}
              >
                <User className="h-4 w-4" />
                Complete Profile
              </Link>
            )}
          </SignedIn>

          {/* Admin Dashboard Button - REPLACES Credits for admin users */}
          {mounted && isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
                isActive("/admin")
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white border border-purple-400/30 hover:from-purple-600 hover:to-pink-600 shadow-md shadow-purple-500/20"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Premium/Credits Badge (only for non-admin users) */}
          {mounted && !isAdmin && (
            <Link href="/pricing" className="hidden md:block">
              {!clerkUser ? (
                <div className="group relative px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 transition-all duration-300 animate-pulse hover:animate-none cursor-pointer flex items-center gap-1.5 border border-yellow-600/30">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <Crown className="w-3.5 h-3.5 text-black relative z-10" />
                  <span className="text-xs font-bold text-black relative z-10 whitespace-nowrap">Go Premium</span>
                </div>
              ) : (
                <div className="h-10 bg-linear-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-600/40 rounded-full px-4 py-1 flex items-center gap-2 hover:from-emerald-900/40 hover:to-teal-900/40 hover:border-emerald-500/60 transition-all cursor-pointer group">
                  <CreditCard className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-emerald-400 font-semibold text-sm">
                    {userCredits} <span className="hidden lg:inline">Credits</span>
                  </span>
                </div>
              )}
            </Link>
          )}

          <SignedOut>
            <Button asChild variant="outline" size="sm" className="border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all">
              <SignInButton mode="modal">Sign In</SignInButton>
            </Button>
          </SignedOut>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-emerald-900/30 text-emerald-400 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <SignedIn>
            <div className="flex items-center gap-2">
              {/* User Role Badge */}
              {mounted && clerkUser?.publicMetadata?.role && (
                <div className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${clerkUser.publicMetadata.role === "DOCTOR"
                  ? "bg-emerald-900/40 border-emerald-600/50 text-emerald-300"
                  : clerkUser.publicMetadata.role === "ADMIN"
                    ? "bg-purple-900/40 border-purple-600/50 text-purple-300"
                    : "bg-blue-900/40 border-blue-600/50 text-blue-300"
                  }`}>
                  {clerkUser.publicMetadata.role === "DOCTOR" ? "🩺 Doctor" :
                    clerkUser.publicMetadata.role === "ADMIN" ? "👑 Admin" :
                      "👤 User"}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md"></div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-background hover:ring-emerald-400/50 transition-all",
                      userButtonPopoverCard: "shadow-2xl shadow-emerald-500/20",
                      userPreviewMainIdentifier: "font-semibold",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
      <div className="h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent"></div>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-background border-l border-emerald-900/30 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-emerald-900/30 pb-4">
                  <h2 className="text-lg font-bold text-emerald-400">Menu</h2>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-emerald-900/30 text-emerald-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/") ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" : "text-muted-foreground hover:bg-emerald-900/20 hover:text-emerald-400"}`}>
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link href="/doctors" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/doctors") ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" : "text-muted-foreground hover:bg-emerald-900/20 hover:text-emerald-400"}`}>
                    <Stethoscope className="h-5 w-5" />
                    <span className="font-medium">Find Vets</span>
                  </Link>
                  <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/about") ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" : "text-muted-foreground hover:bg-emerald-900/20 hover:text-emerald-400"}`}>
                    <Info className="h-5 w-5" />
                    <span className="font-medium">About</span>
                  </Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/contact") ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" : "text-muted-foreground hover:bg-emerald-900/20 hover:text-emerald-400"}`}>
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">Contact</span>
                  </Link>
                  <Link href="/petchat" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/petchat") ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50" : "text-muted-foreground hover:bg-emerald-900/20 hover:text-emerald-400"}`}>
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">PetChat</span>
                  </Link>

                  {/* Admin Dashboard in mobile menu */}
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="font-bold">Dashboard</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  )}

                  {/* Premium link (not for admins) */}
                  {!isAdmin && (
                    <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 hover:from-yellow-500/30 hover:to-amber-500/30 transition-all">
                      <Crown className="h-5 w-5" />
                      <span className="font-bold">Go Premium</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
