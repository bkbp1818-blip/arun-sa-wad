"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Wifi, Wind, Tv, Bath } from "lucide-react";
import { ImageGallery } from "@/components/products/ImageGallery";
import { useTranslation, getLocalizedName, getLocalizedDesc } from "@/lib/i18n";
import type { Product } from "@prisma/client";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-5 w-5" />,
  "Air Conditioning": <Wind className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  "Private Bathroom": <Bath className="h-5 w-5" />,
};

export function RoomDetailContent({ room }: { room: Product & { nameZh?: string | null; descZh?: string | null } }) {
  const price = Number(room.price);
  const { t, locale } = useTranslation();
  const name = getLocalizedName(locale, room);
  const desc = getLocalizedDesc(locale, room);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Back Button */}
      <Link
        href="/rooms"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("rooms.backToRooms")}
      </Link>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <ImageGallery images={room.images} alt={name} />

        {/* Details */}
        <div>
          <div className="mb-4">
            {room.roomNumber && (
              <Badge variant="secondary" className="mb-2">
                {t("rooms.room")} {room.roomNumber}
              </Badge>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
            {locale !== "th" && room.nameTh && (
              <p className="text-sm sm:text-base text-muted-foreground">{room.nameTh}</p>
            )}
            {locale === "th" && room.name !== room.nameTh && (
              <p className="text-sm sm:text-base text-muted-foreground">{room.name}</p>
            )}
          </div>

          {/* Capacity */}
          {room.capacity && (
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{t("rooms.capacity")} {room.capacity} {t("rooms.person")}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            {desc}
          </p>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">{t("rooms.amenities")}</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm"
                  >
                    {amenityIcons[amenity] || (
                      <div className="h-5 w-5 rounded-full bg-primary/10" />
                    )}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price & Booking Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> {t("rooms.perNight")}</span>
                </div>
              </div>

              <Button size="lg" className="w-full h-12 text-base" asChild>
                <Link href={`/booking?room=${room.id}`}>
                  {t("rooms.bookThisRoom")}
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                {t("rooms.noCharge")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
