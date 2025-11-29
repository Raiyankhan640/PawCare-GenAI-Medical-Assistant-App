import { Loader2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AppointmentsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-emerald-900/20 rounded-lg animate-pulse mb-2"></div>
        <div className="h-5 w-96 bg-muted/20 rounded animate-pulse"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-10 w-32 bg-emerald-900/30 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-muted/20 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-muted/20 rounded-lg animate-pulse"></div>
      </div>

      {/* Appointment Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card 
            key={i} 
            className="p-6 border-emerald-900/20 bg-linear-to-br from-emerald-950/20 to-transparent"
          >
            <div className="flex items-start gap-4">
              {/* Avatar Skeleton */}
              <div className="h-16 w-16 rounded-full bg-emerald-900/30 animate-pulse"></div>
              
              <div className="flex-1 space-y-3">
                {/* Name */}
                <div className="h-6 w-48 bg-emerald-900/30 rounded animate-pulse"></div>
                
                {/* Details */}
                <div className="flex gap-4">
                  <div className="h-4 w-32 bg-muted/20 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted/20 rounded animate-pulse"></div>
                </div>
                
                {/* Badge */}
                <div className="h-6 w-20 bg-emerald-900/40 rounded-full animate-pulse"></div>
              </div>

              {/* Action Button */}
              <div className="h-10 w-28 bg-emerald-900/30 rounded-lg animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        <span>Loading your appointments...</span>
      </div>
    </div>
  );
}
