import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import {dark} from '@clerk/themes';
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });




export const metadata = {
  title: "PawCare - Doctors Appointment App for Pets",
  description: "AI Powered Doctors Appointment App for Pets",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
    }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* header */}
          <Header />
          <main className="min-h-screen">{children}</main>

          <footer>
            <div className="container text-center py-4 border-t text-white border-gray-300 mt-8">
              <p className="text-sm text-white-500">
                &copy; {new Date().getFullYear()} PawCare. All rights reserved.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
