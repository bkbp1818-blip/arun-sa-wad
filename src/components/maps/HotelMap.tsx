"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  HOTEL_LOCATION,
  NEARBY_PLACES,
  PLACE_TYPE_COLORS,
  PLACE_TYPE_LABELS,
  type NearbyPlace,
} from "@/lib/constants/nearby-places";

// Fix Leaflet default icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

interface HotelMapProps {
  height?: string;
  showNearbyPlaces?: boolean;
}

export function HotelMap({
  height = "400px",
  showNearbyPlaces = true,
}: HotelMapProps) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <MapContainer
        center={[HOTEL_LOCATION.lat, HOTEL_LOCATION.lng]}
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
        >
          <Popup>
            <div className="max-w-[200px]">
              <h3 className="font-bold text-sm">{HOTEL_LOCATION.nameTh}</h3>
              <p className="text-xs text-gray-600 mt-1">
                {HOTEL_LOCATION.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 underline mt-2 inline-block"
              >
                เปิดใน Google Maps
              </a>
            </div>
          </Popup>
        </Marker>

        {/* Nearby Places Markers */}
        {showNearbyPlaces &&
          NEARBY_PLACES.map((place) => (
            <Marker
              key={place.name}
              position={[place.lat, place.lng]}
              icon={createColoredIcon(PLACE_TYPE_COLORS[place.type])}
            >
              <Popup>
                <div className="max-w-[220px]">
                  <div className="flex items-center gap-1 mb-1">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        backgroundColor: PLACE_TYPE_COLORS[place.type],
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      {PLACE_TYPE_LABELS[place.type]}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm">{place.nameTh}</h3>
                  <p className="text-xs text-gray-500">{place.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {place.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      ห่างจากโรงแรม {place.distance}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${place.lat},${place.lng}&travelmode=walking`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      เส้นทาง
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
