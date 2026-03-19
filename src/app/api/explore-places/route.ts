import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public API - no auth required
export async function GET() {
  try {
    const places = await prisma.explorePlace.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(places);
  } catch (error) {
    console.error("Error fetching explore places:", error);
    return NextResponse.json(
      { error: "Failed to fetch explore places" },
      { status: 500 }
    );
  }
}
