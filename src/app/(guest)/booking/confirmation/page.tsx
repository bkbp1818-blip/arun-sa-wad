"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2, Calendar, User, Mail, Phone } from "lucide-react";

interface BookingItem {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: {
    id: string;
    name: string;
    nameTh: string;
    type: string;
  };
}

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  subtotal: string;
  total: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  specialRequests: string | null;
  createdAt: string;
  items: BookingItem[];
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setError("ไม่พบหมายเลขการจอง");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/bookings/my");
        if (res.ok) {
          const bookings: Booking[] = await res.json();
          const found = bookings.find((b) => b.id === bookingId);
          if (found) {
            setBooking(found);
          } else {
            setError("ไม่พบการจองนี้");
          }
        } else {
          setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
      } catch {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="py-12 text-center">
            <p className="text-destructive mb-4">{error || "ไม่พบข้อมูลการจอง"}</p>
            <Button asChild>
              <Link href="/">กลับหน้าหลัก</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusLabels: Record<string, string> = {
    PENDING: "รอการยืนยัน",
    CONFIRMED: "ยืนยันแล้ว",
    CHECKED_IN: "เช็คอินแล้ว",
    COMPLETED: "เสร็จสิ้น",
    CANCELLED: "ยกเลิก",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">จองสำเร็จ!</h1>
          <p className="text-muted-foreground">
            ขอบคุณสำหรับการจอง เราจะติดต่อกลับเร็วๆ นี้
          </p>
        </div>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายละเอียดการจอง</CardTitle>
              <Badge variant={booking.status === "PENDING" ? "secondary" : "default"}>
                {statusLabels[booking.status] || booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Number */}
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">หมายเลขการจอง</p>
              <p className="text-2xl font-bold font-mono">{booking.bookingNumber}</p>
            </div>

            {/* Guest Info */}
            <div className="space-y-2">
              <h4 className="font-semibold">ข้อมูลผู้จอง</h4>
              {booking.guestName && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guestName}</span>
                </div>
              )}
              {booking.guestEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guestEmail}</span>
                </div>
              )}
              {booking.guestPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guestPhone}</span>
                </div>
              )}
            </div>

            {/* Dates */}
            {(booking.checkIn || booking.checkOut) && (
              <div className="space-y-2">
                <h4 className="font-semibold">วันที่เข้าพัก</h4>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.checkIn
                      ? new Date(booking.checkIn).toLocaleDateString("th-TH", {
                          dateStyle: "long",
                        })
                      : "-"}{" "}
                    -{" "}
                    {booking.checkOut
                      ? new Date(booking.checkOut).toLocaleDateString("th-TH", {
                          dateStyle: "long",
                        })
                      : "-"}
                  </span>
                </div>
              </div>
            )}

            <Separator />

            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-semibold">รายการที่จอง</h4>
              {booking.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product.nameTh} x{item.quantity}
                  </span>
                  <span>{Number(item.totalPrice).toLocaleString()} ฿</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between font-bold text-lg">
              <span>รวมทั้งหมด</span>
              <span className="text-primary">{Number(booking.total).toLocaleString()} ฿</span>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">คำขอพิเศษ</p>
                <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/my-bookings">ดูการจองทั้งหมด</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/">กลับหน้าหลัก</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
