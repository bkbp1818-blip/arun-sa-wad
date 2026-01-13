"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users } from "lucide-react";

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
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliates() {
      try {
        const res = await fetch("/api/admin/affiliates");
        if (res.ok) {
          const data = await res.json();
          setAffiliates(data);
        }
      } catch (error) {
        console.error("Failed to fetch affiliates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAffiliates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ตัวแทน (Affiliates)</h1>
        <p className="text-muted-foreground">จัดการตัวแทนและค่าคอมมิชชั่น</p>
      </div>

      {affiliates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีตัวแทน</h3>
            <p className="text-muted-foreground">
              เมื่อมีผู้ใช้สมัครเป็นตัวแทน จะแสดงที่นี่
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">ตัวแทน</th>
                    <th className="text-left p-4 font-medium">Referral Code</th>
                    <th className="text-left p-4 font-medium">Clicks</th>
                    <th className="text-left p-4 font-medium">Bookings</th>
                    <th className="text-left p-4 font-medium">รายได้รวม</th>
                    <th className="text-left p-4 font-medium">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="border-t">
                      <td className="p-4">
                        <p className="font-medium">
                          {affiliate.user.name || "No name"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {affiliate.user.email}
                        </p>
                      </td>
                      <td className="p-4 font-mono text-sm">
                        {affiliate.referralCode}
                      </td>
                      <td className="p-4">{affiliate.totalClicks}</td>
                      <td className="p-4">{affiliate.totalBookings}</td>
                      <td className="p-4 font-medium">
                        {Number(affiliate.totalEarned).toLocaleString()} ฿
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={affiliate.isActive ? "default" : "secondary"}
                        >
                          {affiliate.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
