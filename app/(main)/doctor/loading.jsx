import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DoctorDashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-56 bg-emerald-900/20 rounded-lg animate-pulse mb-2"></div>
        <div className="h-5 w-80 bg-muted/20 rounded animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card 
            key={i} 
            className="p-6 border-emerald-900/20 bg-linear-to-br from-emerald-950/20 to-transparent"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-900/30 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted/20 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-emerald-900/30 rounded animate-pulse"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-10 w-32 bg-emerald-900/30 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-muted/20 rounded-lg animate-pulse"></div>
        <div className="h-10 w-32 bg-muted/20 rounded-lg animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <Card className="p-6 border-emerald-900/20 bg-linear-to-br from-emerald-950/20 to-transparent">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-emerald-900/10 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-emerald-900/30 animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-40 bg-emerald-900/30 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-muted/20 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-24 bg-emerald-900/30 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Loading Indicator */}
      <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        <span>Loading dashboard...</span>
      </div>
    </div>
  );
}
