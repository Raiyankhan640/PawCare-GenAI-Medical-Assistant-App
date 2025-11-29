"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900 px-4">
          <div className="text-center max-w-md">
            {/* Error Icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-3xl opacity-30">
                <div className="w-32 h-32 mx-auto bg-red-500 rounded-full"></div>
              </div>
              <div className="relative bg-red-900/20 p-6 rounded-full inline-block border border-red-500/30">
                <AlertTriangle className="h-16 w-16 text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-white mb-4">
              Something Went Wrong
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              We apologize for the inconvenience. An unexpected error has occurred.
              Please try again or return to the home page.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && error?.message && (
              <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
                <p className="text-sm text-red-400 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

            {/* Paw prints decoration */}
            <div className="mt-12 flex justify-center gap-2 opacity-50">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="text-2xl"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  🐾
                </span>
              ))}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
