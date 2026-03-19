"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Phone,
  Clock,
  Ticket,
  Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EXPLORE_PLACES,
  EXPLORE_TYPE_COLORS,
  EXPLORE_TYPE_LABELS,
  HOTEL_LOCATION,
  type ExplorePlaceType,
  type ExplorePlace,
} from "@/lib/constants/explore-places";

const ExploreMap = dynamic(
  () =>
    import("@/components/maps/ExploreMap").then((mod) => ({
      default: mod.ExploreMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-muted rounded-lg animate-pulse"
        style={{ height: "450px" }}
      />
    ),
  }
);

type FilterType = "all" | ExplorePlaceType;

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "temple", label: "วัด" },
  { value: "food", label: "อาหาร" },
  { value: "market", label: "ตลาด" },
  { value: "landmark", label: "สถานที่" },
  { value: "museum", label: "พิพิธภัณฑ์" },
  { value: "event", label: "เทศกาล" },
];

function PlaceCard({ place }: { place: ExplorePlace }) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${place.lat},${place.lng}&travelmode=walking`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base leading-tight">
              {place.nameTh}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {place.name}
            </p>
          </div>
          <Badge
            className="shrink-0 text-white text-[10px]"
            style={{ backgroundColor: EXPLORE_TYPE_COLORS[place.type] }}
          >
            {EXPLORE_TYPE_LABELS[place.type]}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
          {place.description}
        </p>

        {/* Highlights */}
        {place.highlights && place.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.highlights.map((h) => (
              <Badge
                key={h}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {h}
              </Badge>
            ))}
          </div>
        )}

        {/* Info rows */}
        <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
          {place.openingHours && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{place.openingHours}</span>
            </div>
          )}
          {place.admissionFee && (
            <div className="flex items-center gap-1.5">
              <Ticket className="h-3 w-3 shrink-0" />
              <span>{place.admissionFee}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span>ห่างจากโรงแรม {place.distance}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1 text-xs h-8" asChild>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="h-3 w-3 mr-1" />
              นำทาง
            </a>
          </Button>
          {place.phone && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8"
              asChild
            >
              <a href={`tel:${place.phone}`}>
                <Phone className="h-3 w-3 mr-1" />
                โทร
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ExploreContent() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredPlaces =
    filter === "all"
      ? EXPLORE_PLACES
      : EXPLORE_PLACES.filter((p) => p.type === filter);

  return (
    <div className="space-y-6">
      {/* Map */}
      <ExploreMap places={filteredPlaces} />

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterType)}
        className="w-full"
      >
        <TabsList className="w-full flex overflow-x-auto">
          {FILTER_OPTIONS.map((opt) => {
            const count =
              opt.value === "all"
                ? EXPLORE_PLACES.length
                : EXPLORE_PLACES.filter((p) => p.type === opt.value).length;
            return (
              <TabsTrigger
                key={opt.value}
                value={opt.value}
                className="flex-1 min-w-0 text-xs sm:text-sm"
              >
                {opt.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Cards Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.name} place={place} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบสถานที่ในหมวดนี้</p>
        </div>
      )}
    </div>
  );
}
