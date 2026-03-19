"use client";

import dynamic from "next/dynamic";

const TourMeetingPointMap = dynamic(
  () =>
    import("@/components/maps/TourMeetingPointMap").then((mod) => ({
      default: mod.TourMeetingPointMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-muted rounded-lg animate-pulse" style={{ height: "300px" }} />
    ),
  }
);

interface TourMeetingPointSectionProps {
  meetingPointName: string;
  lat: number;
  lng: number;
}

export function TourMeetingPointSection({
  meetingPointName,
  lat,
  lng,
}: TourMeetingPointSectionProps) {
  return (
    <TourMeetingPointMap
      meetingPointName={meetingPointName}
      lat={lat}
      lng={lng}
    />
  );
}
