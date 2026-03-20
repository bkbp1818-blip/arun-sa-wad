"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@prisma/client";
import { useTranslation, getLocalizedName, getLocalizedDesc } from "@/lib/i18n";
import type { Locale } from "@/hooks/useLanguage";

interface ServiceCardProps {
  service: Product & { nameZh?: string | null; descZh?: string | null };
  onAddToCart?: (product: Product) => void;
}

const typeLabels: Record<string, Record<Locale, string>> = {
  FOOD: { th: "อาหาร", en: "Food", zh: "美食" },
  SERVICE: { th: "บริการ", en: "Service", zh: "服务" },
  MERCH: { th: "ของฝาก", en: "Souvenir", zh: "伴手礼" },
};

export function ServiceCard({ service, onAddToCart }: ServiceCardProps) {
  const price = Number(service.price);
  const { t, locale } = useTranslation();
  const name = getLocalizedName(locale, service);
  const desc = getLocalizedDesc(locale, service);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted">
        {service.images[0] ? (
          <img
            src={service.images[0]}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {t("common.noImage")}
          </div>
        )}
        <Badge className="absolute top-2 left-2" variant="secondary">
          {typeLabels[service.type]?.[locale] || service.type}
        </Badge>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {desc}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-primary">
            {price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground"> {t("common.baht")}</span>
        </div>
        <Button onClick={() => onAddToCart?.(service)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {t("services.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
}
