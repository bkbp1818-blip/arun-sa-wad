"use client";

import dynamic from "next/dynamic";

const HotelMap = dynamic(
  () => import("@/components/maps/HotelMap").then((mod) => ({ default: mod.HotelMap })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted rounded-lg animate-pulse" style={{ height: "500px" }} />
    ),
  }
);

export function LocationMapSection() {
  return <HotelMap height="500px" showNearbyPlaces />;
}
