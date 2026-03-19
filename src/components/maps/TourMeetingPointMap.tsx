"use client";

import { useState } from "react";
import { Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { HOTEL_LOCATION } from "@/lib/constants/nearby-places";

interface TourMeetingPointMapProps {
  meetingPointName: string;
  lat: number;
  lng: number;
  height?: string;
}

export function TourMeetingPointMap({
  meetingPointName,
  lat,
  lng,
  height = "300px",
}: TourMeetingPointMapProps) {
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="bg-muted rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-4">
          <p className="text-sm">แผนที่ไม่พร้อมใช้งาน</p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${lat},${lng}&travelmode=walking`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline mt-2 inline-block"
          >
            ดูเส้นทางใน Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Center between hotel and meeting point
  const centerLat = (HOTEL_LOCATION.lat + lat) / 2;
  const centerLng = (HOTEL_LOCATION.lng + lng) / 2;

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <Map
        defaultCenter={{ lat: centerLat, lng: centerLng }}
        defaultZoom={16}
        mapId="tour-meeting-map"
        gestureHandling="cooperative"
        disableDefaultUI={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Hotel Marker */}
        <AdvancedMarker
          position={{ lat: HOTEL_LOCATION.lat, lng: HOTEL_LOCATION.lng }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
              โรงแรม
            </div>
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white shadow mt-0.5" />
          </div>
        </AdvancedMarker>

        {/* Meeting Point Marker */}
        <AdvancedMarker
          position={{ lat, lng }}
          onClick={() => setShowMeetingInfo(true)}
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
              จุดนัดพบ
            </div>
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white shadow mt-0.5" />
          </div>
        </AdvancedMarker>

        {showMeetingInfo && (
          <InfoWindow
            position={{ lat, lng }}
            onCloseClick={() => setShowMeetingInfo(false)}
          >
            <div className="p-1 max-w-[200px]">
              <h3 className="font-bold text-sm">จุดนัดพบ</h3>
              <p className="text-xs text-gray-600">{meetingPointName}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${lat},${lng}&travelmode=walking`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 underline mt-2 inline-block"
              >
                ดูเส้นทาง
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
