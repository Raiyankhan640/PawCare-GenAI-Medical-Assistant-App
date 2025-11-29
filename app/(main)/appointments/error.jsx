"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Calendar } from "lucide-react";
import Link from "next/link";

export default function AppointmentsError({ error, reset }) {
  useEffect(() => {
    // Log appointment errors
    console.error("Appointments error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-3xl opacity-30">
            <div className="w-24 h-24 mx-auto bg-amber-500 rounded-full"></div>
          </div>
          <div className="relative bg-amber-900/20 p-5 rounded-full inline-block border border-amber-500/30">
            <Calendar className="h-12 w-12 text-amber-400" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Unable to Load Appointments
        </h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load your appointments. Please try again.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mb-6 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg text-left">
            <p className="text-xs text-amber-400 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-emerald-700/30 hover:bg-emerald-900/30 w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
