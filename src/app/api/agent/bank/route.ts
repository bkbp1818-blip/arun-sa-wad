import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Update bank info
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bankName, bankAccount, bankAccountName } = body;

    const affiliate = await prisma.affiliate.update({
      where: { userId: session.user.id },
      data: {
        bankName,
        bankAccount,
        bankAccountName,
      },
    });

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error("Error updating bank info:", error);
    return NextResponse.json(
      { error: "Failed to update bank info" },
      { status: 500 }
    );
  }
}
