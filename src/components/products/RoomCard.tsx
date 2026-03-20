"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Wifi, Wind } from "lucide-react";
import type { Product } from "@prisma/client";
import { useTranslation, getLocalizedName, getLocalizedDesc } from "@/lib/i18n";

interface RoomCardProps {
  room: Product & { nameZh?: string | null; descZh?: string | null };
}

export function RoomCard({ room }: RoomCardProps) {
  const price = Number(room.price);
  const { t, locale } = useTranslation();
  const name = getLocalizedName(locale, room);
  const desc = getLocalizedDesc(locale, room);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted">
        {room.images[0] ? (
          <img
            src={room.images[0]}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {t("common.noImage")}
          </div>
        )}
        {room.roomNumber && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            {t("rooms.room")} {room.roomNumber}
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {desc}
        </p>

        {/* Features */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {room.capacity && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{room.capacity} {t("rooms.person")}</span>
            </div>
          )}
          {room.amenities.includes("WiFi") && (
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
            </div>
          )}
          {room.amenities.includes("Air Conditioning") && (
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground"> {t("rooms.perNight")}</span>
        </div>
        <Button asChild className="w-full sm:w-auto h-11">
          <Link href={`/rooms/${room.id}`}>{t("rooms.viewDetails")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
