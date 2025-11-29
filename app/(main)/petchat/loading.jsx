import { Loader2, MessageSquare } from "lucide-react";

export default function PetChatLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Chat Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 blur-3xl opacity-40">
            <div className="w-20 h-20 mx-auto bg-linear-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
          </div>
          <div className="relative bg-emerald-900/30 p-4 rounded-2xl inline-block border border-emerald-500/30">
            <MessageSquare className="h-10 w-10 text-emerald-400" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-white mb-2">
          Starting PetChat AI
        </h2>
        <p className="text-muted-foreground mb-6">
          Preparing your veterinary assistant...
        </p>

        {/* Spinner */}
        <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mx-auto" />

        {/* Animated Paw Prints */}
        <div className="mt-6 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="text-2xl animate-bounce opacity-70"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.2s'
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
