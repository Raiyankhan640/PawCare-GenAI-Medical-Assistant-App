import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });




export const metadata = {
  title: "PawCare - Doctors Appointment App for Pets",
  description: "AI Powered Doctors Appointment App for Pets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {/* header */}
        
        <main className="min-h-screen">{children}</main>
        
        <footer>
          <div className="text-center py-4 border-t">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PawCare. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
