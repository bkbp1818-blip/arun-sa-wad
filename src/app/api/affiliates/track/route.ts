import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
    }

    // Find the affiliate by referral code
    const affiliate = await prisma.affiliate.findUnique({
      where: { referralCode: code },
    });

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
    }

    // Increment click count
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalClicks: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, affiliateId: affiliate.id });
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json(
      { error: "Failed to track click" },
      { status: 500 }
    );
  }
}
