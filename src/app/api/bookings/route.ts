import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface BookingItemInput {
  productId: string;
  quantity: number;
  checkIn?: string;
  checkOut?: string;
  serviceDate?: string;
  notes?: string;
}

interface CreateBookingInput {
  items: BookingItemInput[];
  guestName?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
  affiliateId?: string;
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: CreateBookingInput = await request.json();
    const { items, guestName, email, phone, specialRequests, affiliateId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in booking" },
        { status: 400 }
      );
    }

    // Fetch products to get prices
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products not found" },
        { status: 400 }
      );
    }

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Get checkIn/checkOut from first item (for room bookings)
    const firstItem = items[0];
    const checkIn = firstItem.checkIn;
    const checkOut = firstItem.checkOut;

    // Calculate totals with product prices from database
    const subtotal = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      if (!product) return sum;
      return sum + Number(product.price) * item.quantity;
    }, 0);
    const total = subtotal; // No discount for now

    // Validate affiliate and get commission rate
    let validAffiliateId: string | null = null;
    let commissionRate = 0;

    if (affiliateId) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { id: affiliateId },
      });

      if (affiliate && affiliate.isActive) {
        validAffiliateId = affiliate.id;
        commissionRate = Number(affiliate.commissionRate);
      }
    }

    // Calculate commission
    const commissionPaid = validAffiliateId ? (total * commissionRate) / 100 : 0;

    // Create booking with items in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          user: { connect: { id: session.user.id } },
          checkIn: checkIn ? new Date(checkIn) : null,
          checkOut: checkOut ? new Date(checkOut) : null,
          subtotal,
          total,
          guestName,
          guestEmail: email,
          guestPhone: phone,
          specialRequests,
          affiliate: validAffiliateId ? { connect: { id: validAffiliateId } } : undefined,
          commissionPaid,
        },
      });

      // Create booking items
      await tx.bookingItem.createMany({
        data: items.map((item) => {
          const product = productMap.get(item.productId);
          const unitPrice = product ? Number(product.price) : 0;
          return {
            bookingId: newBooking.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice,
            totalPrice: unitPrice * item.quantity,
            serviceDate: item.serviceDate ? new Date(item.serviceDate) : null,
            notes: item.notes,
          };
        }),
      });

      // Update affiliate stats if applicable
      if (validAffiliateId) {
        await tx.affiliate.update({
          where: { id: validAffiliateId },
          data: {
            totalBookings: { increment: 1 },
            totalEarned: { increment: commissionPaid },
            pendingBalance: { increment: commissionPaid },
          },
        });
      }

      // Return booking with items
      return tx.booking.findUnique({
        where: { id: newBooking.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
