"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HOTEL_LOCATION } from "@/lib/constants/nearby-places";

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

function createColoredIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

const hotelIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="background:#dc2626;color:white;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;">${HOTEL_LOCATION.nameTh}</div>
    <div style="width:12px;height:12px;background:#dc2626;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);margin-top:4px;"></div>
  </div>`,
  iconSize: [100, 40],
  iconAnchor: [50, 40],
  popupAnchor: [0, -40],
});

export interface MapPlace {
  id: string;
  name: string;
  nameTh: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
  distance: string;
  openingHours?: string | null;
}

interface ExploreMapProps {
  places: MapPlace[];
  height?: string;
}

export function ExploreMap({ places, height = "450px" }: ExploreMapProps) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Radius circle ~2.5km */}
        <Circle
          center={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]}
          radius={2500}
          pathOptions={{
            color: "#dc2626",
            fillColor: "#dc2626",
            fillOpacity: 0.05,
            weight: 1,
            dashArray: "5, 10",
          }}
        />

        {/* Hotel Marker */}
        <Marker
          position={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]}
          icon={hotelIcon}
        >
          <Popup>
            <div className="max-w-[200px]">
              <h3 className="font-bold text-sm">{HOTEL_LOCATION.nameTh}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {HOTEL_LOCATION.address}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Place Markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createColoredIcon(TYPE_COLORS[place.type] || "#888")}
          >
            <Popup>
              <div className="max-w-[240px]">
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{
                      backgroundColor: TYPE_COLORS[place.type] || "#888",
                    }}
                  />
                  <span className="text-xs text-gray-500">
                    {TYPE_LABELS[place.type] || place.type}
                  </span>
                </div>
                <h3 className="font-bold text-sm">{place.nameTh}</h3>
                <p className="text-xs text-gray-500">{place.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {place.description}
                </p>
                {place.openingHours && (
                  <p className="text-xs text-gray-500 mt-1">
                    {place.openingHours}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    ห่าง {place.distance}
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${place.lat},${place.lng}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    นำทาง
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
