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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EXPLORE_PLACES as STATIC_PLACES,
  HOTEL_LOCATION,
  HOTEL_BRANCHES,
} from "@/lib/constants/explore-places";
import type { HotelBranch } from "@/lib/constants/explore-places";

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

type OriginType = { lat: number; lng: number } | "current" | "custom";

function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): string {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = R * c;
  if (meters < 1000) return `${Math.round(meters)} ม.`;
  return `${(meters / 1000).toFixed(1)} กม.`;
}

function buildGoogleMapsUrl(
  origin: OriginType,
  destination: { lat: number; lng: number }
): string {
  const dest = `${destination.lat},${destination.lng}`;
  if (origin === "current" || origin === "custom") {
    // ไม่ใส่ origin → Google Maps ใช้ตำแหน่งปัจจุบันหรือให้ผู้ใช้กรอกเอง
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=walking`;
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest}&travelmode=walking`;
}

function PlaceCard({ place, origin }: { place: DisplayPlace; origin: OriginType }) {
  const googleMapsUrl = buildGoogleMapsUrl(origin, { lat: place.lat, lng: place.lng });
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
            <span>ห่างจากจุดเริ่มต้น {(() => {
              if (origin === "custom") return "-";
              if (origin === "current") return place.distance;
              return calculateDistance(origin.lat, origin.lng, place.lat, place.lng);
            })()}</span>
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

function CarouselRow({
  title,
  color,
  places,
  origin,
}: {
  title: string;
  color: string;
  places: DisplayPlace[];
  origin: OriginType;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      // Also check on resize
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll, places]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 280 + 16; // card width + gap
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h2 className="font-semibold text-lg">{title}</h2>
          <span className="text-sm text-muted-foreground">
            ({places.length})
          </span>
        </div>
        {/* Desktop scroll buttons */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div className="relative -mx-4 px-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {places.map((place) => (
            <div
              key={place.id}
              className="snap-start shrink-0 w-[280px] sm:w-[300px]"
            >
              <PlaceCard place={place} origin={origin} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Origin selector option type
type OriginOptionId = "current" | "custom" | string; // string = branch id

export function ExploreContent() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [places, setPlaces] = useState<DisplayPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOriginId, setSelectedOriginId] = useState<OriginOptionId>("chinatown");
  const [gpsPosition, setGpsPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const originScrollRef = useRef<HTMLDivElement>(null);

  // Compute the actual origin value from selectedOriginId
  const origin: OriginType = (() => {
    if (selectedOriginId === "current") {
      return gpsPosition ? { lat: gpsPosition.lat, lng: gpsPosition.lng } : "current";
    }
    if (selectedOriginId === "custom") return "custom";
    const branch = HOTEL_BRANCHES.find((b) => b.id === selectedOriginId);
    if (branch) return { lat: branch.lat, lng: branch.lng };
    return { lat: HOTEL_BRANCHES[0].lat, lng: HOTEL_BRANCHES[0].lng };
  })();

  // Handle GPS request when "ตำแหน่งของฉัน" is selected
  useEffect(() => {
    if (selectedOriginId !== "current") return;
    if (gpsPosition) return; // already got position
    if (!navigator.geolocation) {
      setGpsError("เบราว์เซอร์ไม่รองรับ GPS");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsError(null);
      },
      (err) => {
        setGpsError("ไม่สามารถดึงตำแหน่งได้ — จะใช้ตำแหน่งปัจจุบันจาก Google Maps แทน");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [selectedOriginId, gpsPosition]);

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
      <ExploreMap places={filteredPlaces} origin={origin} selectedOriginId={selectedOriginId} />

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

      {/* Origin Selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">เริ่มจาก:</p>
        <div
          ref={originScrollRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* ตำแหน่งของฉัน */}
          <button
            onClick={() => setSelectedOriginId("current")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedOriginId === "current"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
          >
            📍 ตำแหน่งของฉัน
          </button>
          {/* Hotel branches */}
          {HOTEL_BRANCHES.map((branch) => (
            <button
              key={branch.id}
              onClick={() => setSelectedOriginId(branch.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedOriginId === branch.id
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              🏨 {branch.shortName}
            </button>
          ))}
          {/* เลือกเอง */}
          <button
            onClick={() => setSelectedOriginId("custom")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selectedOriginId === "custom"
                ? "bg-green-600 text-white border-green-600"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
          >
            🗺️ เลือกเอง
          </button>
        </div>
        {/* GPS status message */}
        {selectedOriginId === "current" && gpsError && (
          <p className="text-xs text-amber-600">{gpsError}</p>
        )}
        {selectedOriginId === "current" && gpsPosition && (
          <p className="text-xs text-green-600">ได้ตำแหน่ง GPS แล้ว</p>
        )}
      </div>

      {/* Cards Carousel by Category */}
      {filteredPlaces.length > 0 ? (
        filter === "all" ? (
          // Show grouped by type
          FILTER_OPTIONS.filter((o) => o.value !== "all").map((opt) => {
            const typePlaces = places.filter((p) => p.type === opt.value);
            if (typePlaces.length === 0) return null;
            return (
              <CarouselRow
                key={opt.value}
                title={opt.label}
                color={TYPE_COLORS[opt.value] || "#888"}
                places={typePlaces}
                origin={origin}
              />
            );
          })
        ) : (
          // Show single category
          <CarouselRow
            title={TYPE_LABELS[filter] || filter}
            color={TYPE_COLORS[filter] || "#888"}
            places={filteredPlaces}
            origin={origin}
          />
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">ไม่พบสถานที่ในหมวดนี้</p>
        </div>
      )}
    </div>
  );
}
