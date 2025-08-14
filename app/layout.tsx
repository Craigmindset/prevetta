import type React from "react"
import type { Metadata } from "next"
import { Poppins, Orbitron } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prevetta - AI-Powered Creative Vetting Platform",
  description: "Ensure your advertising materials meet compliance standards with AI-powered analysis",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${poppins.variable} ${orbitron.variable}`}>{children}</body>
    </html>
  )
}
