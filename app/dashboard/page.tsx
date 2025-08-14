"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ImageIcon, Clock, CheckCircle, AlertTriangle, User, LogOut, Mic, Video } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface VettingResult {
  id: string
  file_name: string
  content_type: string
  status: string
  compliance_score: number | null
  created_at: string
  recommendations: string | null
}

interface DashboardStats {
  totalAnalyses: number
  approvedCount: number
  pendingCount: number
  rejectedCount: number
}

export default function DashboardPage() {
  const [recentAnalyses, setRecentAnalyses] = useState<VettingResult[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  })
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // For demo purposes, using the sample user ID from our SQL script
      const demoUserId = "550e8400-e29b-41d4-a716-446655440000"

      // Fetch recent vetting results
      const { data: vettingResults, error: vettingError } = await supabase
        .from("vetting_results")
        .select("*")
        .eq("user_id", demoUserId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (vettingError) {
        console.error("Error fetching vetting results:", vettingError)
        setRecentAnalyses([])
        setStats({
          totalAnalyses: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
        })
        setLoading(false)
        return
      }

      setRecentAnalyses(vettingResults || [])

      // Calculate stats
      const totalAnalyses = vettingResults?.length || 0
      const approvedCount = vettingResults?.filter((r) => r.status === "approved").length || 0
      const pendingCount = vettingResults?.filter((r) => r.status === "needs_review").length || 0
      const rejectedCount = vettingResults?.filter((r) => r.status === "rejected").length || 0

      setStats({
        totalAnalyses,
        approvedCount,
        pendingCount,
        rejectedCount,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setRecentAnalyses([])
      setStats({
        totalAnalyses: 0,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case "audio":
        return Mic
      case "video":
        return Video
      case "image":
        return ImageIcon
      default:
        return FileText
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/images/prevetta-arcon-logo.png" alt="Prevetta ARCON Logo" className="h-8 w-auto" />
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              Dashboard
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-sm font-medium">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={() => router.push("/")}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Welcome back!</h1>
          <p className="text-sm text-gray-600">
            Ready to vet your creative materials? Upload and analyze your content below.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/upload?type=design">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-base font-medium">Vet Design</CardTitle>
                <CardDescription className="text-xs">Upload and analyze visual designs</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/upload?type=radio">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-base font-medium">Radio Script</CardTitle>
                <CardDescription className="text-xs">Analyze radio commercial scripts</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/upload?type=tv">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-base font-medium">TV Commercial</CardTitle>
                <CardDescription className="text-xs">Review TV commercial content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/upload?type=image">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <Upload className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-base font-medium">Upload Images</CardTitle>
                <CardDescription className="text-xs">Screen images for compliance</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Stats Cards - Updated with real data */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">All time uploads</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.approvedCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalAnalyses > 0 ? Math.round((stats.approvedCount / stats.totalAnalyses) * 100) : 0}% approval
                rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.pendingCount}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stats.rejectedCount}</div>
              <p className="text-xs text-muted-foreground">Non-compliant items</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses - Updated with real data */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Analyses</CardTitle>
            <CardDescription className="text-sm">Your latest creative material reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No analyses yet</p>
                <p className="text-sm text-gray-400 mb-4">
                  Upload your first creative material to get started with AI-powered compliance checking.
                </p>
                <Link href="/dashboard/upload">
                  <Button className="mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => {
                  const IconComponent = getContentIcon(analysis.content_type)
                  return (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{analysis.file_name}</h3>
                          <p className="text-xs text-gray-500">
                            {analysis.content_type} • {formatDate(analysis.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-xs font-medium">Score: {analysis.compliance_score || "N/A"}/100</div>
                          <Badge
                            variant={analysis.status === "approved" ? "default" : "secondary"}
                            className={`text-xs ${
                              analysis.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : analysis.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {analysis.status === "approved" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1).replace("_", " ")}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs font-medium bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
