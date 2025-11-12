import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated gradient orb */}
          <div className="absolute inset-0 blur-3xl opacity-50">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Spinner */}
          <div className="relative">
            <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto" />
          </div>
        </div>
        
        <p className="mt-6 text-muted-foreground">Loading content...</p>
        
        {/* Animated paw prints */}
        <div className="mt-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="text-xl animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            >
              🐾
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
