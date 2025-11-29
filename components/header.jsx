"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton, SignInButton, useUser } from "@clerk/nextjs";
import {
  ShieldCheck,
  Stethoscope,
  Calendar,
  User,
  CreditCard,
  Sparkles,
  Home,
  Phone,
  Info,
  MessageCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { getUserCredits } from "@/actions/user";

export function Header() {
  const pathname = usePathname();
  const { user: clerkUser } = useUser();
  const [userCredits, setUserCredits] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (clerkUser) {
      getUserCredits().then((data) => {
        setUserCredits(data.credits);
        setUserRole(data.role);
      });
    }
  }, [clerkUser]);

  const isActive = (path) => {
    if (!mounted) return false; // Always return false on server to avoid mismatch
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const getNavLinkClass = (path) => {
    const base = "group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2";
    const active = "text-emerald-400 bg-emerald-950/30 border border-emerald-500/30";
    const inactive = "text-muted-foreground hover:text-emerald-400";
    return `${base} ${isActive(path) ? active : inactive}`;
  };

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

        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className={getNavLinkClass("/")} suppressHydrationWarning>
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Home</span>
          </Link>
          <Link href="/doctors" className={getNavLinkClass("/doctors")} suppressHydrationWarning>
            <Stethoscope className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Find Vets</span>
          </Link>
          <Link href="/about" className={getNavLinkClass("/about")} suppressHydrationWarning>
            <Info className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>About</span>
          </Link>
          <Link href="/contact" className={getNavLinkClass("/contact")} suppressHydrationWarning>
            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Contact</span>
          </Link>
          <Link href="/petchat" className={getNavLinkClass("/petchat")} suppressHydrationWarning>
            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>PetChat</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <SignedIn>
            {clerkUser?.publicMetadata?.role === "ADMIN" && (
              <Link href="/admin" suppressHydrationWarning>
                <Button variant="outline" className={`hidden md:inline-flex items-center gap-2 transition-all ${isActive("/admin") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`} suppressHydrationWarning>
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            {clerkUser?.publicMetadata?.role === "DOCTOR" && (
              <Link href="/doctor" suppressHydrationWarning>
                <Button variant="outline" className={`hidden md:inline-flex items-center gap-2 transition-all ${isActive("/doctor") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`} suppressHydrationWarning>
                  <Stethoscope className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            {clerkUser?.publicMetadata?.role === "PATIENT" && (
              <Link href="/appointments" suppressHydrationWarning>
                <Button variant="outline" className={`hidden md:inline-flex items-center gap-2 transition-all ${isActive("/appointments") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`} suppressHydrationWarning>
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Button>
              </Link>
            )}
            {clerkUser?.publicMetadata?.role === "UNASSIGNED" && (
              <Link href="/onboarding" suppressHydrationWarning>
                <Button variant="outline" className={`hidden md:inline-flex items-center gap-2 transition-all ${isActive("/onboarding") ? "border-emerald-500/50 bg-emerald-900/40 text-emerald-400" : "border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50"}`} suppressHydrationWarning>
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>
              </Link>
            )}
          </SignedIn>

          {(!clerkUser || clerkUser?.publicMetadata?.role !== "ADMIN") && (
            <Link href="/pricing">
              <Badge variant="outline" className="h-10 bg-linear-to-r from-emerald-900/30 to-teal-900/30 border-emerald-600/40 px-4 py-1 flex items-center gap-2 hover:from-emerald-900/40 hover:to-teal-900/40 hover:border-emerald-500/60 transition-all cursor-pointer group">
                <CreditCard className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-emerald-400 font-semibold">
                  {clerkUser && clerkUser.publicMetadata?.role !== "ADMIN" ? (
                    <>
                      {userCredits} <span className="hidden md:inline">{userRole === "PATIENT" ? "Available Credits" : "Earned Credit"}</span>
                    </>
                  ) : (
                    <>Get Credits</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          <SignedOut>
            <Button asChild variant="outline" size="sm" className="border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all">
              <SignInButton mode="modal">Sign In</SignInButton>
            </Button>
          </SignedOut>

          <SignedIn>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md"></div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-11 h-11 ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-background hover:ring-emerald-400/50 transition-all",
                    userButtonPopoverCard: "shadow-2xl shadow-emerald-500/20",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          </SignedIn>
        </div>
      </div>
      <div className="h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent"></div>
    </header>
  );
}
