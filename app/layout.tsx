// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import { Providers } from './providers'
// import Navbar from '@/components/layout/Navbar'
// import Footer from '@/components/layout/Footer'  
// import { Toaster } from 'react-hot-toast'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
 import "./globals.css";

import PublicNavbar from  "@/components/shared/PublicNavbar";
import PublicFooter from "@/components/shared/PublicFooter.tsx";
 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Local Guide Platform - Discover Authentic Experiences",
  description: "Connect with local guides for authentic travel experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <PublicNavbar />
          <main className="flex-1">{children}</main>
          <PublicFooter/>
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}