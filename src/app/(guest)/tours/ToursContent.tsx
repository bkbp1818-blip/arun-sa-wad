"use client";

import { TourCard } from "@/components/products/TourCard";
import { useTranslation } from "@/lib/i18n";
import type { Product } from "@prisma/client";

export function ToursContent({ tours }: { tours: Product[] }) {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("tours.title")}</h1>
        <p className="text-muted-foreground">
          {t("tours.subtitle")}
        </p>
      </div>

      {/* Tour Grid */}
      {tours.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("tours.notFound")}</p>
        </div>
      )}
    </div>
  );
}
