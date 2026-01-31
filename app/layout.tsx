import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/app/components/ui/sonner"
import { Navbar } from "@/app/components/layout/Navbar"
import { Footer } from "@/app/components/layout/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TickFlow - Modern Event Ticketing",
  description: "The seamless event ticketing platform. Book tickets, manage events, and check in with ease.",
  keywords: ["events", "tickets", "booking", "ticketing platform", "event management"],
  authors: [{ name: "TickFlow" }],
  openGraph: {
    title: "TickFlow - Modern Event Ticketing",
    description: "The seamless event ticketing platform. Book tickets, manage events, and check in with ease.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
