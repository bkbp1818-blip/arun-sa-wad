import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Request withdrawal
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    // Get affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json(
        { error: "Not registered as affiliate" },
        { status: 400 }
      );
    }

    // Check if has enough balance
    if (Number(affiliate.pendingBalance) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Create withdrawal request
    const withdrawal = await prisma.$transaction(async (tx) => {
      // Create withdrawal
      const newWithdrawal = await tx.withdrawal.create({
        data: {
          affiliateId: affiliate.id,
          amount,
        },
      });

      // Update affiliate balance
      await tx.affiliate.update({
        where: { id: affiliate.id },
        data: {
          pendingBalance: {
            decrement: amount,
          },
        },
      });

      return newWithdrawal;
    });

    return NextResponse.json(withdrawal, { status: 201 });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return NextResponse.json(
      { error: "Failed to create withdrawal request" },
      { status: 500 }
    );
  }
}

// Get withdrawal history
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    });

    if (!affiliate) {
      return NextResponse.json([]);
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
