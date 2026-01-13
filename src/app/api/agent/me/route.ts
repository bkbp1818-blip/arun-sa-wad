import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Get current user's affiliate info
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        bookings: {
          select: {
            id: true,
            total: true,
            commissionPaid: true,
            createdAt: true,
            status: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        withdrawals: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error("Error fetching affiliate:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate data" },
      { status: 500 }
    );
  }
}

// Register as affiliate
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already an affiliate
    const existing = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Generate unique referral code
    const referralCode = `REF${session.user.id.slice(0, 6).toUpperCase()}`;

    // Create affiliate
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: session.user.id,
        referralCode,
      },
    });

    // Update user role to AGENT
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "AGENT" },
    });

    return NextResponse.json(affiliate, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate:", error);
    return NextResponse.json(
      { error: "Failed to register as affiliate" },
      { status: 500 }
    );
  }
}
