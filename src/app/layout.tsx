import type { Metadata } from "next";
import "./globals.css";
import {Inter} from 'next/font/google';
import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import {ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "sonner";


const inter = Inter({subsets:['latin']});
export const metadata: Metadata = {
  title: "Welth",
  description:"Manage your finances and determine loan risks with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en">
            <body
              className={`${inter.className}antialiased`}
            >
              <Navbar/>
              <main className="min-h-screen">{children}</main>
              <Toaster richColors/>
              <Footer/>
            </body>
        </html>
      </ClerkProvider>
  );
}
