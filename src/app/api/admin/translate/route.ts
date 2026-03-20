import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { texts, targetLang } = body as {
      texts: { text: string; field: string }[];
      targetLang: string;
    };

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "No texts provided" }, { status: 400 });
    }

    // Filter out empty texts
    const validTexts = texts.filter((t) => t.text && t.text.trim().length > 0);
    if (validTexts.length === 0) {
      return NextResponse.json({ translations: {} });
    }

    const langMap: Record<string, string> = {
      zh: "Chinese (Simplified)",
      en: "English",
      th: "Thai",
    };

    const targetLangName = langMap[targetLang] || "Chinese (Simplified)";

    const textsForTranslation = validTexts
      .map((t) => `"${t.field}": "${t.text}"`)
      .join(",\n");

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Translate the following texts to ${targetLangName}. Return ONLY a JSON object with the same keys but translated values. No explanation, no markdown, just pure JSON.

Input:
{${textsForTranslation}}`,
        },
      ],
    });

    const responseText =
      response.content[0]?.type === "text" ? response.content[0].text : "{}";

    // Parse the JSON response
    let translations: Record<string, string> = {};
    try {
      // Remove potential markdown code blocks
      const cleaned = responseText.replace(/```json?\n?|\n?```/g, "").trim();
      translations = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse translation response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse translation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
