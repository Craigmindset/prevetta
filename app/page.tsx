"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Upload, Zap, Shield, Users, ArrowRight } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import Statistics from "@/components/Statistics"
import Link from "next/link"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <SiteHeader />

  {/* Hero Section */}
  <HeroSection />

  {/* Statistics Section */}
  <Statistics />

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
                <CardTitle className="text-lg font-medium font-poppins">Design Vetting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Analyze visual designs for brand compliance, accessibility, and effectiveness
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">Script Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Review radio and TV scripts for compliance, tone, and messaging effectiveness
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">Image Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 leading-relaxed">
                  Detect inappropriate content, copyright issues, and brand safety concerns
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-medium font-poppins">Team Collaboration</CardTitle>
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
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">Instant Analysis</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get comprehensive vetting results in seconds, not days
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">Industry Compliance</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Ensure adherence to advertising standards and regulations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">Cost Effective</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Reduce manual review costs and speed up approval processes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1 font-poppins">Detailed Reports</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Get actionable insights and recommendations for improvement
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
            Join thousands of advertising professionals who trust Prevetta for their creative vetting needs.
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
  )
}
