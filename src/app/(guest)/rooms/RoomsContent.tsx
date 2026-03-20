"use client";

import { RoomCard } from "@/components/products/RoomCard";
import { useTranslation } from "@/lib/i18n";
import type { Product } from "@prisma/client";

export function RoomsContent({ rooms }: { rooms: Product[] }) {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("rooms.title")}</h1>
        <p className="text-muted-foreground">
          {t("rooms.subtitle")}
        </p>
      </div>

      {/* Room Grid */}
      {rooms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("rooms.notFound")}</p>
        </div>
      )}
    </div>
  );
}
