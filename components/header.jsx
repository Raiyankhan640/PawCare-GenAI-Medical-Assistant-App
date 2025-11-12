import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { 
  ShieldCheck, 
  Stethoscope, 
  Calendar, 
  User, 
  CreditCard,
  Sparkles,
  Home,
  Phone,
  Info
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { checkUser } from "@/lib/checkUser";

export async function Header() {
  const user = checkUser();

  return (
    <header className="border-b border-emerald-900/20 sticky top-0 z-50 bg-gradient-to-r from-background via-emerald-950/5 to-background backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg shadow-emerald-500/5">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo Section - Enhanced */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-300"></div>
            <Image
              src="/logo-single.png"
              alt="PawCare Logo"
              width={200}
              height={60}
              className="h-12 w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-bold text-2xl group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-300">
              PawCare
            </span>
            <span className="text-[10px] text-muted-foreground -mt-1">Pet Healthcare Platform</span>
          </div>
        </Link>

        {/* Navigation Links - Enhanced */}
        <nav className="hidden md:flex items-center gap-2">
          <Link 
            href="/" 
            className="group relative px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-all duration-300 flex items-center gap-2"
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Home</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/doctors" 
            className="group relative px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-all duration-300 flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Find Vets</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/about" 
            className="group relative px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-all duration-300 flex items-center gap-2"
          >
            <Info className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>About</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          <Link 
            href="/contact" 
            className="group relative px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-all duration-300 flex items-center gap-2"
          >
            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Contact</span>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></div>
          </Link>
          
          {/* Pricing - Highlighted */}
          <Link 
            href="/pricing" 
            className="relative ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 text-emerald-400 hover:from-emerald-600/40 hover:to-teal-600/40 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 group overflow-hidden font-semibold"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Sparkles className="h-4 w-4 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all animate-pulse" />
            <span className="relative z-10">Pricing</span>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></div>
          </Link>
        </nav>

        {/* Action Buttons - Enhanced */}
        <div className="flex items-center gap-3">
          <SignedIn>
           {/* Admin Links */}
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <ShieldCheck className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Doctor Links */}
            {user?.role === "DOCTOR" && (
              <Link href="/doctor">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all"
                >
                  <Stethoscope className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Stethoscope className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Patient Links */}
            {user?.role === "PATIENT" && (
              <Link href="/appointments">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  Appointments
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {/* Unassigned Role */}
            {user?.role === "UNASSIGNED" && (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all"
                >
                  <User className="h-4 w-4" />
                  Complete Profile
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </SignedIn>

          {(!user || user?.role !== "ADMIN") && (
            <Link href={user?.role === "PATIENT" ? "/pricing" : "/pricing"}>
              <Badge
                variant="outline"
                className="h-10 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-600/40 px-4 py-1 flex items-center gap-2 hover:from-emerald-900/40 hover:to-teal-900/40 hover:border-emerald-500/60 transition-all cursor-pointer group"
              >
                <CreditCard className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-emerald-400 font-semibold">
                  {user && user.role !== "ADMIN" ? (
                    <>
                      {user.credits}{" "}
                      <span className="hidden md:inline">
                        {user?.role === "PATIENT"
                          ? "Credits"
                          : "Earned"}
                      </span>
                    </>
                  ) : (
                    <>Get Credits</>
                  )}
                </span>
              </Badge>
            </Link>
          )}

          <SignedOut>
            <Button 
              asChild 
              variant="outline" 
              size="sm"
              className="border-emerald-700/30 hover:bg-emerald-900/30 hover:border-emerald-600/50 transition-all"
            >
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
      
      {/* Bottom Border Glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
    </header>
  );
}
