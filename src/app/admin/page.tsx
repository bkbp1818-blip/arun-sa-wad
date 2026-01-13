"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Package,
  Users,
  Banknote,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { BookingSourceChart } from "@/components/admin/BookingSourceChart";
import { TopProductsChart } from "@/components/admin/TopProductsChart";

interface DashboardData {
  stats: {
    totalBookings: number;
    pendingBookings: number;
    totalProducts: number;
    totalUsers: number;
    totalRevenue: number;
  };
  recentBookings: Array<{
    id: string;
    bookingNumber: string;
    status: string;
    total: string;
    createdAt: string;
    user: { name: string | null; email: string | null };
    items: Array<{
      product: { nameTh: string; type: string };
    }>;
  }>;
  bookingsByStatus: Array<{ status: string; count: number }>;
  revenueBreakdown: Record<string, number>;
  dailyRevenue: Array<{ date: string; room: number; upsell: number }>;
  bookingSource: Array<{ name: string; value: number }>;
  topProducts: Array<{ name: string; revenue: number }>;
}

const statusLabels: Record<string, string> = {
  PENDING: "รอยืนยัน",
  CONFIRMED: "ยืนยันแล้ว",
  CHECKED_IN: "เช็คอินแล้ว",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CHECKED_IN: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

const typeLabels: Record<string, string> = {
  ROOM: "ห้องพัก",
  TOUR: "ทัวร์",
  FOOD: "อาหาร",
  SERVICE: "บริการ",
  MERCH: "ของฝาก",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่สามารถโหลดข้อมูลได้</p>
      </div>
    );
  }

  const { stats, recentBookings, revenueBreakdown, dailyRevenue, bookingSource, topProducts } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">ภาพรวมธุรกิจของคุณ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รายได้รวม
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString()} ฿
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              การจองทั้งหมด
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            {stats.pendingBookings > 0 && (
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-500">{stats.pendingBookings}</span> รอยืนยัน
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              สินค้า/บริการ
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ผู้ใช้ทั้งหมด
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>รายได้ 7 วันล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={dailyRevenue} />
          </CardContent>
        </Card>

        {/* Booking Source Chart */}
        <Card>
          <CardHeader>
            <CardTitle>แหล่งที่มาการจอง</CardTitle>
          </CardHeader>
          <CardContent>
            {bookingSource.some((b) => b.value > 0) ? (
              <BookingSourceChart data={bookingSource} />
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                ยังไม่มีข้อมูล
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>สินค้าขายดี</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <TopProductsChart data={topProducts} />
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                ยังไม่มีข้อมูล
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>รายได้แยกตามประเภท</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueBreakdown).map(([type, amount]) => {
                const total = Object.values(revenueBreakdown).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (amount / total) * 100 : 0;

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{typeLabels[type] || type}</span>
                      <span className="font-medium">{amount.toLocaleString()} ฿</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>การจองล่าสุด</CardTitle>
            <Link
              href="/admin/bookings"
              className="text-sm text-primary hover:underline flex items-center"
            >
              ดูทั้งหมด
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">ยังไม่มีการจอง</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {booking.user.name || booking.user.email || "Guest"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(booking.createdAt).toLocaleDateString("th-TH")}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={statusColors[booking.status]}>
                        {statusLabels[booking.status]}
                      </Badge>
                      <p className="text-sm font-medium">
                        {Number(booking.total).toLocaleString()} ฿
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
