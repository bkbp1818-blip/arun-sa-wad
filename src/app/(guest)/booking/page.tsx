"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useAffiliate } from "@/hooks/useAffiliate";
import { useTranslation, getLocalizedName } from "@/lib/i18n";
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
  const { t, locale } = useTranslation();

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
      alert(t("booking.selectFirst"));
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
        router.push(`/payment/${booking.id}`);
      } else {
        const error = await res.json();
        alert(error.message || t("booking.error"));
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert(t("booking.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const getItemDisplayName = (item: { name: string; nameTh: string; nameZh?: string }) => {
    return getLocalizedName(locale, item);
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
        {t("booking.backHome")}
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t("booking.title")}</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("booking.emptyCart")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("booking.emptyCartDesc")}
            </p>
            <Button asChild>
              <Link href="/rooms">{t("booking.viewRooms")}</Link>
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
                  <CardTitle>{t("booking.selectedItems")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="py-3 border-b last:border-0"
                    >
                      {/* Row 1: Name + Remove */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{getItemDisplayName(item)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.price.toLocaleString()} {t("common.baht")}
                            {item.type === "ROOM" ? t("common.perNight") : item.type === "TOUR" ? t("common.perPerson") : ""}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive shrink-0 -mt-1 -mr-2"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Row 2: Quantity + Total */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() =>
                              updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="font-semibold text-primary">
                          {(item.price * item.quantity).toLocaleString()} {t("common.baht")}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dates for Room */}
              {hasRoomInCart && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("booking.stayDates")}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t("booking.checkIn")}
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
                        {t("booking.checkOut")}
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
                  <CardTitle>{t("booking.guestInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("booking.fullName")}</label>
                    <Input
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={t("booking.fullName")}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("booking.email")}</label>
                      <Input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("booking.phone")}</label>
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
                      {t("booking.specialRequests")}
                    </label>
                    <Input
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder={t("booking.specialRequestsPlaceholder")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t("booking.summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>
                          {getItemDisplayName(item)} x{item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toLocaleString()} {t("common.baht")}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>{t("booking.total")}</span>
                    <span className="text-primary">{getTotal().toLocaleString()} {t("common.baht")}</span>
                  </div>

                  {!session ? (
                    <Button asChild className="w-full">
                      <Link href="/login">{t("booking.loginToBook")}</Link>
                    </Button>
                  ) : (
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("booking.processing")}
                        </>
                      ) : (
                        t("booking.proceedPayment")
                      )}
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    {t("booking.confirmNote")}
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
