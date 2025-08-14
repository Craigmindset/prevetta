"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  FileText,
  ImageIcon,
  Radio,
  Video,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  FileAudio,
} from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "design"
  const [files, setFiles] = useState<File[]>([])
  const [scriptContent, setScriptContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [bulkProgress, setBulkProgress] = useState(0)
  // Added transcription states
  const [transcriptions, setTranscriptions] = useState<{ [key: string]: string }>({})
  const [isTranscribing, setIsTranscribing] = useState<{ [key: string]: boolean }>({})
  const [showTranscriptionEditor, setShowTranscriptionEditor] = useState<{ [key: string]: boolean }>({})

  const typeConfig = {
    design: {
      title: "Design Vetting",
      description: "Upload your visual designs for compliance and effectiveness analysis",
      icon: ImageIcon,
      accept: "image/*",
      color: "blue",
      multiple: true,
    },
    radio: {
      title: "Radio Content Analysis",
      description: "Upload audio files or scripts for radio commercial review",
      icon: Radio,
      accept: "audio/*,.txt,.doc,.docx,.mp3,.wav,.m4a",
      color: "green",
      multiple: true,
    },
    tv: {
      title: "TV Commercial Analysis",
      description: "Upload video/audio files or scripts for TV commercial review",
      icon: Video,
      accept: "video/*,audio/*,.txt,.doc,.docx,.mp4,.mov,.avi,.mp3,.wav",
      color: "purple",
      multiple: true,
    },
    image: {
      title: "Image Screening",
      description: "Upload multiple images for brand safety and compliance screening",
      icon: Upload,
      accept: "image/*",
      color: "orange",
      multiple: true,
    },
  }

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.design
  const IconComponent = config.icon

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      // Auto-transcribe audio files when uploaded
      newFiles.forEach((file) => {
        if (file.type.startsWith("audio/")) {
          handleTranscribeFile(file)
        }
      })
    }
  }, [])

  // Added transcription function
  const handleTranscribeFile = async (file: File) => {
    const fileKey = `${file.name}-${file.size}`
    setIsTranscribing((prev) => ({ ...prev, [fileKey]: true }))

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.error === "quota_exceeded") {
          setTranscriptions((prev) => ({
            ...prev,
            [fileKey]:
              errorData.fallback_message ||
              "Transcription service temporarily unavailable. You can manually enter the audio content for vetting.",
          }))
          setShowTranscriptionEditor((prev) => ({ ...prev, [fileKey]: true }))
          return
        }

        throw new Error(errorData.message || "Transcription failed")
      }

      const result = await response.json()
      setTranscriptions((prev) => ({ ...prev, [fileKey]: result.transcription }))
      setShowTranscriptionEditor((prev) => ({ ...prev, [fileKey]: true }))
    } catch (error) {
      console.error("Transcription error:", error)
      setTranscriptions((prev) => ({
        ...prev,
        [fileKey]: "Transcription failed. Please try again or enter text manually.",
      }))
      setShowTranscriptionEditor((prev) => ({ ...prev, [fileKey]: true }))
    } finally {
      setIsTranscribing((prev) => ({ ...prev, [fileKey]: false }))
    }
  }

  const removeFile = (index: number) => {
    const file = files[index]
    const fileKey = `${file.name}-${file.size}`

    // Clean up transcription data when removing file
    setTranscriptions((prev) => {
      const newTranscriptions = { ...prev }
      delete newTranscriptions[fileKey]
      return newTranscriptions
    })
    setIsTranscribing((prev) => {
      const newTranscribing = { ...prev }
      delete newTranscribing[fileKey]
      return newTranscribing
    })
    setShowTranscriptionEditor((prev) => {
      const newEditor = { ...prev }
      delete newEditor[fileKey]
      return newEditor
    })

    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.startsWith("audio/")) return FileAudio
    if (file.type.startsWith("video/")) return Video
    return FileText
  }

  const handleBulkAnalyze = async () => {
    setIsAnalyzing(true)
    setAnalysisResults([])
    setBulkProgress(0)

    try {
      const results = []
      const totalFiles = files.length || 1

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileKey = `${file.name}-${file.size}`
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", type)

        // Include transcription for audio/video files
        if ((file.type.startsWith("audio/") || file.type.startsWith("video/")) && transcriptions[fileKey]) {
          formData.append("transcription", transcriptions[fileKey])
        }

        try {
          const response = await fetch("/api/moderate", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Failed to analyze ${file.name}`)
          }

          const result = await response.json()
          results.push({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            ...result,
          })
        } catch (error) {
          results.push({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            score: 0,
            status: "error",
            issues: [
              {
                type: "system",
                severity: "high",
                message: `Failed to analyze ${file.name}. Please try again.`,
              },
            ],
            recommendations: ["Check file format", "Try re-uploading the file"],
            summary: "Analysis could not be completed",
          })
        }

        setBulkProgress(((i + 1) / totalFiles) * 100)
      }

      if (files.length === 0 && scriptContent.trim()) {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: scriptContent,
            type,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to analyze script content")
        }

        const result = await response.json()
        results.push({
          fileName: "Script Content",
          fileType: "text/plain",
          fileSize: scriptContent.length,
          ...result,
        })
        setBulkProgress(100)
      }

      setAnalysisResults(results)
    } catch (error) {
      console.error("Bulk analysis failed:", error)
      setAnalysisResults([
        {
          fileName: "System Error",
          fileType: "error",
          fileSize: 0,
          score: 0,
          status: "error",
          issues: [
            {
              type: "system",
              severity: "high",
              message: "Bulk analysis failed. Please try again.",
            },
          ],
          recommendations: ["Check your internet connection", "Try uploading fewer files"],
          summary: "Analysis could not be completed",
        },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusBadge = (status: string, moderation?: any) => {
    if (status === "error") {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
    }

    if (moderation?.flagged || status === "rejected") {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      )
    }

    if (status === "approved") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Needs Review
      </Badge>
    )
  }

  // Check if all audio files have been processed
  const canAnalyze = () => {
    if (files.length === 0 && !scriptContent.trim()) return false

    // Check if any audio files are still being transcribed
    const audioFiles = files.filter((file) => file.type.startsWith("audio/"))
    const stillTranscribing = audioFiles.some((file) => {
      const fileKey = `${file.name}-${file.size}`
      return isTranscribing[fileKey]
    })

    return !stillTranscribing
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <img src="/images/prevetta-arcon-logo.png" alt="Prevetta ARCON Logo" className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 bg-${config.color}-100 rounded-lg flex items-center justify-center`}>
              <IconComponent className={`h-6 w-6 text-${config.color}-600`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-600">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Materials</CardTitle>
              <CardDescription>
                {type === "radio" || type === "tv"
                  ? "Upload audio/video files (auto-transcribed) or paste script content for bulk analysis"
                  : "Upload multiple creative files for bulk vetting analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload">Upload Files (Multiple Supported)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Drop files here or click to upload multiple files
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        multiple={config.multiple}
                        accept={config.accept}
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      {config.accept.includes("audio")
                        ? "Images, Audio (MP3, WAV, M4A - auto-transcribed), Video, Documents up to 10MB each"
                        : config.accept === "image/*"
                          ? "PNG, JPG, GIF up to 10MB each"
                          : "TXT, DOC, DOCX up to 5MB each"}
                    </p>
                  </div>
                </div>

                {/* Enhanced file list with transcription support */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {files.length} file{files.length > 1 ? "s" : ""} selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFiles([])
                          setTranscriptions({})
                          setIsTranscribing({})
                          setShowTranscriptionEditor({})
                        }}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                    {files.map((file, index) => {
                      const FileIcon = getFileIcon(file)
                      const fileKey = `${file.name}-${file.size}`
                      const isAudio = file.type.startsWith("audio/")
                      const transcribing = isTranscribing[fileKey]
                      const hasTranscription = transcriptions[fileKey]
                      const showEditor = showTranscriptionEditor[fileKey]

                      return (
                        <div key={index} className="border rounded-lg p-3 bg-white">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileIcon className="h-4 w-4 text-gray-500" />
                              <div>
                                <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {file.type.split("/")[0]}
                                  </Badge>
                                  {/* Show transcription status for audio files */}
                                  {isAudio && (
                                    <Badge
                                      variant={
                                        transcribing ? "secondary" : hasTranscription ? "default" : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {transcribing ? "Transcribing..." : hasTranscription ? "Transcribed" : "Pending"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 hover:bg-red-100"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>

                          {/* Transcription editor for audio files */}
                          {isAudio && showEditor && (
                            <div className="mt-3 space-y-2">
                              <Label className="text-xs font-medium">
                                Transcription (Review and edit before vetting):
                              </Label>
                              <Textarea
                                value={transcriptions[fileKey] || ""}
                                onChange={(e) => setTranscriptions((prev) => ({ ...prev, [fileKey]: e.target.value }))}
                                placeholder={
                                  transcribing ? "Transcribing audio..." : "Transcription will appear here..."
                                }
                                disabled={transcribing}
                                rows={4}
                                className="text-xs"
                              />
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowTranscriptionEditor((prev) => ({ ...prev, [fileKey]: false }))}
                                  className="text-xs"
                                >
                                  Hide
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTranscribeFile(file)}
                                  disabled={transcribing}
                                  className="text-xs"
                                >
                                  Re-transcribe
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Script Input for Radio/TV */}
              {(type === "radio" || type === "tv") && (
                <div>
                  <Label htmlFor="script-content">Or Paste Script Content</Label>
                  <Textarea
                    id="script-content"
                    placeholder="Paste your script content here..."
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    rows={8}
                    className="mt-2"
                  />
                </div>
              )}

              <Button
                onClick={handleBulkAnalyze}
                disabled={!canAnalyze() || isAnalyzing}
                className="w-full bg-[#01902e] hover:bg-[#017a26] text-white"
                size="lg"
              >
                {isAnalyzing
                  ? `Analyzing ${files.length > 1 ? `${files.length} files` : "content"}...`
                  : !canAnalyze() && files.some((f) => f.type.startsWith("audio/"))
                    ? "Waiting for transcription..."
                    : `Click to Pre-Vet ${files.length > 1 ? `(${files.length} files)` : ""}`}
              </Button>

              {isAnalyzing && files.length > 1 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing files...</span>
                    <span>{Math.round(bulkProgress)}%</span>
                  </div>
                  <Progress value={bulkProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {analysisResults.length > 0
                  ? `Review analysis results for ${analysisResults.length} item${analysisResults.length > 1 ? "s" : ""}`
                  : "Upload materials and click analyze to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {files.length > 1 ? `Analyzing ${files.length} files...` : "Analyzing your content..."}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              ) : analysisResults.length > 0 ? (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {analysisResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{result.fileName}</span>
                          {result.fileType !== "error" && (
                            <Badge variant="outline" className="text-xs">
                              {result.fileType.split("/")[0]}
                            </Badge>
                          )}
                        </div>
                        {getStatusBadge(result.status, result.moderation)}
                      </div>

                      {/* Transcription - First display transcribed version */}
                      {result.transcription && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm">Transcribed Content</h4>
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">{result.transcription}</p>
                          </div>
                        </div>
                      )}

                      {/* Pre-vetting - Grey area analysis */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Pre-vetting</h4>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {result.preVetting ||
                              result.summary ||
                              "Content has been analyzed for compliance and brand safety standards."}
                          </p>
                        </div>
                      </div>

                      {/* Suggestions - Improvements */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Suggestions</h4>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          {result.recommendations && result.recommendations.length > 0 ? (
                            <ul className="space-y-1">
                              {result.recommendations.map((rec: string, recIndex: number) => (
                                <li key={recIndex} className="text-sm text-green-800 flex items-start">
                                  <span className="mr-2">•</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-800">No specific improvements needed at this time.</p>
                          )}
                        </div>
                      </div>

                      {/* Copyright - Infringement check */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Copyright</h4>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          {result.copyrightIssues && result.copyrightIssues.length > 0 ? (
                            <div className="space-y-2">
                              <p className="text-sm text-orange-800 font-medium">
                                Potential copyright concerns detected:
                              </p>
                              {result.copyrightIssues.map((issue: any, issueIndex: number) => (
                                <div key={issueIndex} className="text-sm text-orange-700">
                                  <p>{issue.description}</p>
                                  {issue.referenceLink && (
                                    <a
                                      href={issue.referenceLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      View similar content →
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-orange-800">No copyright infringement detected.</p>
                          )}
                        </div>
                      </div>

                      {/* Result - Final compliance score and status */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Result</h4>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">{result.score}/100</div>
                          <div className="mb-3">{getStatusBadge(result.status, result.moderation)}</div>
                          <p className="text-sm text-gray-600">
                            {result.status === "approved"
                              ? "Content meets all compliance requirements and is ready for publication."
                              : result.status === "rejected"
                                ? "Content requires significant changes before approval."
                                : "Content needs minor adjustments for full compliance."}
                          </p>

                          {result.score >= 70 && result.score <= 90 && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-800 mb-3 font-medium">
                                Ready to Submit Directly ASP (Advertising Standards Panel)?
                              </p>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                                onClick={() => {
                                  // Handle ASP submission logic here
                                  console.log("Proceeding to ASP submission for:", result.fileName)
                                }}
                              >
                                Proceed
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Moderation Alert (if flagged) */}
                      {result.moderation?.flagged && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-red-900 text-sm mb-1">Content Moderation Alert</h4>
                          <p className="text-sm text-red-700">
                            This content has been flagged and requires manual review before publication.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No analysis results yet</p>
                  <p className="text-sm mt-2">Upload your materials and start the bulk analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
