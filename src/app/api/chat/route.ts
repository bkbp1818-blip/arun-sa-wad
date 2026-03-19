import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { checkRateLimit } from "@/lib/chat/rate-limiter";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Chatbot ยังไม่พร้อมใช้งาน กรุณาติดต่อโรงแรมโดยตรง" },
        { status: 503 }
      );
    }

    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history: ChatMessage[];
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "กรุณาพิมพ์ข้อความ" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "ข้อความยาวเกินไป (สูงสุด 1000 ตัวอักษร)" },
        { status: 400 }
      );
    }

    // Build system prompt with product data
    const systemPrompt = await buildSystemPrompt();

    // Prepare conversation history (limit to last 10 messages)
    const messages: ChatMessage[] = [
      ...(history || []).slice(-10),
      { role: "user", content: message.trim() },
    ];

    // Call Claude Haiku
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const assistantMessage =
      response.content[0]?.type === "text"
        ? response.content[0].text
        : "ขออภัย ไม่สามารถตอบได้ในขณะนี้ กรุณาติดต่อโรงแรมโดยตรง";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อโรงแรมโดยตรง" },
      { status: 500 }
    );
  }
}
