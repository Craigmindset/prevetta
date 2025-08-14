"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (authData.user) {
        const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            email: formData.email,
            full_name: fullName,
          },
        ])

        if (insertError) {
          console.error("Error inserting user data:", insertError)
          setError("Account created but profile setup failed. Please contact support.")
          setIsLoading(false)
          return
        }
      }

      setSuccess(true)

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Signup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2 font-poppins">Account Created Successfully!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please check your email to verify your account. You'll be redirected to the dashboard shortly.
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#01902e] mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      {/* Close Button - Fixed positioning */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 right-6 z-50 p-3 bg-white rounded-full shadow-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
        aria-label="Close and return to home"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-start mb-6">
                <img src="/images/prevetta-arcon-logo.png" alt="Prevetta ARCON Logo" className="h-10 w-auto" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight font-poppins">
                Create your account
              </h1>
              <p className="text-sm text-gray-600">Start vetting your creative materials today</p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium font-poppins">Sign Up</CardTitle>
                <CardDescription className="text-sm">
                  Enter your information to create your Prevetta account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Agency"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="text-sm"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#01902e] hover:bg-[#017a26] text-white font-medium text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Image/Content */}
        <div className="hidden lg:flex bg-gradient-to-br from-[#01902e] to-[#017a26] relative overflow-hidden">
          <div className="flex flex-col justify-center items-center p-12 text-white relative z-10">
            <h2 className="text-3xl font-semibold mb-6 tracking-tight font-poppins">
              Join thousands of advertising professionals
            </h2>
            <p className="text-base mb-8 text-green-100 leading-relaxed">
              Streamline your creative approval process with AI-powered vetting
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-200 flex-shrink-0" />
                <span className="text-sm text-green-100">Instant compliance analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-200 flex-shrink-0" />
                <span className="text-sm text-green-100">Brand safety screening</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-200 flex-shrink-0" />
                <span className="text-sm text-green-100">Detailed reporting & insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-200 flex-shrink-0" />
                <span className="text-sm text-green-100">Team collaboration tools</span>
              </div>
            </div>

            {/* Decorative Image */}
            <div className="mt-8">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Prevetta Dashboard Preview"
                className="rounded-lg shadow-2xl border border-green-400/20"
              />
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full"></div>
            <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
