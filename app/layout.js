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

            <footer className="bg-background border-t">
              <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Company Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <img src="/logo-single.png" alt="PawCare" className="h-8 w-auto" />
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl">
                        PawCare
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Connecting pets with quality veterinary care, anytime, anywhere.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/about" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">About Us</a></li>
                      <li><a href="/services" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Our Services</a></li>
                      <li><a href="/doctors" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Find a Vet</a></li>
                      <li><a href="/contact" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Contact</a></li>
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="font-semibold mb-4">Services</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><a href="/appointments" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Book Appointment</a></li>
                      <li><a href="/emergency" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Emergency Care</a></li>
                      <li><a href="/telemedicine" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Video Consultation</a></li>
                      <li><a href="/pharmacy" className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Pet Pharmacy</a></li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>support@pawcare.com</li>
                      <li>+1 (555) 123-4567</li>
                      <li>Mon - Sat: 9:00 AM - 8:00 PM</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
                  <p>© {new Date().getFullYear()} PawCare. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}