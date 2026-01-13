"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAffiliate } from "@/hooks/useAffiliate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import type { Product } from "@prisma/client";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { items, addItem, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { affiliateId } = useAffiliate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Add product from URL params
  useEffect(() => {
    async function addProductFromParams() {
      const roomId = searchParams.get("room");
      const tourId = searchParams.get("tour");
      const serviceId = searchParams.get("service");

      const productId = roomId || tourId || serviceId;
      if (!productId) return;

      // Check if already in cart
      if (items.some((item) => item.productId === productId)) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const product: Product = await res.json();
          addItem({
            productId: product.id,
            name: product.name,
            nameTh: product.nameTh,
            price: Number(product.price),
            quantity: 1,
            type: product.type,
          });
        }
      } catch (error) {
        console.error("Failed to add product:", error);
      } finally {
        setLoading(false);
      }
    }

    addProductFromParams();
  }, [searchParams, addItem, items]);

  // Pre-fill user info
  useEffect(() => {
    if (session?.user) {
      setGuestName(session.user.name || "");
      setGuestEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      alert("กรุณาเลือกสินค้าหรือบริการก่อน");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            serviceDate: item.serviceDate,
            notes: item.notes,
          })),
          guestName,
          email: guestEmail,
          phone: guestPhone,
          specialRequests,
          affiliateId: affiliateId || undefined,
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        clearCart();
        // Redirect to payment page
        router.push(`/payment/${booking.id}`);
      } else {
        const error = await res.json();
        alert(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  const hasRoomInCart = items.some((item) => item.type === "ROOM");

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        กลับหน้าหลัก
      </Link>

      <h1 className="text-3xl font-bold mb-8">ยืนยันการจอง</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ตะกร้าว่างเปล่า</h3>
            <p className="text-muted-foreground mb-4">
              เลือกห้องพัก ทัวร์ หรือบริการเพื่อเริ่มต้น
            </p>
            <Button asChild>
              <Link href="/rooms">ดูห้องพัก</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>รายการที่เลือก</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.nameTh}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toLocaleString()} ฿
                          {item.type === "ROOM" ? "/คืน" : item.type === "TOUR" ? "/คน" : ""}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Total */}
                      <div className="w-24 text-right font-medium">
                        {(item.price * item.quantity).toLocaleString()} ฿
                      </div>

                      {/* Remove */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dates for Room */}
              {hasRoomInCart && (
                <Card>
                  <CardHeader>
                    <CardTitle>วันที่เข้าพัก</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        เช็คอิน
                      </label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required={hasRoomInCart}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        เช็คเอาท์
                      </label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        required={hasRoomInCart}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guest Info */}
              <Card>
                <CardHeader>
                  <CardTitle>ข้อมูลผู้จอง</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">ชื่อ-นามสกุล</label>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="ชื่อ-นามสกุล"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">อีเมล</label>
                      <Input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">เบอร์โทร</label>
                      <Input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      คำขอพิเศษ (ถ้ามี)
                    </label>
                    <Input
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="เช่น เตียงเสริม, ห้องชั้นล่าง"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>สรุปการจอง</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>
                          {item.nameTh} x{item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toLocaleString()} ฿</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>รวมทั้งหมด</span>
                    <span className="text-primary">{getTotal().toLocaleString()} ฿</span>
                  </div>

                  {!session ? (
                    <Button asChild className="w-full">
                      <Link href="/login">เข้าสู่ระบบเพื่อจอง</Link>
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          กำลังดำเนินการ...
                        </>
                      ) : (
                        "ดำเนินการชำระเงิน"
                      )}
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    การจองจะถูกยืนยันหลังจากการชำระเงิน
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default function BookingPage() {
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
      <BookingContent />
    </Suspense>
  );
}
