"use client";

import { MapPin, Train, Car, Phone, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HOTEL_LOCATION,
  NEARBY_PLACES,
  PLACE_TYPE_COLORS,
} from "@/lib/constants/nearby-places";
import { useTranslation, getLocalizedName } from "@/lib/i18n";
import type { Locale } from "@/hooks/useLanguage";
import type { TranslationKey } from "@/lib/i18n/th";

const placeTypeKeys: Record<string, TranslationKey> = {
  temple: "placeType.temple",
  market: "placeType.market",
  transport: "placeType.transport",
  landmark: "placeType.landmark",
  food: "placeType.food",
  museum: "placeType.museum",
  event: "placeType.event",
};

export function LocationContent({ mapSection }: { mapSection: React.ReactNode }) {
  const { t, locale } = useTranslation();

  const getPlaceName = (place: { name: string; nameTh: string; nameZh?: string }) => {
    return getLocalizedName(locale, place);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            <MapPin className="h-3 w-3 mr-1" />
            {t("location.badge")}
          </Badge>
          <h1 className="text-3xl font-bold md:text-4xl">{t("location.title")}</h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            {t("location.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Map Section - takes 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {mapSection}

            {/* Address Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">{HOTEL_LOCATION.nameTh}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {HOTEL_LOCATION.address}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Button size="sm" asChild>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          {t("location.getDirections")}
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${HOTEL_LOCATION.phone}`}>
                          <Phone className="h-3.5 w-3.5 mr-1" />
                          {t("location.callUs")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Get Here */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("location.howToGetHere")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Train className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{t("location.mrt")}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t("location.mrtDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{t("location.taxi")}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t("location.taxiDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{t("location.privateCar")}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t("location.privateCarDesc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("location.nearbyPlaces")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {NEARBY_PLACES.map((place) => (
                  <div
                    key={place.name}
                    className="flex items-start gap-2 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: PLACE_TYPE_COLORS[place.type] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">
                          {getPlaceName(place)}
                        </h4>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">
                          {t(placeTypeKeys[place.type] || "placeType.landmark")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {place.distance} — {place.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
