"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet, TrendingUp } from "lucide-react";

interface Booking {
  id: string;
  total: string;
  commissionPaid: string;
  createdAt: string;
  status: string;
}

interface Affiliate {
  id: string;
  commissionRate: string;
  totalEarned: string;
  pendingBalance: string;
  paidBalance: string;
  totalBookings: number;
  bookings: Booking[];
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

export default function AgentEarningsPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliate() {
      try {
        const res = await fetch("/api/agent/me");
        if (res.ok) {
          const data = await res.json();
          setAffiliate(data);
        }
      } catch (error) {
        console.error("Failed to fetch affiliate:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliate();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่พบข้อมูลตัวแทน</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">รายได้</h1>
        <p className="text-muted-foreground">
          รายงานค่าคอมมิชชั่นจากการแนะนำลูกค้า
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รายได้ทั้งหมด
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(affiliate.totalEarned).toLocaleString()} ฿
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              จาก {affiliate.totalBookings} การจอง
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รอถอน
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Number(affiliate.pendingBalance).toLocaleString()} ฿
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ถอนแล้ว
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(affiliate.paidBalance).toLocaleString()} ฿
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle>ประวัติรายได้</CardTitle>
        </CardHeader>
        <CardContent>
          {affiliate.bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              ยังไม่มีรายได้
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">วันที่</th>
                    <th className="text-left p-4 font-medium">ยอดจอง</th>
                    <th className="text-left p-4 font-medium">ค่าคอมมิชชั่น</th>
                    <th className="text-left p-4 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliate.bookings.map((booking) => (
                    <tr key={booking.id} className="border-t">
                      <td className="p-4 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4">
                        {Number(booking.total).toLocaleString()} ฿
                      </td>
                      <td className="p-4 font-medium text-primary">
                        +{Number(booking.commissionPaid).toLocaleString()} ฿
                      </td>
                      <td className="p-4">
                        <Badge variant={statusColors[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Rate Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">อัตราค่าคอมมิชชั่นของคุณ</p>
              <p className="text-2xl font-bold text-primary">
                {affiliate.commissionRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
