import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last 7 days date range
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Get stats
    const [
      totalBookings,
      pendingBookings,
      totalProducts,
      totalUsers,
      recentBookings,
      bookingsByStatus,
      revenueByType,
      bookingsLast7Days,
      directBookings,
      affiliateBookings,
      topProducts,
    ] = await Promise.all([
      // Total bookings
      prisma.booking.count(),

      // Pending bookings
      prisma.booking.count({
        where: { status: "PENDING" },
      }),

      // Total products
      prisma.product.count({
        where: { isActive: true },
      }),

      // Total users
      prisma.user.count(),

      // Recent bookings
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true },
          },
          items: {
            include: {
              product: {
                select: { nameTh: true, type: true },
              },
            },
          },
        },
      }),

      // Bookings by status
      prisma.booking.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Revenue by product type
      prisma.bookingItem.groupBy({
        by: ["productId"],
        _sum: { totalPrice: true },
      }),

      // Bookings last 7 days with items
      prisma.booking.findMany({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
        include: {
          items: {
            include: {
              product: {
                select: { type: true },
              },
            },
          },
        },
      }),

      // Direct bookings count
      prisma.booking.count({
        where: { affiliateId: null },
      }),

      // Affiliate bookings count
      prisma.booking.count({
        where: { affiliateId: { not: null } },
      }),

      // Top products by revenue
      prisma.bookingItem.groupBy({
        by: ["productId"],
        _sum: { totalPrice: true },
        orderBy: { _sum: { totalPrice: "desc" } },
        take: 5,
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = await prisma.booking.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    });

    // Get revenue breakdown by product type
    const productTypes = await prisma.product.findMany({
      select: { id: true, type: true, nameTh: true },
    });

    const typeMap = new Map(productTypes.map((p) => [p.id, p.type]));
    const nameMap = new Map(productTypes.map((p) => [p.id, p.nameTh]));

    const revenueBreakdown: Record<string, number> = {
      ROOM: 0,
      TOUR: 0,
      FOOD: 0,
      SERVICE: 0,
      MERCH: 0,
    };

    revenueByType.forEach((item) => {
      const type = typeMap.get(item.productId);
      if (type && item._sum.totalPrice) {
        revenueBreakdown[type] += Number(item._sum.totalPrice);
      }
    });

    // Calculate daily revenue for chart (last 7 days)
    const dailyRevenueMap = new Map<string, { room: number; upsell: number }>();

    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString("th-TH", { day: "2-digit", month: "short" });
      dailyRevenueMap.set(dateStr, { room: 0, upsell: 0 });
    }

    // Fill in actual data
    bookingsLast7Days.forEach((booking) => {
      const dateStr = new Date(booking.createdAt).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "short",
      });

      const dayData = dailyRevenueMap.get(dateStr);
      if (dayData) {
        booking.items.forEach((item) => {
          const amount = Number(item.totalPrice);
          if (item.product.type === "ROOM") {
            dayData.room += amount;
          } else {
            dayData.upsell += amount;
          }
        });
      }
    });

    const dailyRevenue = Array.from(dailyRevenueMap.entries()).map(([date, data]) => ({
      date,
      room: data.room,
      upsell: data.upsell,
    }));

    // Booking source data
    const bookingSource = [
      { name: "จองตรง", value: directBookings },
      { name: "ตัวแทน", value: affiliateBookings },
    ];

    // Top products data
    const topProductsData = topProducts.map((item) => ({
      name: nameMap.get(item.productId) || "Unknown",
      revenue: Number(item._sum.totalPrice) || 0,
    }));

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingBookings,
        totalProducts,
        totalUsers,
        totalRevenue: Number(totalRevenue._sum.total) || 0,
      },
      recentBookings,
      bookingsByStatus: bookingsByStatus.map((b) => ({
        status: b.status,
        count: b._count.id,
      })),
      revenueBreakdown,
      // Chart data
      dailyRevenue,
      bookingSource,
      topProducts: topProductsData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
