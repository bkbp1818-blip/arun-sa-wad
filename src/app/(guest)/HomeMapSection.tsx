"use client";

import dynamic from "next/dynamic";

const HotelMap = dynamic(
  () => import("@/components/maps/HotelMap").then((mod) => ({ default: mod.HotelMap })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted rounded-lg animate-pulse" style={{ height: "400px" }} />
    ),
  }
);

export function HomeMapSection() {
  return <HotelMap height="400px" showNearbyPlaces />;
}
