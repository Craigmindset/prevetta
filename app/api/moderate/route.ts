// app/api/moderate/route.ts
import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // ensure Buffer is available server-side

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type AnalysisResult = {
  score?: number;
  status: "approved" | "rejected" | "needs_review";
  preVetting: string;
  recommendations: string[];
  copyrightIssues: Array<{ description: string; referenceLink?: string }>;
  summary: string;
  issues?: Array<{
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    message: string;
  }>;
  transcription?: string;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "creative";
    const transcription = (formData.get("transcription") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Basic guardrails
    const MAX_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 413 }
      );
    }

    let analysisResult: AnalysisResult = {
      status: "approved",
      preVetting:
        "Content has been analyzed for compliance and brand safety standards.",
      recommendations: [],
      copyrightIssues: [],
      summary: "Analysis completed",
    };

    const addARCONContext = () => {
      analysisResult.recommendations.push(
        "Ensure compliance with ARCON advertising standards",
        "Verify cultural appropriateness for Nigerian market",
        "Check for required disclaimers and legal text"
      );
    };

    // ========== IMAGE: strict nudity screening ==========
    if (file.type.startsWith("image/")) {
      // Prepare data URL for multimodal inputs
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      // 1) PRIMARY: OpenAI Moderation API (multimodal) — correct tags: "image_url" / "text"
      const modResp = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: [
          // Optional context as text:
          // { type: "text", text: `Strictly check for any nudity or sexual content in this ${type} image.` },
          {
            type: "image_url",
            image_url: { url: dataUrl },
          },
        ],
      });

      const mod = modResp.results?.[0];
      const categories = (mod?.categories ?? {}) as Record<string, boolean>;
      const categoryScores = (mod?.category_scores ?? {}) as Record<
        string,
        number
      >;

      // Robust detection for any sexual/nudity-related categories (future-proof)
      const flaggedSexualKeys = Object.entries(categories)
        .filter(([k, v]) => v && /sexual|minors|nudity/i.test(k))
        .map(([k]) => k);

      const primaryFlag = !!mod?.flagged || flaggedSexualKeys.length > 0;

      // 2) SECONDARY: Vision “judge” (belt-and-suspenders)
      let secondaryFlag = false;
      let visionJudge: any = null;

      try {
        const judge = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a strict content safety reviewer for advertising. Return ONLY JSON with booleans (explicit_nudity, sexual_activity, partial_nudity, see_through, minors_involved) and a numeric confidence (0-1). If uncertain, mark booleans as true.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Does this ${type} image contain any nudity or sexual content? Be conservative.`,
                },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
        });

        const raw = judge.choices?.[0]?.message?.content || "{}";
        visionJudge = JSON.parse(raw);

        const {
          explicit_nudity = false,
          sexual_activity = false,
          partial_nudity = false,
          see_through = false,
          minors_involved = false,
        } = visionJudge;

        secondaryFlag =
          !!explicit_nudity ||
          !!sexual_activity ||
          !!partial_nudity ||
          !!see_through ||
          !!minors_involved;
      } catch {
        // Parsing/format failure → err on the side of caution
        analysisResult.status = "needs_review";
        analysisResult.issues = [
          ...(analysisResult.issues ?? []),
          {
            type: "safety_fallback",
            severity: "medium",
            message: "Vision judge failed to parse; manual review recommended.",
          },
        ];
      }

      // STRICT decision: if either layer flags → reject
      if (primaryFlag || secondaryFlag) {
        analysisResult.status = "rejected";
        analysisResult.score = 15;
        analysisResult.summary =
          "Nudity/sexual content flagged by automated screening.";
        analysisResult.issues = [
          ...(analysisResult.issues ?? []),
          ...(flaggedSexualKeys.length
            ? flaggedSexualKeys.map((k) => ({
                type: "nudity_violation",
                severity: /minors/i.test(k) ? "critical" : "high",
                message: `Flagged category: ${k.replace(/[_-]/g, " ")}`,
              }))
            : []),
          ...(secondaryFlag
            ? [
                {
                  type: "nudity_violation",
                  severity: "high",
                  message:
                    "Vision judge detected nudity/sexual indicators (explicit_nudity/partial_nudity/see_through/sexual_activity/minors_involved).",
                },
              ]
            : []),
        ];
      } else if (mod?.flagged) {
        // Future-proof catch-all
        analysisResult.status = "rejected";
        analysisResult.score = 25;
        analysisResult.summary = "Content flagged by moderation model.";
        analysisResult.issues = [
          ...(analysisResult.issues ?? []),
          {
            type: "content_moderation",
            severity: "high",
            message: "Model flagged the image for policy risk.",
          },
        ];
      } else {
        analysisResult.status = "approved";
        analysisResult.score = 90;
        analysisResult.summary = "Image cleared by strict nudity screening.";
      }

      addARCONContext();

      return NextResponse.json({
        ...analysisResult,
        moderation: {
          flagged: !!mod?.flagged,
          categories,
          category_scores: categoryScores,
          secondary_judge: visionJudge ?? {},
        },
        file_info: { name: file.name, size: file.size, type: file.type },
      });
    }

    // ========== AUDIO/VIDEO: moderate transcription text ==========
    if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
      if (!transcription.trim()) {
        return NextResponse.json(
          { error: "Transcription required for audio/video files" },
          { status: 400 }
        );
      }

      const modText = await openai.moderations.create({
        model: "omni-moderation-latest",
        input: transcription,
      });
      const m = modText.results?.[0];

      analysisResult = {
        status: m?.flagged ? "rejected" : "approved",
        score: m?.flagged ? 40 : 90,
        preVetting: `${type} content transcription analyzed for compliance and brand safety standards.`,
        recommendations: [],
        copyrightIssues: [],
        summary: m?.flagged
          ? "Transcription failed moderation."
          : "Transcription cleared moderation.",
        transcription,
        issues: m?.flagged
          ? [
              {
                type: "content_moderation",
                severity: "high",
                message: "Transcription contains policy-violating content.",
              },
            ]
          : [],
      };

      addARCONContext();

      return NextResponse.json({
        ...analysisResult,
        moderation: {
          flagged: !!m?.flagged,
          categories: m?.categories ?? {},
          category_scores: m?.category_scores ?? {},
        },
        file_info: { name: file.name, size: file.size, type: file.type },
      });
    }

    // ========== OTHER FILE TYPES ==========
    addARCONContext();
    return NextResponse.json({
      ...analysisResult,
      status: "needs_review",
      score: 60,
      summary:
        "Unsupported file type for automated checks; manual review recommended.",
      file_info: { name: file.name, size: file.size, type: file.type },
    });
  } catch (error) {
    console.error("Moderation error:", error);
    return NextResponse.json(
      {
        error: "Failed to moderate content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
