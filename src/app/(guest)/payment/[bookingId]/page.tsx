"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Clock, Copy, Check } from "lucide-react";

interface PaymentData {
  qrCode: string;
  amount: number;
  bookingNumber: string;
  promptPayId: string;
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function generateQR() {
      try {
        const res = await fetch("/api/payment/promptpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to generate QR");
        }

        const data = await res.json();
        setPaymentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }

    generateQR();
  }, [bookingId]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.push("/my-bookings")}>
              กลับไปหน้าการจอง
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ชำระเงินด้วย PromptPay</CardTitle>
            <p className="text-muted-foreground">
              สแกน QR Code เพื่อชำระเงิน
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Info */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">หมายเลขการจอง</p>
              <p className="font-mono font-semibold">
                {paymentData?.bookingNumber}
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-inner">
                {paymentData?.qrCode && (
                  <Image
                    src={paymentData.qrCode}
                    alt="PromptPay QR Code"
                    width={250}
                    height={250}
                    className="mx-auto"
                  />
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">ยอดที่ต้องชำระ</p>
              <p className="text-4xl font-bold text-primary">
                ฿{paymentData?.amount.toLocaleString()}
              </p>
            </div>

            {/* PromptPay ID */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center mb-2">
                หรือโอนเงินไปที่ PromptPay
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-lg">
                  {paymentData?.promptPayId}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(paymentData?.promptPayId || "")
                  }
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1">
                  <span className="text-primary font-semibold text-xs w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                </div>
                <p>เปิดแอปธนาคารบนมือถือของคุณ</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1">
                  <span className="text-primary font-semibold text-xs w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </div>
                <p>เลือก &quot;สแกน QR&quot; หรือ &quot;PromptPay&quot;</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1">
                  <span className="text-primary font-semibold text-xs w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </div>
                <p>สแกน QR Code ด้านบน หรือใส่หมายเลข PromptPay</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-1">
                  <span className="text-primary font-semibold text-xs w-5 h-5 flex items-center justify-center">
                    4
                  </span>
                </div>
                <p>ยืนยันการโอนเงินและรอการตรวจสอบ</p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">รอการตรวจสอบ</p>
                <p className="text-sm text-yellow-700">
                  หลังโอนเงินแล้ว กรุณารอ 5-10 นาที เพื่อตรวจสอบยอดชำระ
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/my-bookings")}
              >
                ดูการจองของฉัน
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push("/")}
              >
                กลับหน้าหลัก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
