"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, Eye, Calendar, User, Mail, Phone } from "lucide-react";

interface BookingItem {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: {
    name: string;
    nameTh: string;
    type: string;
  };
}

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  paymentStatus: string;
  checkIn: string | null;
  checkOut: string | null;
  subtotal: string;
  total: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  specialRequests: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null; phone: string | null };
  items: BookingItem[];
}

const statusLabels: Record<string, string> = {
  PENDING: "รอยืนยัน",
  CONFIRMED: "ยืนยันแล้ว",
  CHECKED_IN: "เช็คอินแล้ว",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
};

const paymentLabels: Record<string, string> = {
  UNPAID: "ยังไม่ชำระ",
  PAID: "ชำระแล้ว",
  REFUNDED: "คืนเงินแล้ว",
  PARTIAL: "ชำระบางส่วน",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  CHECKED_IN: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/admin/bookings");
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

  async function updateBookingStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings(bookings.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking?.id === id) {
          setSelectedBooking(updated);
        }
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  }

  async function updatePaymentStatus(id: string, paymentStatus: string) {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setBookings(bookings.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking?.id === id) {
          setSelectedBooking(updated);
        }
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      booking.guestName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      booking.user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <h1 className="text-3xl font-bold">การจอง</h1>
        <p className="text-muted-foreground">จัดการและติดตามการจองทั้งหมด</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาหมายเลขจอง, ชื่อ, อีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="PENDING">รอยืนยัน</SelectItem>
            <SelectItem value="CONFIRMED">ยืนยันแล้ว</SelectItem>
            <SelectItem value="CHECKED_IN">เช็คอินแล้ว</SelectItem>
            <SelectItem value="COMPLETED">เสร็จสิ้น</SelectItem>
            <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">หมายเลข</th>
                  <th className="text-left p-4 font-medium">ลูกค้า</th>
                  <th className="text-left p-4 font-medium">วันที่</th>
                  <th className="text-left p-4 font-medium">ยอดรวม</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-left p-4 font-medium">ชำระเงิน</th>
                  <th className="text-right p-4 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      ไม่พบการจอง
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-t">
                      <td className="p-4">
                        <span className="font-mono text-sm">
                          {booking.bookingNumber.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">
                          {booking.guestName || booking.user.name || "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.guestEmail || booking.user.email}
                        </p>
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="p-4 font-medium">
                        {Number(booking.total).toLocaleString()} ฿
                      </td>
                      <td className="p-4">
                        <Badge variant={statusColors[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            booking.paymentStatus === "PAID"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {paymentLabels[booking.paymentStatus]}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดการจอง</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Booking Number */}
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">หมายเลขการจอง</p>
                <p className="text-lg font-bold font-mono">
                  {selectedBooking.bookingNumber}
                </p>
              </div>

              {/* Guest Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">ข้อมูลผู้จอง</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedBooking.guestName || selectedBooking.user.name || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedBooking.guestEmail || selectedBooking.user.email}
                    </span>
                  </div>
                  {(selectedBooking.guestPhone || selectedBooking.user.phone) && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedBooking.guestPhone || selectedBooking.user.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              {(selectedBooking.checkIn || selectedBooking.checkOut) && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedBooking.checkIn
                      ? new Date(selectedBooking.checkIn).toLocaleDateString("th-TH")
                      : "-"}{" "}
                    -{" "}
                    {selectedBooking.checkOut
                      ? new Date(selectedBooking.checkOut).toLocaleDateString("th-TH")
                      : "-"}
                  </span>
                </div>
              )}

              <Separator />

              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-semibold">รายการ</h4>
                {selectedBooking.items.map((item) => (
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
                <span className="text-primary">
                  {Number(selectedBooking.total).toLocaleString()} ฿
                </span>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">คำขอพิเศษ</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              <Separator />

              {/* Status Update */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    สถานะการจอง
                  </label>
                  <Select
                    value={selectedBooking.status}
                    onValueChange={(value) =>
                      updateBookingStatus(selectedBooking.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">รอยืนยัน</SelectItem>
                      <SelectItem value="CONFIRMED">ยืนยันแล้ว</SelectItem>
                      <SelectItem value="CHECKED_IN">เช็คอินแล้ว</SelectItem>
                      <SelectItem value="COMPLETED">เสร็จสิ้น</SelectItem>
                      <SelectItem value="CANCELLED">ยกเลิก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    สถานะการชำระเงิน
                  </label>
                  <Select
                    value={selectedBooking.paymentStatus}
                    onValueChange={(value) =>
                      updatePaymentStatus(selectedBooking.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNPAID">ยังไม่ชำระ</SelectItem>
                      <SelectItem value="PAID">ชำระแล้ว</SelectItem>
                      <SelectItem value="REFUNDED">คืนเงินแล้ว</SelectItem>
                      <SelectItem value="PARTIAL">ชำระบางส่วน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
