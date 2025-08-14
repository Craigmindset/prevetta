"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Upload,
  Zap,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <SiteHeader />

      {/* Hero Section */}
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
            <div className="text-white pt-20 ml-4">
              <div className="text-sm font-medium text-gray-400 mb-1 tracking-wider uppercase mt-12 ">
                Powered by ACRON
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-8 tracking-tight font-orbitron leading-tight">
                WHERE
                <span className="block">CREATIVITY MEETS</span>
                <span className="block text-[#fca029]">COMPLIANCE</span>
              </h1>
              <p className="text-md text-gray-300 mb-8 max-w-lg leading-relaxed text-justify">
                Prevetta is an AI-powered pre-vetting platform developed in
                partnership with the Advertising Regulatory Council of Nigeria
                (ARCON). It helps advertisers and agencies streamline compliance
                checks, eliminating the risk of ad disapproval, placement
                errors, copy infringement, and other costly setbacks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="text-base px-8 py-6 bg-[#fca029] hover:bg-[#e89525] text-white font-semibold group"
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

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-slate-900 to-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
                500+
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Projects Delivered
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
                1000+
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Industry Experts
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
                98.9%
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Client Satisfaction
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
                30+
              </div>
              <div className="text-sm text-gray-400 font-medium">
                Industry Awards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 tracking-tight font-poppins">
              Comprehensive Creative Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your creative materials and get instant AI-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">
                  Design Vetting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Analyze visual designs for brand compliance, accessibility,
                  and effectiveness
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">
                  Script Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Review radio and TV scripts for compliance, tone, and
                  messaging effectiveness
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">
                  Image Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Detect inappropriate content, copyright issues, and brand
                  safety concerns
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">
                  Team Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Share results with your team and track approval workflows
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 tracking-tight font-poppins">
                Why Choose Prevetta?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">
                      Instant Analysis
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get comprehensive vetting results in seconds, not days
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">
                      Industry Compliance
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Ensure adherence to advertising standards and regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">
                      Cost Effective
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Reduce manual review costs and speed up approval processes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">
                      Detailed Reports
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get actionable insights and recommendations for
                      improvement
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Preveta Dashboard"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight font-poppins">
            Ready to Transform Your Creative Process?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of advertising professionals who trust Prevetta for
            their creative vetting needs.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-base px-8 py-6 bg-[#01902e] hover:bg-[#017a26] text-white font-medium"
          >
            <Link href="/signup">
              Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
