"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MousePointer,
  CalendarCheck,
  Wallet,
  TrendingUp,
  Copy,
  Check,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface Affiliate {
  id: string;
  referralCode: string;
  commissionRate: string;
  totalEarned: string;
  pendingBalance: string;
  paidBalance: string;
  totalClicks: number;
  totalBookings: number;
  isActive: boolean;
  bookings: Array<{
    id: string;
    total: string;
    commissionPaid: string;
    createdAt: string;
    status: string;
  }>;
}

const statusLabels: Record<string, string> = {
  PENDING: "รอยืนยัน",
  CONFIRMED: "ยืนยันแล้ว",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
};

export default function AgentDashboardPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const copyReferralLink = () => {
    if (!affiliate) return;
    const link = `${window.location.origin}?ref=${affiliate.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <h2 className="text-2xl font-bold mb-4">ยังไม่ได้ลงทะเบียนเป็นตัวแทน</h2>
        <p className="text-muted-foreground mb-6">
          สมัครเป็นตัวแทนเพื่อรับค่าคอมมิชชั่นจากการแนะนำลูกค้า
        </p>
        <RegisterButton onSuccess={() => window.location.reload()} />
      </div>
    );
  }

  const conversionRate =
    affiliate.totalClicks > 0
      ? ((affiliate.totalBookings / affiliate.totalClicks) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">ยินดีต้อนรับ ตัวแทนของเรา</p>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm opacity-80">Referral Code ของคุณ</p>
              <p className="text-2xl font-bold font-mono">{affiliate.referralCode}</p>
            </div>
            <Button
              variant="secondary"
              onClick={copyReferralLink}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  คัดลอกแล้ว!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  คัดลอกลิงก์
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              จำนวนคลิก
            </CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliate.totalClicks}</div>
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
            <div className="text-2xl font-bold">{affiliate.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รายได้รอถอน
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {Number(affiliate.pendingBalance).toLocaleString()} ฿
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Earnings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>สรุปรายได้</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">อัตราคอมมิชชั่น</span>
              <span className="font-bold">{affiliate.commissionRate}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">รายได้ทั้งหมด</span>
              <span className="font-bold">
                {Number(affiliate.totalEarned).toLocaleString()} ฿
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">รอถอน</span>
              <span className="font-bold text-primary">
                {Number(affiliate.pendingBalance).toLocaleString()} ฿
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">ถอนแล้ว</span>
              <span className="font-bold">
                {Number(affiliate.paidBalance).toLocaleString()} ฿
              </span>
            </div>

            <Button asChild className="w-full mt-4">
              <Link href="/agent/withdraw">ถอนเงิน</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Referral Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>การจองล่าสุด</CardTitle>
            <Link
              href="/agent/earnings"
              className="text-sm text-primary hover:underline flex items-center"
            >
              ดูทั้งหมด
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {affiliate.bookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                ยังไม่มีการจองจากลิงก์ของคุณ
              </p>
            ) : (
              <div className="space-y-4">
                {affiliate.bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(booking.createdAt).toLocaleDateString("th-TH")}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {statusLabels[booking.status]}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        ยอดจอง: {Number(booking.total).toLocaleString()} ฿
                      </p>
                      <p className="text-sm font-medium text-primary">
                        +{Number(booking.commissionPaid).toLocaleString()} ฿
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

// Register Button Component
function RegisterButton({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/me", { method: "POST" });
      if (res.ok) {
        onSuccess();
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleRegister} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          กำลังลงทะเบียน...
        </>
      ) : (
        "สมัครเป็นตัวแทน"
      )}
    </Button>
  );
}
