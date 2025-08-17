"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="border-b border-white/10 bg-transparent backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/images/prevetta-arcon-logo.png"
            alt="Prevetta ARCON Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 flex-1">
          <Link
            href="/"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            About Prevetta
          </Link>
          <Link
            href="#features"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>

        <div className="flex items-center space-x-2">
          <Button
            asChild
            className="bg-[#01902e] hover:bg-[#017a26] text-white font-medium"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#about"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Prevetta
            </Link>
            <Link
              href="#features"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/login"
              className="block text-sm font-medium text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Button
              asChild
              className="w-full bg-[#01902e] hover:bg-[#fca029] text-white font-medium"
            >
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
