"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOTEL_LOCATION } from "@/lib/constants/nearby-places";

const hotelIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="background:#dc2626;color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.3);">โรงแรม</div>
    <div style="width:10px;height:10px;background:#dc2626;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);margin-top:2px;"></div>
  </div>`,
  iconSize: [60, 30],
  iconAnchor: [30, 30],
  popupAnchor: [0, -30],
});

const meetingIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="background:#2563eb;color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.3);">จุดนัดพบ</div>
    <div style="width:10px;height:10px;background:#2563eb;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);margin-top:2px;"></div>
  </div>`,
  iconSize: [70, 30],
  iconAnchor: [35, 30],
  popupAnchor: [0, -30],
});

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
  const centerLat = (HOTEL_LOCATION.lat + lat) / 2;
  const centerLng = (HOTEL_LOCATION.lng + lng) / 2;

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hotel Marker */}
        <Marker
          position={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]}
          icon={hotelIcon}
        />

        {/* Meeting Point Marker */}
        <Marker position={[lat, lng]} icon={meetingIcon}>
          <Popup>
            <div className="max-w-[200px]">
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
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
