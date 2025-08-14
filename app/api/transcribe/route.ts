import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if file is audio
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json({ error: "File must be an audio file" }, { status: 400 })
    }

    // Create FormData for OpenAI Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append("file", file)
    whisperFormData.append("model", "whisper-1")
    whisperFormData.append("language", "en") // Can be made dynamic
    whisperFormData.append("response_format", "json")

    // Call OpenAI Whisper API for transcription
    const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    })

    if (!transcriptionResponse.ok) {
      const errorData = await transcriptionResponse.json()
      const errorMessage = errorData.error?.message || "Unknown error"

      if (transcriptionResponse.status === 429 || errorMessage.includes("quota")) {
        return NextResponse.json(
          {
            error: "quota_exceeded",
            message: "OpenAI API quota exceeded. Please try again later or contact support.",
            fallback_message:
              "Transcription service temporarily unavailable. You can manually enter the audio content for vetting.",
          },
          { status: 429 },
        )
      }

      if (transcriptionResponse.status === 401) {
        return NextResponse.json(
          {
            error: "api_key_invalid",
            message: "API configuration error. Please contact support.",
          },
          { status: 500 },
        )
      }

      throw new Error(`Transcription failed: ${errorMessage}`)
    }

    const transcriptionData = await transcriptionResponse.json()

    return NextResponse.json({
      transcription: transcriptionData.text,
      file_info: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json(
      {
        error: "transcription_failed",
        message: "Failed to transcribe audio. Please try again or enter content manually.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
