import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="relative">
          {/* Animated gradient orb */}
          <div className="absolute inset-0 blur-3xl opacity-50">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Spinner */}
          <div className="relative">
            <Loader2 className="h-16 w-16 text-emerald-500 animate-spin mx-auto" />
          </div>
        </div>
        
        <h2 className="mt-8 text-2xl font-bold text-white">Loading PawCare</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we fetch your pet care platform...</p>
        
        {/* Animated paw prints */}
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="text-2xl animate-bounce"
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
