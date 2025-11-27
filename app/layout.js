import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import {Header} from "@/components/header";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PawCare - Medical Assistant for Pets",
  description: "Connect with veterinarians anytime, anywhere",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />

            <footer className="relative bg-linear-to-b from-background via-emerald-950/5 to-background border-t border-emerald-900/20 overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Top Glow Border */}
              <div className="h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent"></div>

              <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                  {/* Company Info - Larger Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-300"></div>
                        <img src="/logo-single.png" alt="PawCare" className="h-12 w-auto relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent font-bold text-3xl group-hover:from-emerald-300 group-hover:to-cyan-300 transition-all duration-300">
                          PawCare
                        </span>
                        <span className="text-xs text-muted-foreground -mt-1">Your Pet's Health Partner</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                      Connecting pets with certified veterinary care 24/7. We're dedicated to providing exceptional healthcare for your furry family members.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                      {[
                        { name: 'Facebook', icon: '📘', href: '#' },
                        { name: 'Twitter', icon: '🐦', href: '#' },
                        { name: 'Instagram', icon: '📷', href: '#' },
                        { name: 'LinkedIn', icon: '💼', href: '#' }
                      ].map((social, i) => (
                        <a 
                          key={i}
                          href={social.href}
                          className="group relative w-12 h-12 bg-emerald-900/20 hover:bg-emerald-900/40 rounded-xl border border-emerald-800/30 hover:border-emerald-600/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20"
                          aria-label={social.name}
                        >
                          <span className="text-xl group-hover:scale-125 transition-transform duration-300">{social.icon}</span>
                          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/0 via-emerald-400/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                        </a>
                      ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <div className="px-4 py-2 bg-emerald-900/20 rounded-full border border-emerald-800/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                        <span className="animate-pulse">✓</span> Verified Vets
                      </div>
                      <div className="px-4 py-2 bg-emerald-900/20 rounded-full border border-emerald-800/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                        <span className="animate-pulse">🔒</span> Secure Platform
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                      <span className="w-1 h-6 bg-linear-to-b from-emerald-400 to-teal-400 rounded-full"></span>
                      Quick Links
                    </h3>
                    <ul className="space-y-3">
                      {[
                        { name: 'About Us', href: '/about', icon: '🏥' },
                        { name: 'Our Services', href: '/services', icon: '⚕️' },
                        { name: 'Find a Vet', href: '/doctors', icon: '👨‍⚕️' },
                        { name: 'Contact', href: '/contact', icon: '📞' },
                        { name: 'Pricing', href: '/pricing', icon: '💳' }
                      ].map((link, i) => (
                        <li key={i}>
                          <a 
                            href={link.href} 
                            className="group flex items-center gap-3 text-muted-foreground hover:text-emerald-400 transition-all duration-300 text-sm"
                          >
                            <span className="text-base group-hover:scale-125 transition-transform duration-300">{link.icon}</span>
                            <span className="relative">
                              {link.name}
                              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                      <span className="w-1 h-6 bg-linear-to-b from-emerald-400 to-teal-400 rounded-full"></span>
                      Services
                    </h3>
                    <ul className="space-y-3">
                      {[
                        { name: 'Video Consultation', href: '/telemedicine', icon: '📹' },
                        { name: 'Emergency Care', href: '/emergency', icon: '🚨' },
                        { name: 'Pet Pharmacy', href: '/pharmacy', icon: '💊' },
                        { name: 'Health Records', href: '/records', icon: '📋' },
                        { name: 'Pet Insurance', href: '/insurance', icon: '🛡️' }
                      ].map((service, i) => (
                        <li key={i}>
                          <a 
                            href={service.href} 
                            className="group flex items-center gap-3 text-muted-foreground hover:text-emerald-400 transition-all duration-300 text-sm"
                          >
                            <span className="text-base group-hover:scale-125 transition-transform duration-300">{service.icon}</span>
                            <span className="relative">
                              {service.name}
                              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-lg">
                      <span className="w-1 h-6 bg-linear-to-b from-emerald-400 to-teal-400 rounded-full"></span>
                      Get in Touch
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 group">
                        <span className="text-xl mt-0.5 group-hover:scale-125 transition-transform duration-300">📧</span>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Email</p>
                          <a href="mailto:support@pawcare.com" className="text-sm text-white hover:text-emerald-400 transition-colors duration-300">
                            support@pawcare.com
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <span className="text-xl mt-0.5 group-hover:scale-125 transition-transform duration-300">📱</span>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Phone</p>
                          <a href="tel:+15551234567" className="text-sm text-white hover:text-emerald-400 transition-colors duration-300">
                            +1 (555) 123-4567
                          </a>
                        </div>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <span className="text-xl mt-0.5 group-hover:scale-125 transition-transform duration-300">🕐</span>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Hours</p>
                          <p className="text-sm text-white">24/7 Available</p>
                          <p className="text-xs text-emerald-400">We're always here!</p>
                        </div>
                      </li>
                    </ul>

                    {/* Newsletter */}
                    <div className="mt-6 p-4 bg-linear-to-br from-emerald-900/20 to-teal-900/20 rounded-xl border border-emerald-800/30">
                      <p className="text-xs text-muted-foreground mb-2">Get pet care tips</p>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          placeholder="Your email"
                          className="flex-1 px-3 py-2 bg-background/50 border border-emerald-800/30 rounded-lg text-xs focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        <button className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-semibold transition-colors">
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-emerald-900/20 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>© {new Date().getFullYear()} PawCare.</span>
                      <span className="hidden md:inline">•</span>
                      <span>Made with</span>
                      <span className="text-red-500 animate-pulse">❤️</span>
                      <span>for Pets</span>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <a href="/privacy" className="hover:text-emerald-400 transition-colors duration-300 relative group">
                        Privacy Policy
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                      </a>
                      <span>•</span>
                      <a href="/terms" className="hover:text-emerald-400 transition-colors duration-300 relative group">
                        Terms of Service
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                      </a>
                      <span>•</span>
                      <a href="/cookies" className="hover:text-emerald-400 transition-colors duration-300 relative group">
                        Cookie Policy
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                      </a>
                    </div>
                  </div>

                  {/* Floating Paw Prints */}
                  <div className="flex justify-center gap-4 mt-6 opacity-30">
                    {['🐾', '🐾', '🐾'].map((paw, i) => (
                      <span 
                        key={i}
                        className="text-2xl animate-bounce"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      >
                        {paw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}