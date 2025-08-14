"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to dashboard on successful login
    router.push("/dashboard")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/prevetta-arcon-logo.png" alt="Prevetta ARCON Logo" className="h-10 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">Welcome back</h1>
            <p className="text-gray-600 mt-2">Sign in to your Prevetta account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-poppins">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#01902e] hover:bg-[#017a26] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
