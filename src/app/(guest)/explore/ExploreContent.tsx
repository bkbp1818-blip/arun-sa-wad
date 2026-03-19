"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Phone,
  Clock,
  Ticket,
  Navigation,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EXPLORE_PLACES as STATIC_PLACES,
  HOTEL_LOCATION,
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

// Unified place type for display
interface DisplayPlace {
  id: string;
  name: string;
  nameTh: string;
  lat: number;
  lng: number;
  type: string; // lowercase: temple, food, market, etc.
  description: string;
  distance: string;
  phone?: string | null;
  website?: string | null;
  openingHours?: string | null;
  admissionFee?: string | null;
  highlights: string[];
  images: string[];
}

const TYPE_COLORS: Record<string, string> = {
  temple: "#E74C3C",
  food: "#27AE60",
  market: "#F39C12",
  landmark: "#9B59B6",
  museum: "#3498DB",
  event: "#E91E63",
};

const TYPE_LABELS: Record<string, string> = {
  temple: "วัด",
  food: "ร้านอาหาร",
  market: "ตลาด",
  landmark: "สถานที่สำคัญ",
  museum: "พิพิธภัณฑ์",
  event: "เทศกาล",
};

type FilterType = "all" | string;

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "temple", label: "วัด" },
  { value: "food", label: "อาหาร" },
  { value: "market", label: "ตลาด" },
  { value: "landmark", label: "สถานที่" },
  { value: "museum", label: "พิพิธภัณฑ์" },
  { value: "event", label: "เทศกาล" },
];

function PlaceCard({ place }: { place: DisplayPlace }) {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${place.lat},${place.lng}&travelmode=walking`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasMultipleImages = place.images.length > 1;

  const startCycling = useCallback(() => {
    if (!hasMultipleImages) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % place.images.length);
    }, 1500);
  }, [hasMultipleImages, place.images.length]);

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIndex(0);
  }, []);

  const typeColor = TYPE_COLORS[place.type] || "#888";
  const typeLabel = TYPE_LABELS[place.type] || place.type;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Image with auto-cycle on hover */}
      <div
        className="relative aspect-[4/3] bg-muted"
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        {place.images[0] ? (
          <img
            src={place.images[currentIndex] || place.images[0]}
            alt={place.nameTh}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        {/* Type badge top-left */}
        <Badge
          className="absolute top-2 left-2 text-white text-[10px]"
          style={{ backgroundColor: typeColor }}
        >
          {typeLabel}
        </Badge>
        {hasMultipleImages && (
          <>
            <Badge className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/60 text-white border-0 flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {place.images.length} รูป
            </Badge>
            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {place.images.map((_, index) => (
                <span
                  key={index}
                  className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-2">
          <h3 className="font-semibold text-sm sm:text-base leading-tight">
            {place.nameTh}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {place.name}
          </p>
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
  const [places, setPlaces] = useState<DisplayPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaces() {
      try {
        const res = await fetch("/api/explore-places");
        if (res.ok) {
          const dbPlaces = await res.json();
          if (dbPlaces.length > 0) {
            // Use DB data - convert types to lowercase
            const mapped: DisplayPlace[] = dbPlaces.map((p: any) => ({
              id: p.id,
              name: p.name,
              nameTh: p.nameTh,
              lat: p.latitude,
              lng: p.longitude,
              type: p.type.toLowerCase(),
              description: p.description,
              distance: p.distance,
              phone: p.phone,
              website: p.website,
              openingHours: p.openingHours,
              admissionFee: p.admissionFee,
              highlights: p.highlights || [],
              images: p.images || [],
            }));
            setPlaces(mapped);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to static data
      }
      // Fallback: use static data
      const staticMapped: DisplayPlace[] = STATIC_PLACES.map((p) => ({
        id: p.name,
        name: p.name,
        nameTh: p.nameTh,
        lat: p.lat,
        lng: p.lng,
        type: p.type,
        description: p.description,
        distance: p.distance,
        phone: p.phone,
        website: p.website,
        openingHours: p.openingHours,
        admissionFee: p.admissionFee,
        highlights: p.highlights || [],
        images: p.images || [],
      }));
      setPlaces(staticMapped);
      setLoading(false);
    }
    fetchPlaces();
  }, []);

  const filteredPlaces =
    filter === "all"
      ? places
      : places.filter((p) => p.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                ? places.length
                : places.filter((p) => p.type === opt.value).length;
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
            <PlaceCard key={place.id} place={place} />
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
