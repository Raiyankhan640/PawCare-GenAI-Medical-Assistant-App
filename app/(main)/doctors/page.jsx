import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES } from "@/lib/specialities";

export default async function DoctorsPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text mb-2 animate-gradient">
          Find Your Doctor
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Browse by specialty or view all available healthcare providers
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2 md:px-0">
        {SPECIALTIES.map((specialty) => (
          <Link key={specialty.name} href={`/doctors/${specialty.name}`}>
            <Card className="group relative overflow-hidden border-emerald-900/20 hover:border-emerald-700/40 transition-all cursor-pointer h-full shadow-xl hover:shadow-emerald-500/20 backdrop-blur-xl bg-gradient-to-br from-emerald-950/60 via-card/60 to-teal-950/40">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:via-teal-500/10 group-hover:to-emerald-500/10 transition-all duration-500"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              {/* Glowing border effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl"></div>
              </div>
              <CardContent className="relative z-10 p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-emerald-700/30 group-hover:border-emerald-500/50 backdrop-blur-sm">
                  <span className="text-emerald-400 text-3xl scale-125">{specialty.icon}</span>
                </div>
                <h3 className="font-semibold text-lg md:text-xl text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {specialty.name}
                </h3>
                <div className="mt-2 text-xs text-muted-foreground bg-emerald-900/20 px-3 py-1 rounded-lg border border-muted/20">
                  Click to view specialists
                </div>
              </CardContent>
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-br-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-3xl"></div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}