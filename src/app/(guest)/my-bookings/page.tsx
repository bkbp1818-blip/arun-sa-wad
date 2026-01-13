"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Calendar, ClipboardList } from "lucide-react";

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
  createdAt: string;
  items: BookingItem[];
}

const statusLabels: Record<string, string> = {
  PENDING: "รอการยืนยัน",
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

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchBookings() {
      if (status !== "authenticated") return;

      try {
        const res = await fetch("/api/bookings/my");
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">การจองของฉัน</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ยังไม่มีการจอง</h3>
            <p className="text-muted-foreground mb-4">
              เริ่มต้นทริปเยาวราชของคุณวันนี้
            </p>
            <Button asChild>
              <Link href="/rooms">ดูห้องพัก</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">หมายเลขการจอง</p>
                    <CardTitle className="font-mono">{booking.bookingNumber}</CardTitle>
                  </div>
                  <Badge variant={statusColors[booking.status] || "secondary"}>
                    {statusLabels[booking.status] || booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dates */}
                {(booking.checkIn || booking.checkOut) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.checkIn
                        ? new Date(booking.checkIn).toLocaleDateString("th-TH")
                        : "-"}{" "}
                      -{" "}
                      {booking.checkOut
                        ? new Date(booking.checkOut).toLocaleDateString("th-TH")
                        : "-"}
                    </span>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2">
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

                {/* Total & Date */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    จองเมื่อ{" "}
                    {new Date(booking.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="font-bold text-primary">
                    {Number(booking.total).toLocaleString()} ฿
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
