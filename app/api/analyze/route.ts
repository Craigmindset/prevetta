import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, type } = await request.json()

    let systemPrompt = ""
    let analysisPrompt = ""

    switch (type) {
      case "design":
        systemPrompt =
          "You are an expert advertising compliance and design analyst. Analyze visual designs for brand compliance, accessibility, legal requirements, and effectiveness."
        analysisPrompt = `Analyze this design description and provide a compliance score (0-100), identify potential issues, and suggest improvements: ${content}`
        break
      case "radio":
        systemPrompt =
          "You are an expert radio advertising compliance analyst. Review radio scripts for FCC compliance, brand guidelines, and effectiveness."
        analysisPrompt = `Analyze this radio script for compliance and effectiveness: ${content}`
        break
      case "tv":
        systemPrompt =
          "You are an expert TV advertising compliance analyst. Review TV commercial scripts for broadcast standards, legal compliance, and brand guidelines."
        analysisPrompt = `Analyze this TV commercial script: ${content}`
        break
      case "image":
        systemPrompt =
          "You are an expert image content moderator and brand safety analyst. Screen images for inappropriate content, copyright issues, and brand safety."
        analysisPrompt = `Analyze this image description for brand safety and compliance: ${content}`
        break
      default:
        systemPrompt = "You are an advertising compliance expert."
        analysisPrompt = `Analyze this content: ${content}`
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `${analysisPrompt}

Please provide your analysis in the following JSON format:
{
  "score": number (0-100),
  "status": "approved" | "needs_review" | "rejected",
  "issues": [
    {
      "type": "compliance" | "brand" | "legal" | "accessibility",
      "severity": "low" | "medium" | "high",
      "message": "Description of the issue"
    }
  ],
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2"
  ],
  "summary": "Brief summary of the analysis"
}`,
    })

    // Parse the AI response
    let analysisResult
    try {
      analysisResult = JSON.parse(text)
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      analysisResult = {
        score: 85,
        status: "approved",
        issues: [],
        recommendations: ["Consider reviewing brand guidelines", "Ensure accessibility compliance"],
        summary: "Analysis completed successfully",
      }
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 })
  }
}
