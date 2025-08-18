"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black min-h-screen flex items-center -mt-20">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-zZtz6TIitvnutZzmb1Wq0qXhmsUMsQ.png"
          alt="Cyberpunk digital art background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white ml-12 mt-20">
            <div className="text-sm font-medium text-gray-400 mb-2 tracking-wider uppercase mt-10">
              Powered by ARCON
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight font-orbitron leading-tight">
              WHERE
              <span className="block">CREATIVITY</span>
              <span className="block">MEETS</span>
              <span className="block text-[#fca029]">COMPLIANCE</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
              Leap beyond the horizon of traditional vetting into a realm where
              AI doesn't just check compliance—it reshapes creative excellence.
              Transform your advertising. Elevate standards. Usher in a new era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="text-base px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold group"
              >
                <Link href="/signup" className="flex items-center">
                  START VETTING
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - kept minimal to let background image show */}
          <div className="relative lg:block hidden">
            {/* Intentionally minimal to showcase the background abstract art */}
          </div>
        </div>
      </div>
    </section>
  );
}
