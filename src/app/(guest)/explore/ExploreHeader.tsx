"use client";

import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";

export function ExploreHeader() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-10 sm:py-12">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          <MapPin className="h-3 w-3 mr-1" />
          {t("explore.badge")}
        </Badge>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {t("explore.title")}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          {t("explore.subtitle")}
        </p>
      </div>
    </section>
  );
}
