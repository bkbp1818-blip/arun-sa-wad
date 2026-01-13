import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

// PromptPay ID (เบอร์โทรหรือเลขบัตรประชาชน)
const PROMPTPAY_ID = process.env.PROMPTPAY_ID || "0812345678";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Get booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { items: { include: { product: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user owns this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if already paid
    if (booking.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      );
    }

    const amount = Number(booking.total);

    // Generate PromptPay payload
    const payload = generatePayload(PROMPTPAY_ID, { amount });

    // Generate QR Code as base64
    const qrCodeDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      amount,
      bookingNumber: booking.bookingNumber,
      promptPayId: PROMPTPAY_ID,
    });
  } catch (error) {
    console.error("Error generating PromptPay QR:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
