import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, transferRef, notes } = body;

    // Get the withdrawal
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
      include: { affiliate: true },
    });

    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { error: "Withdrawal already processed" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Approve and mark as completed
      const updatedWithdrawal = await prisma.$transaction(async (tx) => {
        // Update withdrawal status
        const updated = await tx.withdrawal.update({
          where: { id },
          data: {
            status: "COMPLETED",
            processedBy: session.user.id,
            processedAt: new Date(),
            transferRef,
            notes,
          },
        });

        // Update affiliate balances
        await tx.affiliate.update({
          where: { id: withdrawal.affiliateId },
          data: {
            pendingBalance: {
              decrement: withdrawal.amount,
            },
            paidBalance: {
              increment: withdrawal.amount,
            },
          },
        });

        return updated;
      });

      return NextResponse.json(updatedWithdrawal);
    } else if (action === "reject") {
      // Reject the withdrawal
      const updatedWithdrawal = await prisma.withdrawal.update({
        where: { id },
        data: {
          status: "REJECTED",
          processedBy: session.user.id,
          processedAt: new Date(),
          notes,
        },
      });

      return NextResponse.json(updatedWithdrawal);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Withdrawal update error:", error);
    return NextResponse.json(
      { error: "Failed to update withdrawal" },
      { status: 500 }
    );
  }
}
