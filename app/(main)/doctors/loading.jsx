import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DoctorsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="mb-8 text-center">
        <div className="h-10 w-72 mx-auto bg-emerald-900/20 rounded-lg animate-pulse mb-3"></div>
        <div className="h-5 w-96 mx-auto bg-muted/20 rounded animate-pulse"></div>
      </div>

      {/* Specialty Filter Skeleton */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="h-10 w-28 bg-emerald-900/20 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>

      {/* Doctor Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card 
            key={i} 
            className="overflow-hidden border-emerald-900/20 bg-linear-to-br from-emerald-950/20 to-transparent"
          >
            {/* Image Skeleton */}
            <div className="h-48 bg-emerald-900/20 animate-pulse"></div>
            
            <div className="p-5 space-y-3">
              {/* Name */}
              <div className="h-6 w-40 bg-emerald-900/30 rounded animate-pulse"></div>
              
              {/* Specialty Badge */}
              <div className="h-6 w-28 bg-emerald-900/40 rounded-full animate-pulse"></div>
              
              {/* Rating & Experience */}
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-muted/20 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-muted/20 rounded animate-pulse"></div>
              </div>
              
              {/* Button */}
              <div className="h-10 w-full bg-emerald-900/30 rounded-lg animate-pulse mt-4"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="mt-8 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
        <span>Finding veterinarians near you...</span>
      </div>
    </div>
  );
}
