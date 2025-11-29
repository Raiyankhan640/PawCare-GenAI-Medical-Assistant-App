"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

export default function VideoCallError({ error, reset }) {
  useEffect(() => {
    // Log video call errors for debugging
    console.error("Video call error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-3xl opacity-30">
            <div className="w-24 h-24 mx-auto bg-red-500 rounded-full"></div>
          </div>
          <div className="relative bg-red-900/20 p-5 rounded-full inline-block border border-red-500/30">
            <Video className="h-12 w-12 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Video Call Error
        </h2>
        <p className="text-muted-foreground mb-6">
          We encountered an issue with the video call. This could be due to camera/microphone permissions or network connectivity.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <p className="text-xs text-red-400 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-left">
          <p className="text-sm text-emerald-400 font-medium mb-2">Quick fixes:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Check camera and microphone permissions</li>
            <li>• Ensure stable internet connection</li>
            <li>• Try refreshing the page</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/appointments">
            <Button variant="outline" className="border-emerald-700/30 hover:bg-emerald-900/30 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
