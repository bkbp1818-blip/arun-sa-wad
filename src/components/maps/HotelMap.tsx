"use client";

import { useState, useCallback } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  HOTEL_LOCATION,
  NEARBY_PLACES,
  PLACE_TYPE_COLORS,
  PLACE_TYPE_LABELS,
  type NearbyPlace,
} from "@/lib/constants/nearby-places";

interface HotelMapProps {
  height?: string;
  showNearbyPlaces?: boolean;
}

export function HotelMap({
  height = "400px",
  showNearbyPlaces = true,
}: HotelMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [showHotelInfo, setShowHotelInfo] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        className="bg-muted rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center text-muted-foreground p-4">
          <p className="font-medium">แผนที่ไม่พร้อมใช้งาน</p>
          <p className="text-sm mt-1">กรุณาตั้งค่า Google Maps API Key</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline mt-2 inline-block"
          >
            เปิดใน Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden" style={{ height }}>
      <Map
        defaultCenter={{ lat: HOTEL_LOCATION.lat, lng: HOTEL_LOCATION.lng }}
        defaultZoom={16}
        mapId="hotel-map"
        gestureHandling="cooperative"
        disableDefaultUI={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Hotel Marker */}
        <AdvancedMarker
          position={{ lat: HOTEL_LOCATION.lat, lng: HOTEL_LOCATION.lng }}
          onClick={() => setShowHotelInfo(true)}
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap">
              {HOTEL_LOCATION.nameTh}
            </div>
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow mt-1" />
          </div>
        </AdvancedMarker>

        {showHotelInfo && (
          <InfoWindow
            position={{ lat: HOTEL_LOCATION.lat, lng: HOTEL_LOCATION.lng }}
            onCloseClick={() => setShowHotelInfo(false)}
          >
            <div className="p-1 max-w-[200px]">
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
          </InfoWindow>
        )}

        {/* Nearby Places Markers */}
        {showNearbyPlaces &&
          NEARBY_PLACES.map((place) => (
            <AdvancedMarker
              key={place.name}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => setSelectedPlace(place)}
            >
              <div
                className="w-3 h-3 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: PLACE_TYPE_COLORS[place.type] }}
              />
            </AdvancedMarker>
          ))}

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="p-1 max-w-[220px]">
              <div className="flex items-center gap-1 mb-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    backgroundColor: PLACE_TYPE_COLORS[selectedPlace.type],
                  }}
                />
                <span className="text-xs text-gray-500">
                  {PLACE_TYPE_LABELS[selectedPlace.type]}
                </span>
              </div>
              <h3 className="font-bold text-sm">{selectedPlace.nameTh}</h3>
              <p className="text-xs text-gray-500">{selectedPlace.name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {selectedPlace.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  ห่างจากโรงแรม {selectedPlace.distance}
                </span>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${HOTEL_LOCATION.lat},${HOTEL_LOCATION.lng}&destination=${selectedPlace.lat},${selectedPlace.lng}&travelmode=walking`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 underline"
                >
                  เส้นทาง
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
