"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Loader2, Link2, Share2, QrCode } from "lucide-react";

interface Affiliate {
  id: string;
  referralCode: string;
  commissionRate: string;
}

export default function AgentReferralPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่พบข้อมูลตัวแทน</p>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${baseUrl}?ref=${affiliate.referralCode}`;
  const roomsLink = `${baseUrl}/rooms?ref=${affiliate.referralCode}`;
  const toursLink = `${baseUrl}/tours?ref=${affiliate.referralCode}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ลิงก์แนะนำ</h1>
        <p className="text-muted-foreground">
          แชร์ลิงก์เพื่อรับค่าคอมมิชชั่น {affiliate.commissionRate}% จากทุกการจอง
        </p>
      </div>

      {/* Main Referral Code */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm opacity-80 mb-2">Referral Code ของคุณ</p>
              <p className="text-4xl font-bold font-mono tracking-wider">
                {affiliate.referralCode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              ลิงก์หน้าหลัก
            </CardTitle>
            <CardDescription>ลิงก์ไปยังหน้าหลักของเว็บไซต์</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(referralLink, "main")}
              >
                {copied === "main" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              ลิงก์หน้าห้องพัก
            </CardTitle>
            <CardDescription>ลิงก์ตรงไปยังหน้าห้องพัก</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={roomsLink} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(roomsLink, "rooms")}
              >
                {copied === "rooms" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              ลิงก์หน้าทัวร์
            </CardTitle>
            <CardDescription>ลิงก์ตรงไปยังหน้าทัวร์</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={toursLink} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(toursLink, "tours")}
              >
                {copied === "tours" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            วิธีใช้งาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>คัดลอกลิงก์ที่ต้องการแชร์</li>
            <li>ส่งให้เพื่อนหรือโพสต์บนโซเชียลมีเดีย</li>
            <li>เมื่อมีคนจองผ่านลิงก์ของคุณ คุณจะได้รับค่าคอมมิชชั่น {affiliate.commissionRate}%</li>
            <li>ค่าคอมมิชชั่นจะถูกเพิ่มเข้ายอดรอถอนหลังการจองเสร็จสมบูรณ์</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
